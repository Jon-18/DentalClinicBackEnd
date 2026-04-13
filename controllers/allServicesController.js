import pool from "../db.js";

export const getAllServices = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, service_name, price, description FROM dental_services");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createServices = async (req, res) => {
  try {
    const { service_name } = req.body;

    if (!service_name) {
      return res.status(400).json({ message: "service_name is required" });
    }

    const [result] = await pool.query(
      "INSERT INTO dental_services (service_name), description VALUES (?)",
      [service_name]
    );

    res.status(201).json({
      message: "Service created successfully",
      id: result.insertId,
      service_name,
    });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({ message: "Server error" });
  }
};