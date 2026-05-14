import { Resend } from "resend";
import axios from "axios";

// Initialize Resend
const resend = new Resend(process.env.EMAIL_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.EMAIL_API_KEY) {
    console.warn("EMAIL_API_KEY not set, skipping email");
    return;
  }
  try {
    await resend.emails.send({
      from: "PMB Uniku <noreply@pmb.uniku.ac.id>",
      to: [to],
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export const sendWhatsApp = async (target: string, message: string) => {
  const token = process.env.FONNTE_TOKEN;
  if (!token) {
    console.warn("FONNTE_TOKEN not set, skipping WhatsApp");
    return;
  }
  
  try {
    const response = await axios.post(
      "https://api.fonnte.com/send",
      {
        target,
        message,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(`WhatsApp sent to ${target}`, response.data);
  } catch (error) {
    console.error("Failed to send WhatsApp:", error);
  }
};
