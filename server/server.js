import express from "express";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { Resend } from "resend";

const {
  RESEND_API_KEY,
  MAIL_FROM = "SmartClinic <onboarding@resend.dev>", // testing sender
  DEMO_EMAIL,
  PORT = 3001,
} = process.env;
if (!RESEND_API_KEY) throw new Error("Add RESEND_API_KEY to your .env file.");

const resend = new Resend(RESEND_API_KEY);

const MINUTE = 60 * 1000;

/* DEMO STORAGE: everything here is lost when the server restarts.
   Replace "users" with queries to your real database. */
const users = new Map();
if (DEMO_EMAIL) users.set(DEMO_EMAIL.trim().toLowerCase(), { passwordHash: "" });
const resets = new Map(); // email -> state of the current password reset

const cleanEmail = (value) => String(value ?? "").trim().toLowerCase();
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const fail = (res, status, message) => res.status(status).json({ message });

const app = express();
app.use(express.json());

// Step 1: send a code to the user's email
app.post("/api/forgot-password", async (req, res) => {
  const email = cleanEmail(req.body?.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(res, 400, "Enter a valid email address.");

  const now = Date.now();
  const sends = (resets.get(email)?.sends ?? []).filter((time) => now - time < 60 * MINUTE);
  if (sends.length && now - sends.at(-1) < MINUTE) return fail(res, 429, "Please wait a minute before requesting another code.");
  if (sends.length >= 5) return fail(res, 429, "Too many requests. Try again in an hour.");

  const otp = String(crypto.randomInt(100000, 1000000)); // 6 digits
  resets.set(email, {
    sends: [...sends, now], expiresAt: now + 10 * MINUTE, attempts: 0, otpHash: sha256(otp),
  });

  // Only registered emails get a code, but the reply is the same for everyone.
  if (users.has(email)) {
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: [email],
      subject: "Your SmartClinic password reset code",
      text: `Your verification code is ${otp}. It expires in 10 minutes.\nIf you did not request this, ignore this email.`,
    });
    if (error) {
      console.error("Resend failed:", error);
      return fail(res, 502, "Could not send the code. Try again later.");
    }
  }
  res.json({ message: "If that email is registered, a code has been sent." });
});

// Step 2: check the code, then give a one-time reset token
app.post("/api/verify-otp", async (req, res) => {
  const email = cleanEmail(req.body?.email);
  const otp = String(req.body?.otp ?? "").trim();
  const reset = resets.get(email);

  if (!reset || Date.now() > reset.expiresAt) return fail(res, 400, "Code expired. Request a new one.");
  if (reset.attempts >= 5) return fail(res, 429, "Too many attempts. Request a new code.");
  reset.attempts += 1;
  if (!users.has(email) || sha256(otp) !== reset.otpHash) {
    return fail(res, 400, "Incorrect or expired code.");
  }
  reset.otpHash = null; // the code works only once


  const resetToken = crypto.randomBytes(32).toString("hex");
  reset.tokenHash = sha256(resetToken);
  reset.expiresAt = Date.now() + 10 * MINUTE;
  res.json({ resetToken });
});

// Step 3: save the new password
app.post("/api/reset-password", async (req, res) => {
  const email = cleanEmail(req.body?.email);
  const password = String(req.body?.password ?? "");
  const reset = resets.get(email);

  if (password.length < 8) return fail(res, 400, "Password must be at least 8 characters.");
  if (!reset?.tokenHash || Date.now() > reset.expiresAt || sha256(String(req.body?.resetToken)) !== reset.tokenHash) {
    return fail(res, 400, "Your reset session expired. Start again.");
  }
  reset.tokenHash = null; // the token works only once

  // Replace this line with an UPDATE query on your database.
  users.get(email).passwordHash = await bcrypt.hash(password, 12);
  res.json({ message: "Password updated." });
});

app.use((error, req, res, next) => {
  console.error(error);
  fail(res, 500, "Something went wrong. Try again.");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));