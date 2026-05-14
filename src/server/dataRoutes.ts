import express from "express";
import { getDb } from "../db/db";
import { announcements, applications, documents, payments, feeConfigs } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { authenticate, AuthRequest, authorize } from "./middleware";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

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
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications" });
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
    
    // Build update object only with allowed fields
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
