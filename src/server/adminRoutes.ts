import express from 'express';
import { getDb } from '../db/db.js';
import { applications, announcements, feeConfigs, users, documents, activityLogs, payments } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { authenticate, authorize } from './middleware.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, sendWhatsApp } from './notificationService.js';

const router = express.Router();

// Helper to generate selection code
const generateSelectionCode = () => {
  return `SEL-${Date.now().toString().substring(7)}-${Math.floor(1000 + Math.random() * 9000)}`;
};

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

// Get user payment
router.get('/payments/user/:userId', authenticate, authorize(['admin', 'superadmin', 'committee_finance']), async (req, res) => {
  try {
    const db = await getDb();
    const userPayment = await db.select().from(payments).where(eq(payments.userId, req.params.userId)).limit(1);
    res.json(userPayment.length > 0 ? userPayment[0] : null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
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
    
    // Check current state
    const currentAppRes = await db.select().from(applications).where(eq(applications.id, req.params.id));
    if (currentAppRes.length === 0) return res.status(404).json({ error: 'Application not found' });
    const currentApp = currentAppRes[0];

    // If status is becoming test_ready or accepted, check payment
    if (['test_ready', 'accepted'].includes(status)) {
      const dbPayment = await db.select().from(payments).where(eq(payments.userId, currentApp.userId)).limit(1);
      if (dbPayment.length === 0 || dbPayment[0].status !== 'success') {
        return res.status(400).json({ error: 'Pembayaran belum lunas atau belum diverifikasi. Admin tidak dapat mengubah status ini.' });
      }
    }

    let selectionCode = currentApp.selectionCode;
    
    // If status is becoming test_ready and there's no selection code, generate one
    if (status === 'test_ready' && !selectionCode) {
      selectionCode = generateSelectionCode();
      
      // Notify user
      const userRes = await db.select().from(users).where(eq(users.id, currentApp.userId));
      if (userRes.length > 0) {
        const user = userRes[0];
        const msg = `Halo ${user.fullName}, pendaftaran Anda di SiPMB Online telah diverifikasi! Kode Seleksi Tulis Anda adalah: *${selectionCode}*. Silakan login ke dashboard untuk mencetak kartu ujian.`;
        
        // Send WhatsApp
        if (user.phone) {
          sendWhatsApp(user.phone, msg);
        }
        
        // Send Email
        sendEmail(user.email, "Kode Seleksi Tulis PMB Uniku", `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h1 style="color: #1e3a8a; font-size: 24px;">Verifikasi Berhasil!</h1>
            <p>Halo <strong>${user.fullName}</strong>,</p>
            <p>Pendaftaran Anda telah diverifikasi oleh tim kami. Anda sekarang dapat mengikuti tahap selanjutnya yaitu Seleksi Tulis.</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px dashed #cbd5e1;">
              <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: bold;">Kode Seleksi Tulis</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: 900; color: #1e3a8a; font-family: monospace;">${selectionCode}</p>
            </div>
            <p>Silakan login ke dashboard Anda untuk mencetak Kartu Ujian Seleksi.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
              <p>Pesan ini dikirim secara otomatis oleh sistem pendaftaran mahasiswa baru.</p>
            </div>
          </div>
        `);
      }
    }

    await db.update(applications)
      .set({ 
        status, 
        score: score !== undefined ? score : undefined,
        participantNumber: participantNumber || undefined,
        selectionCode,
        updatedAt: new Date()
      })
      .where(eq(applications.id, req.params.id));
      
    res.json({ message: 'Status updated', selectionCode });
  } catch (error) {
    console.error("Update status error:", error);
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
