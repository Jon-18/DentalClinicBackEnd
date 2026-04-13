import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import dotenv from "dotenv";

dotenv.config();

// =============================
// 📌 SEND RESET EMAIL (BREVO API)
// =============================
const sendResetEmail = async (email, resetLink) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "accept": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: process.env.EMAIL_USER,
        name: "Bonga Dental Clinic",
      },
      to: [
        {
          email: email,
        },
      ],
      subject: "Password Reset Request",
      htmlContent: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Brevo API Error: ${err}`);
  }
};


// =============================
// 📌 FORGOT PASSWORD
// =============================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("🔹 Checking user email...");
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Email not found." });
    }

    const user = rows[0];

    // Generate 15-min JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `https://clinicsibongaclinic.xyz/reset-password/${token}`;

    // Send reset email (NO SMTP)
    await sendResetEmail(email, resetLink);

    res.json({ message: "✅ Reset link sent to your email." });

  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    res.status(500).json({ message: "⚠️ Server error sending reset link." });
  }
};

// =============================
// 📌 RESET PASSWORD
// =============================
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.json({ message: "✅ Password reset successful." });

  } catch (err) {
    console.error("Reset Password Error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Token has expired." });
    }

    res.status(500).json({ message: "Server error." });
  }
};
