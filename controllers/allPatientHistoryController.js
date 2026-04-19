import pool from "../db.js";

export const getAllAppointmentswithServiceName = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM appointments INNER JOIN dental_services ON appointments.services = dental_services.id",
    );
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
