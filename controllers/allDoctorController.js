import pool from "../db.js";

// 📋 Get all branches
export const getAllDoctor = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT fullName FROM users where role = 'doctor'");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const totalOfDoctor = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT fullName FROM users where role = 'doctor'");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ message: "Server error" });
  }
};