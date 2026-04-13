import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

// 🏥 Register Branch
import { v4 as uuidv4 } from "uuid";

export const registerBranch = async (req, res) => {
  try {
    const { name, address, location, schedule } = req.body;
    const id = uuidv4();

    if (!name || !address || !location || !schedule) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await pool.query(
      `INSERT INTO branches (id, name, address, location, schedule)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, address, location, schedule],
    );

    res.status(201).json({
      message: "Branch added successfully!",
      id, // ✅ return UUID, not insertId
    });
  } catch (error) {
    console.error("Error inserting branch:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// 📋 Get all branches
export const getBranches = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM branches");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBranch = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [service] = await connection.query(
      "SELECT id FROM branches WHERE id = ?",
      [id],
    );

    if (service.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    await connection.query("DELETE FROM branches WHERE id = ?", [id]);

    await connection.commit(); // commit the deletion

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Transaction error:", error);
    res.status(500).json({ message: "Delete failed" });
  } finally {
    connection.release();
  }
};

export const updateBranch = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const { name, address, location, scheduled } = req.body;

    // validation
    if (!name || !location || !scheduled || !address) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await connection.beginTransaction();

    // 🔍 get old email (to update users table correctly)
    const [existing] = await connection.query(
      "SELECT email FROM dentists WHERE id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Dentist not found" });
    }

    // ✅ update dentists table
    await connection.query(
      `UPDATE dentists 
       SET name=?, location=?, scheduled=?, address=?,
       WHERE id=?`,
      [name, location, scheduled, address, id],
    );

    // ✅ update users table (match by old email)
    await connection.query(
      `UPDATE users 
       SET name=?, location=?, scheduled=?, address=? 
       WHERE id=?`,
      [name, location, scheduled, address, id],
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
