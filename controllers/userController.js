import pool from "../db.js";

export const getUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        fullname,
        username,
        email,
        phoneNumber,
        role,
        created_at,
        DATE_FORMAT(dateRegister, '%Y-%m-%d') AS dateRegister
      FROM users
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params; // Get user ID from URL params
  const { fullname, username, email, phoneNumber } = req.body; // Fields to update

  try {
    const [result] = await pool.query(
      `
      UPDATE users
      SET fullname = ?, username = ?, email = ?, phoneNumber = ?
      WHERE id = ?
      `,
      [fullname, username, email, phoneNumber, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};