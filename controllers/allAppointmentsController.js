import pool from "../db.js";

export const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM appointments");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    // Parse data
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;

    // FIX: no duplicate id
    const id = Date.now();

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

    // Validate required fields
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

    // Receipt
    let receiptUrl = null;
    if (req.file) {
      receiptUrl = `http://localhost:5000/uploadsReceipt/${req.file.filename}`;
    }

    const status = "Pending";
    const notes = "Online Booking";

    // FIXED SQL (ALL PLACEHOLDERS MATCH)
    const sql = `
      INSERT INTO appointments
      (id, fullName, appointmentDate, startTime, endTime, doctorName, paymentMethod, receiptPath, status, createdAt, contactNumber, email, services, notes, price)
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
      services,
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
