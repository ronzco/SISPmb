import express from "express";
import { getDb } from "../db/db.js";
import { announcements, applications, documents, payments, feeConfigs } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";
import { authenticate, AuthRequest, authorize } from "./middleware.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`[DATA-ROUTE] ${req.method} ${req.path}`);
  next();
});

// Announcements (Public)
router.get("/announcements", async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.select().from(announcements).orderBy(desc(announcements.createdAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
});

// Applications (Protected)
router.get("/applications/my", authenticate, async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const result = await db.select().from(applications).where(eq(applications.userId, req.user!.id));
    res.json(result);
  } catch (error: any) {
    console.error("Fetch application TRACE:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.post("/applications", authenticate, async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const id = uuidv4();
    const { fullName, birthPlace, birthDate, gender, address, phone, previousSchool, gradYear, program, major, status } = req.body;
    
    await db.insert(applications).values({
      id,
      userId: req.user!.id,
      fullName: fullName || "",
      birthPlace,
      birthDate,
      gender,
      address,
      phone,
      previousSchool,
      gradYear,
      program: program || "",
      major,
      status: status || "draft",
    });
    res.json({ success: true, id });
  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ error: "Failed to create application" });
  }
});

router.patch("/applications/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const { fullName, birthPlace, birthDate, gender, address, phone, previousSchool, gradYear, program, major, status, email } = req.body;
    
    const updateData: any = { updatedAt: new Date() };
    if (fullName !== undefined) updateData.fullName = fullName;
    if (birthPlace !== undefined) updateData.birthPlace = birthPlace;
    if (birthDate !== undefined) updateData.birthDate = birthDate;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;
    if (previousSchool !== undefined) updateData.previousSchool = previousSchool;
    if (gradYear !== undefined) updateData.gradYear = gradYear;
    if (program !== undefined) updateData.program = program;
    if (major !== undefined) updateData.major = major;
    if (status !== undefined) updateData.status = status;
    if (email !== undefined) updateData.email = email;

    await db.update(applications)
      .set(updateData)
      .where(eq(applications.id, req.params.id));
      
    res.json({ success: true });
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ error: "Failed to update application" });
  }
});

// Documents (Student)
router.get("/documents/my", authenticate, async (req: AuthRequest, res) => {
  try {
    console.log(`[DOCS] Fetching docs for user ${req.user!.id}`);
    const db = await getDb();
    const result = await db.select().from(documents).where(eq(documents.userId, req.user!.id));
    res.json(result);
  } catch (error: any) {
    console.error("Fetch documents TRACE:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: error.message
    });
  }
});

router.post("/documents", authenticate, async (req: AuthRequest, res) => {
  try {
    console.log(`[DOCS] Uploading doc for user ${req.user!.id}`, req.body);
    const db = await getDb();
    const id = uuidv4();
    await db.insert(documents).values({
      id,
      userId: req.user!.id,
      type: req.body.type,
      url: req.body.url,
      status: "pending",
    });
    res.json({ success: true, id });
  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ error: "Failed to upload document" });
  }
});

router.delete("/documents/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    await db.delete(documents).where(eq(documents.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// Payments (Student)
router.get("/payments/my", authenticate, async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    const result = await db.select().from(payments).where(eq(payments.userId, req.user!.id));
    res.json(result); // Return the whole list instead of result[0]
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

router.post("/payments", authenticate, async (req: AuthRequest, res) => {
  try {
    console.log(`[PAYMENT] Creating payment for user ${req.user!.id}`, req.body);
    const db = await getDb();
    const id = uuidv4();
    await db.insert(payments).values({
      id,
      userId: req.user!.id,
      amount: req.body.amount,
      method: req.body.method,
      status: req.body.status || "pending",
      category: req.body.category || "registration", // Handle category
      transactionId: req.body.transactionId || `TRX-${Date.now()}`,
      paidAt: req.body.paidAt ? new Date(req.body.paidAt) : new Date(),
    });

    if (req.body.status === "success") {
      if (req.body.category === "tuition") {
        await db.update(applications)
          .set({ reRegistrationPaid: true, updatedAt: new Date() })
          .where(eq(applications.userId, req.user!.id));
      } else {
        await db.update(applications)
          .set({ status: "verifying", updatedAt: new Date() })
          .where(eq(applications.userId, req.user!.id));
      }
    }

    res.json({ success: true, id });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ error: "Failed to process payment" });
  }
});

// Admin routes
router.get("/admin/applications", authenticate, authorize(["superadmin", "committee_academic"]), async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.select().from(applications).orderBy(desc(applications.updatedAt));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Fee Configs
router.get("/fees", async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.select().from(feeConfigs);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fees" });
  }
});

export default router;
