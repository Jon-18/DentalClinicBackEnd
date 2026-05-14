import {
  sendApprovalEmail,
  sendDenialEmail,
  sendApprovalEmailAdmin,
} from "../controllers/emailControllesForConfirmSched.js";
import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const createAppointment = async (req, res) => {
  try {
    // ✅ Generate UNIQUE ID (TiDB-safe)
    const id = uuidv4();

    // Parse data
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    const {
      fullName,
      date,
      startTime,
      endTime,
      doctorName,
      paymentMethod,
      contactNumber,
      email,
      services,
      price,
      user_id,
    } = data;

    // ✅ Validate required fields
    const requiredFields = [
      "fullName",
      "date",
      "startTime",
      "endTime",
      "doctorName",
      "paymentMethod",
      "contactNumber",
      "email",
      "services",
      "price",
      "user_id",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `${field} is required.` });
      }
    }

    // ✅ Handle receipt
    let receiptUrl = null;
    if (req.file) {
      receiptUrl = `https://dentalclinicbackend-1qfr.onrender.com/uploadsReceipt/${req.file.filename}`;
    }

    const status = "Pending";
    const notes = "Online Booking";

    // ✅ FIXED SQL (MATCHES PARAMS EXACTLY)
    const sql = `
      INSERT INTO appointments
      (id, fullName, appointmentDate, startTime, endTime, doctorName, paymentMethod, receiptPath, status, createdAt, contactNumber, email, service_id, notes, price, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      id, // UUID
      fullName,
      date,
      startTime,
      endTime,
      doctorName,
      paymentMethod,
      receiptUrl,
      status,
      contactNumber,
      email,
      services,
      notes,
      price,
      user_id,
    ];

    const [result] = await pool.query(sql, params);

    return res.status(201).json({
      message: "Appointment created successfully!",
      id,
      receiptUrl,
    });
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const sql = `
      SELECT 
        *
      FROM appointments
      ORDER BY createdAt DESC
    `;

    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("❌ Fetch appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const { fullName, date, time, doctorName, paymentMethod, receipt, status } =
      req.body;

    const sql = `
      UPDATE appointments
      SET patientName=?, date=?, time=?, doctorName=?, paymentMethod=?, receiptPath=?, status=?
      WHERE id=?
    `;

    const params = [
      fullName,
      date,
      time,
      doctorName,
      paymentMethod,
      receipt,
      status,
      id,
    ];

    await pool.query(sql, params);

    res.json({ message: "Appointment updated" });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAppointmentbyAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // ---------------------------
    // UPDATE status + reason
    // ---------------------------
    const sqlUpdate = `
      UPDATE appointments
      SET status=?, note_for_deny=?
      WHERE id=?
    `;

    await pool.query(sqlUpdate, [status, reason || null, id]);

    // ---------------------------
    // FETCH updated appointment
    // ---------------------------
    const [rows] = await pool.query(`SELECT * FROM appointments WHERE id=?`, [
      id,
    ]);

    const appt = rows[0];

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (status === "Approved by Admin") {
      await sendApprovalEmailAdmin(appt);
    }

    if (status === "Denied by Admin") {
      await sendDenialEmail(appt, reason);
    }

    res.json({ message: "Appointment updated + email sent", appt });
  } catch (err) {
    console.error("❌ Admin update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAppointmentbyDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ---------------------------
    // UPDATE status first
    // ---------------------------
    const sqlUpdate = `
      UPDATE appointments
      SET status=?
      WHERE id=?
    `;

    await pool.query(sqlUpdate, [status, id]);

    // ---------------------------
    // FETCH updated appointment (to get email, name, date, doctor, etc.)
    // ---------------------------
    const sqlFetch = `
      SELECT *
      FROM appointments
      WHERE id=?
    `;

    const [rows] = await pool.query(sqlFetch, [id]);

    const appt = rows[0];

    if (!appt) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // ---------------------------
    // SEND EMAIL ONLY IF APPROVED BY DOCTOR
    // ---------------------------
    if (status === "Approved by Doctor") {
      // await sendApprovalEmail(appt);

      const response = await fetch("https://api.httpsms.com/v1/messages/send", {
        method: "POST",
        headers: {
          "x-api-key": process.env.HTTPSMS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "+639517880049",
          to: `+${appt.contactNumber}`,
          content: `Hello! This is Clinic Sibonga Dental. Your appointment has been confirmed. Please arrive before your scheduled time of ${appt.startTime}–${appt.endTime}. Thank you, and we look forward to seeing you.`,
        }),
      });
      console.log("KEY VALUE:", process.env.HTTPSMS_API_KEY);
      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("RESPONSE:", data);
    }

    res.json({ message: "Appointment updated", appt });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
