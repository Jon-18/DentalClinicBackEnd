import pool from "../db.js";

export const getAppointmentsByPatientId = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "user id is required" });
    }

    const [rows] = await pool.query(
      `SELECT *
    FROM appointments
    LEFT JOIN dental_services 
        ON appointments.service_id = dental_services.id
    WHERE appointments.user_id = ?`,
      [user_id],
    );

    console.log("Rows found:", rows.length);

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
