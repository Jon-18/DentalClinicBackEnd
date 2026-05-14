import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

// 📋 Get all branches
export const getAllPatient = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT fullName FROM users where role = 'patient'",
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAppointmentAdmin = async (req, res) => {
  try {
    console.log(req.body);
    // Parse incoming data
    const data = req.body;
    const id = uuidv4();

    const {
      fullName,
      contactNumber,
      paymentMethod,
      doctorName,
      date,
      startTime,
      endTime,
      email,
      services,
      notes = "Walk-in", // default if not provided
      price,
    } = data;

    // Validate required fields
    const requiredFields = [
      "fullName",
      "doctorName",
      "date",
      "startTime",
      "endTime",
      "services",
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `${field} is required.` });
      }
    }

    // ✅ Correct SQL: placeholders match params
    const sql = `
  INSERT INTO appointments
  (
    id,
    fullName,
    contactNumber,
    email,
    doctorName,
    paymentMethod,
    receiptPath,
    status,
    appointmentDate,
    service_id,
    startTime,
    endTime,
    notes,
    Price,
    user_id
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, "Approved by Admin", ?, ?, ?, ?, ?, ?, ?)
`;

    const params = [
      id,
      fullName,
      contactNumber, // REQUIRED (you must add this in frontend)
      email,
      doctorName,
      paymentMethod || null,
      receiptPath || null,
      date,
      services,
      startTime,
      endTime,
      notes,
      price,
      user_id || null,
    ];

    const [result] = await pool.query(sql, params);

    res.status(201).json({
      message: "Appointment created!",
      id: result.insertId,
    });
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    res.status(500).json({ message: "Server error" });
  }
};
