import dotenv from "dotenv";
import pool from "../db.js";

dotenv.config();

export const registerDentist = async (req, res) => {
  try {
    const { name, email, phone, specialization, experience, licenseNumber, address } = req.body;

    if (!name || !email || !phone || !specialization || !experience || !licenseNumber || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Add dentist to dentists table
    const [dentistResult] = await pool.query(
      `INSERT INTO dentists (name, email, phone, specialization, experience, licenseNumber, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, specialization, experience, licenseNumber, address]
    );

    // Add dentist to users table with role = "doctor"
    const role = "doctor";

    const [userResult] = await pool.query(
      `INSERT INTO users (fullName, email, phoneNumber, address, role)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone, address, role]
    );

    return res.status(201).json({
      message: "Dentist registered successfully!",
      dentistId: dentistResult.insertId,
      userId: userResult.insertId
    });

  } catch (error) {
    console.error("Error inserting dentist:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const getDentists = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM dentists");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching dentists:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteDentist = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    // get dentist info first (to match user)
    const [dentist] = await connection.query(
      "SELECT email FROM dentists WHERE id = ?",
      [id]
    );

    if (dentist.length === 0) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    const email = dentist[0].email;

    // delete from dentists
    await connection.query(
      "DELETE FROM dentists WHERE id = ?",
      [id]
    );

    // delete from users (linked by email)
    await connection.query(
      "DELETE FROM users WHERE email = ?",
      [email]
    );

    await connection.commit();

    res.status(200).json({ message: "Deleted from both tables" });

  } catch (error) {
    await connection.rollback();
    console.error("Transaction error:", error);

    res.status(500).json({
      message: "Delete failed",
    });
  } finally {
    connection.release();
  }
};

export const updateDentist = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const {
      name,
      email,
      phone,
      specialization,
      experience,
      licenseNumber,
      address,
    } = req.body;

    // validation
    if (
      !name ||
      !email ||
      !phone ||
      !specialization ||
      !experience ||
      !licenseNumber ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await connection.beginTransaction();

    // 🔍 get old email (to update users table correctly)
    const [existing] = await connection.query(
      "SELECT email FROM dentists WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    const oldEmail = existing[0].email;

    // ✅ update dentists table
    await connection.query(
      `UPDATE dentists 
       SET name=?, email=?, phone=?, specialization=?, experience=?, licenseNumber=?, address=? 
       WHERE id=?`,
      [
        name,
        email,
        phone,
        specialization,
        experience,
        licenseNumber,
        address,
        id,
      ]
    );

    // ✅ update users table (match by old email)
    await connection.query(
      `UPDATE users 
       SET fullName=?, email=?, phoneNumber=?, address=? 
       WHERE email=?`,
      [name, email, phone, address, oldEmail]
    );

    await connection.commit();

    return res.status(200).json({
      message: "Dentist updated successfully",
    });
  } catch (error) {
    await connection.rollback();
    console.error("Update error:", error);

    return res.status(500).json({
      message: "Update failed",
    });
  } finally {
    connection.release();
  }
};