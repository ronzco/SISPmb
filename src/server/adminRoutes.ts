import express from 'express';
import { getDb } from '../db/db';
import { applications, announcements, feeConfigs, users, documents, activityLogs, payments } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { authenticate, authorize } from './middleware';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all logs (admin only)
router.get('/logs', authenticate, authorize(['superadmin']), async (req, res) => {
  try {
    const db = await getDb();
    const allLogs = await db.select().from(activityLogs).orderBy(desc(activityLogs.timestamp)).limit(100);
    res.json(allLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Get user documents
router.get('/documents/:userId', authenticate, authorize(['admin', 'superadmin']), async (req, res) => {
  try {
    const db = await getDb();
    const userDocs = await db.select().from(documents).where(eq(documents.userId, req.params.userId));
    res.json(userDocs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Update document status
router.patch('/documents/:id/status', authenticate, authorize(['admin', 'superadmin']), async (req, res) => {
  try {
    const db = await getDb();
    const { status } = req.body;
    await db.update(documents).set({ status }).where(eq(documents.id, req.params.id));
    res.json({ message: 'Document status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update document status' });
  }
});

// Update payment status
router.patch('/payments/:id/status', authenticate, authorize(['admin', 'superadmin', 'committee_finance']), async (req, res) => {
  try {
    const db = await getDb();
    const { status } = req.body;
    await db.update(payments).set({ status, paidAt: status === 'success' ? new Date() : undefined }).where(eq(payments.id, req.params.id));
    res.json({ message: 'Payment status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Get all applications (admin only)
router.get('/applications', authenticate, authorize(['admin', 'superadmin']), async (req, res) => {
  try {
    const db = await getDb();
    const allApps = await db.select().from(applications).orderBy(desc(applications.updatedAt));
    res.json(allApps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Update application status
router.patch('/applications/:id/status', authenticate, authorize(['admin', 'superadmin']), async (req, res) => {
  try {
    const db = await getDb();
    const { status, score, participantNumber } = req.body;
    await db.update(applications)
      .set({ 
        status, 
        score: score !== undefined ? score : undefined,
        participantNumber: participantNumber || undefined,
        updatedAt: new Date()
      })
      .where(eq(applications.id, req.params.id));
    res.json({ message: 'Status updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Manage Announcements
router.post('/announcements', authenticate, authorize(['superadmin']), async (req, res) => {
  try {
    const db = await getDb();
    const { title, content, type } = req.body;
    const newAnn = {
      id: uuidv4(),
      title,
      content,
      type,
      createdAt: new Date(),
    };
    await db.insert(announcements).values(newAnn);
    res.status(201).json(newAnn);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

router.delete('/announcements/:id', authenticate, authorize(['superadmin']), async (req, res) => {
  try {
    const db = await getDb();
    await db.delete(announcements).where(eq(announcements.id, req.params.id));
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

// Manage Fees
router.post('/fees', authenticate, authorize(['superadmin', 'admin']), async (req, res) => {
  try {
    const db = await getDb();
    const { description, amount, facultyId, programId } = req.body;
    const id = programId || facultyId || uuidv4();
    
    // Upsert logic
    const existing = await db.select().from(feeConfigs).where(eq(feeConfigs.id, id));
    if (existing.length > 0) {
      await db.update(feeConfigs).set({ description, amount, facultyId, programId, updatedAt: new Date() }).where(eq(feeConfigs.id, id));
    } else {
      await db.insert(feeConfigs).values({ id, description, amount, facultyId, programId, updatedAt: new Date() });
    }
    res.json({ message: 'Fee updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fee' });
  }
});

router.delete('/fees/:id', authenticate, authorize(['superadmin']), async (req, res) => {
  try {
    const db = await getDb();
    await db.delete(feeConfigs).where(eq(feeConfigs.id, req.params.id));
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

export default router;
