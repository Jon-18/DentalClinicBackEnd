import pool from "../db.js";

// ==================== GET PROFILE ====================
export const getProfile = async (req, res) => {
  const { id } = req.params;

  if (Number(req.user.id) !== Number(id)) {
    return res.status(403).json({ message: "Forbidden: not your profile" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
        id, 
        fullName, 
        userName AS username, 
        email, 
        phoneNumber AS phone, 
        address, 
        role
      FROM users WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(rows[0]);

  } catch (err) {
    console.error("❌ GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ==================== UPDATE PROFILE ====================
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { fullName, username, email, phone, address } = req.body;

  if (Number(req.user.id) !== Number(id)) {
    return res.status(403).json({ message: "Forbidden: not your profile" });
  }

  try {
    await pool.query(
      `UPDATE users 
        SET fullName = ?, userName = ?, email = ?, phoneNumber = ?, address = ?
       WHERE id = ?`,
      [fullName, username, email, phone, address, id]
    );

    const [updated] = await pool.query(
      `SELECT
        id,
        fullName,
        userName AS username,
        email,
        phoneNumber AS phone,
        address,
        role
      FROM users WHERE id = ?`,
      [id]
    );

    res.status(200).json({ 
      message: "Profile updated successfully", 
      user: updated[0] 
    });

  } catch (err) {
    console.error("❌ UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
