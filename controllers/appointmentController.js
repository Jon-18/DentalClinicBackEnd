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
      receiptUrl = `https://dental-clinic-front-end-git-main-jonathan-esguerras-projects.vercel.app/uploadsReceipt/${req.file.filename}`;
    }

    const status = "Pending";
    const notes = "Online Booking";

    // ✅ FIXED SQL (MATCHES PARAMS EXACTLY)
    const sql = `
      INSERT INTO appointments
      (id, fullName, appointmentDate, startTime, endTime, doctorName, paymentMethod, receiptPath, status, createdAt, contactNumber, email, services, notes, price, user_id)
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
