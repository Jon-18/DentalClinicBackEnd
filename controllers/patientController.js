import dotenv from "dotenv";
import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export const registerPatient = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, email, cellphone, address } =
      req.body;

    if (!fullName || !dateOfBirth || !gender || !email || !cellphone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const userId = uuidv4();
    const patientId = uuidv4();
    const role = "patient";

    // 1. Create user account
    await pool.query(
      `INSERT INTO users (id, fullName, email, phoneNumber, role, dateRegister)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [userId, fullName, email, cellphone, role],
    );

    // 2. Create patient profile linked to user
    await pool.query(
      `INSERT INTO patients (id, userId, fullName, dateOfBirth, gender, email, cellphone, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        userId,
        fullName,
        dateOfBirth,
        gender,
        email,
        cellphone,
        address,
      ],
    );

    return res.status(201).json({
      message: "Patient registered successfully!",
      userId,
      patientId,
    });
  } catch (error) {
    console.error("Error inserting patient:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

export const getPatients = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM patients");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching patients:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePatient = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [patient] = await connection.query(
      "SELECT email FROM patients WHERE id = ?",
      [id],
    );

    if (patient.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const email = patient[0].email;

    await connection.query("DELETE FROM patients WHERE id = ?", [id]);

    await connection.query("DELETE FROM users WHERE email = ?", [email]);

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

export const updatePatient = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const { fullName, dateOfBirth, gender, email, cellphone, address } =
      req.body;

    // validation
    if (
      !fullName ||
      !dateOfBirth ||
      !gender ||
      !email ||
      !cellphone ||
      !address
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT email FROM patients WHERE id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const oldEmail = existing[0].email;

    await connection.query(
      `UPDATE patients 
       SET fullName=?, dateOfBirth=?, gender=?, email=?, cellphone=?, address=?
       WHERE id=?`,
      [fullName, dateOfBirth, gender, email, cellphone, address, id],
    );

    // ✅ update users table (match by old email)
    await connection.query(
      `UPDATE users 
       SET fullName=?, email=?, phoneNumber=?,
       WHERE email=?`,
      [fullName, email, cellphone, oldEmail],
    );

    await connection.commit();

    return res.status(200).json({
      message: "Patient updated successfully",
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
