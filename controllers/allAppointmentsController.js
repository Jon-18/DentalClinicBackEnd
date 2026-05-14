import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * GET ALL APPOINTMENTS
 */
export const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM appointments");
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * CREATE APPOINTMENT
 */
export const createAppointment = async (req, res) => {
  try {
    // Safer body parsing
    let data = req.body;
    const id = uuidv4();

    if (req.body.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch (err) {
        return res.status(400).json({ message: "Invalid JSON in data field" });
      }
    }

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
    } = data;

    // Required fields validation
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
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `${field} is required.` });
      }
    }

    // Handle receipt upload
    let receiptUrl = null;
    if (req.file) {
      const baseUrl =
        process.env.BASE_URL || "https://dentalclinicbackend-1qfr.onrender.com";
      receiptUrl = `${baseUrl}/uploadsReceipt/${req.file.filename}`;
    }

    // Ensure services is stored properly
    const servicesValue =
      typeof services === "string" ? services : JSON.stringify(services);

    const status = "Pending";
    const notes = "Online Booking";

    // SQL INSERT
    const sql = `
      INSERT INTO appointments
      (
        id,
        fullName,
        appointmentDate,
        startTime,
        endTime,
        doctorName,
        paymentMethod,
        receiptPath,
        status,
        createdAt,
        contactNumber,
        email,
        service_id,
        notes,
        price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)
    `;

    const params = [
      id,
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
      servicesValue,
      notes,
      price,
    ];

    await pool.query(sql, params);

    return res.status(201).json({
      message: "Appointment created!",
      id,
      receiptUrl,
    });
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
