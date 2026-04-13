import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, service_name, price, description FROM dental_services",
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createServices = async (req, res) => {
  const id = uuidv4();

  try {
    const { service_name, description } = req.body;

    if (!service_name) {
      return res.status(400).json({ message: "service_name is required" });
    }

    const sql = `
      INSERT INTO dental_services (id, service_name, description)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      id,
      service_name,
      description || null,
    ]);

    res.status(201).json({
      message: "Service created successfully",
      id,
      service_name,
      description,
    });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ message: "Server error" });
  }
};
