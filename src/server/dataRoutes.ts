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
    await db.insert(applications).values({
      ...req.body,
      id,
      userId: req.user!.id,
      status: "draft",
    });
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create application" });
  }
});

router.patch("/applications/:id", authenticate, async (req: AuthRequest, res) => {
  try {
    const db = await getDb();
    await db.update(applications)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(applications.id, req.params.id));
    res.json({ success: true });
  } catch (error) {
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
