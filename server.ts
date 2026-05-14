import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Resend } from "resend";
import authRoutes from "./src/server/authRoutes";
import dataRoutes from "./src/server/dataRoutes";
import adminRoutes from "./src/server/adminRoutes";
import { getDb } from "./src/db/db";

// Handle ESM/CJS compatibility for paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());

  // Initialize DB connection optionally on startup
  getDb().catch(err => console.warn("Database not connected yet. Will retry on request."));

  const resend = process.env.EMAIL_API_KEY ? new Resend(process.env.EMAIL_API_KEY) : null;

  // Mount API routes
  app.use("/api/auth", authRoutes);
  app.use("/api", dataRoutes);    // All data routes (announcements, applications, docs, payments)
  app.use("/api/admin", adminRoutes);

  // Email routes (keep existing logic)
  app.post("/api/send-confirmation", async (req, res) => {
    const { email, fullName, major } = req.body;

    console.log(`[MAIL] Attempting to send confirmation to ${email}`);
    
    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: "onboarding@resend.dev", // Using strictly the recommended address for trial
          to: email, // Can be string or array
          subject: "Konfirmasi Pendaftaran Mahasiswa Baru - SiPMB Online",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h1 style="color: #1e3a8a; font-size: 24px;">Pendaftaran Berhasil!</h1>
              <p>Halo <strong>${fullName || 'Calon Mahasiswa'}</strong>,</p>
              <p>Terima kasih telah melakukan pendaftaran di SiPMB Online. Kami telah menerima data Anda untuk program studi:</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-weight: bold; color: #1e3a8a;">${major || 'Program Studi Terpilih'}</p>
              </div>
              <p>Silakan pantau berkala dashboard Anda untuk melihat status seleksi dan pengumuman selanjutnya.</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                <p>Pesan ini dikirim secara otomatis oleh sistem pendaftaran mahasiswa baru.</p>
              </div>
            </div>
          `,
        });

        if (error) {
          console.error("[MAIL] Resend Error Detail:", JSON.stringify(error, null, 2));
          return res.status(400).json({ success: false, error });
        }

        return res.json({ success: true, message: "Email sent successfully", data });
      } catch (err) {
        console.error("[MAIL] Unexpected Exception:", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
      }
    } else {
      console.warn("[MAIL] EMAIL_API_KEY is missing. Success simulated in logs.");
      console.log(`[SIMULATION] Mail content: Welcome ${fullName} to ${major}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return res.json({
        success: true,
        message: "Email konfirmasi disimulasikan (EMAIL_API_KEY tidak ditemukan)",
        simulated: true
      });
    }
  });

  // API Route for rejection email
  app.post("/api/send-rejection", async (req, res) => {
    const { email, fullName } = req.body;

    console.log(`[MAIL] Attempting to send rejection notice to ${email}`);
    
    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Update Status Pendaftaran - SiPMB Online",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h1 style="color: #991b1b; font-size: 24px;">Informasi Hasil Seleksi</h1>
              <p>Halo <strong>${fullName || 'Calon Mahasiswa'}</strong>,</p>
              <p>Terima kasih atas minat Anda untuk bergabung dengan institusi kami melalui SiPMB Online.</p>
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
                <p style="margin: 0; color: #991b1b;">Kami menyesal menginformasikan bahwa setelah melakukan evaluasi mendalam terhadap berkas dan persyaratan Anda, saat ini kami belum dapat melanjutkan proses pendaftaran Anda ke tahap selanjutnya.</p>
              </div>
              <p>Keputusan ini didasarkan pada kuota yang tersedia serta kriteria seleksi yang ketat untuk tahun akademik ini.</p>
              <p>Kami sangat menghargai waktu dan usaha yang telah Anda berikan. Kami mendoakan yang terbaik untuk kesuksesan studi dan karir Anda di masa mendatang.</p>
              <p style="margin-top: 20px;">Hormat kami,</p>
              <p style="font-weight: bold; color: #1e3a8a;">Panitia Penyelenggara PB Online</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
                <p>Pesan ini dikirim secara otomatis oleh sistem pendaftaran mahasiswa baru.</p>
              </div>
            </div>
          `,
        });

        if (error) {
          console.error("[MAIL] Resend Error Detail:", JSON.stringify(error, null, 2));
          return res.status(400).json({ success: false, error });
        }

        return res.json({ success: true, message: "Rejection email sent successfully", data });
      } catch (err) {
        console.error("[MAIL] Unexpected Exception:", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
      }
    } else {
      console.warn("[MAIL] EMAIL_API_KEY is missing. Rejection simulated in logs.");
      
      await new Promise(resolve => setTimeout(resolve, 500));

      return res.json({
        success: true,
        message: "Email penolakan disimulasikan (EMAIL_API_KEY tidak ditemukan)",
        simulated: true
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
