import pool from "../db.js";

export const getIdForPatient = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
        * 
      FROM appointments WHERE user_id = ?`,
      [id]
    );
  
    res.status(200).json(rows[0]);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllAppointmentsPerPatient = async (req, res) => {
  try {
    const userId = req.params.id;

    const [rows] = await pool.query(
      `SELECT * FROM appointments WHERE user_id = ? AND notes != "Walk-in"`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const createAppointment = async (req, res) => {
//   try {
//     // Parse incoming data (JSON string from FormData or plain JSON)
//     const data = req.body.data ? JSON.parse(req.body.data) : req.body;

//     const {
//       fullName,
//       date,
//       startTime,
//       endTime,
//       doctorName,
//       paymentMethod,
//       contactNumber,
//       email,
//       services,
//       price,
//       user_id
//     } = data;

//     // Validate required fields
//     const requiredFields = [
//       "fullName",
//       "date",
//       "startTime",
//       "endTime",
//       "doctorName",
//       "paymentMethod",
//       "contactNumber",
//       "email",
//       "services",
//       "price",
//       "user_id"
//     ];

//     for (const field of requiredFields) {
//       if (!data[field]) {
//         return res.status(400).json({ message: `${field} is required.` });
//       }
//     }

//     // Handle receipt file
//     let receiptUrl = null;
//     if (req.file) {
//       receiptUrl = `http://localhost:5000/uploadsReceipt/${req.file.filename}`;
//     }

//     // SQL Insert
//     // const sql = `
//     //   INSERT INTO appointments
//     //   (fullName, appointmentDate, startTime, endTime, doctorName, paymentMethod, receiptPath, status, createdAt, contactNumber, email, services, notes, price)
//     //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, "Online Booking", ?)
//     // `;

//     const status = "Pending"; // default status

//     const params = [
//       fullName,
//       date,
//       startTime,
//       endTime,
//       doctorName,
//       paymentMethod,
//       receiptUrl,
//       status,
//       contactNumber,
//       email,
//       services,
//       price,
//       user_id
//     ];

//     const [result] = await pool.query(sql, params);

//     // Optionally send confirmation email
//     // await sendApprovalEmail(email, fullName, date, startTime, doctorName);

//     res.status(201).json({
//       message: "Appointment created!",
//       id: result.insertId,
//       receiptUrl,
//     });
//   } catch (err) {
//     console.error("❌ Error creating appointment:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };