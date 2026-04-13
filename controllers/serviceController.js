import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

// 💈 Register Service
export const registerService = async (req, res) => {
  try {
    const { serviceName, description, price } = req.body;

    if (!serviceName || !description || price == null) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const id = uuidv4();

    await pool.query(
      `INSERT INTO dental_services (id, service_name, description, price)
       VALUES (?, ?, ?, ?)`,
      [id, serviceName, description, price],
    );

    res.status(201).json({
      message: "Service added successfully!",
      id, // ✅ return UUID instead of insertId
    });
  } catch (error) {
    console.error("Error inserting service:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// 📋 Get all services
export const getServices = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM dental_services");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteService = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;

    await connection.beginTransaction();

    const [service] = await connection.query(
      "SELECT id FROM dental_services WHERE id = ?",
      [id],
    );

    if (service.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    await connection.query("DELETE FROM dental_services WHERE id = ?", [id]);

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

export const updateService = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const { id } = req.params;

    const { service_name, description, price } = req.body;

    // validation
    if (!service_name || !description || !price) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await connection.beginTransaction();

    const [existing] = await connection.query(
      "SELECT service_name FROM patients WHERE id = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Service not found" });
    }

    // ✅ update dentists table
    await connection.query(
      `UPDATE patients 
       SET service_name=?, description=?, price=?
       WHERE id=?`,
      [service_name, description, price, id],
    );

    // ✅ update users table (match by old email)
    await connection.query(
      `UPDATE users 
       SET service_name=?, description=?, price=?
       WHERE service_name=?`,
      [service_name, description, price],
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
