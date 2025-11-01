import { executeQuery } from "../utils/database.js";

export const listUsers = async (_req, res) => {
  try {
    const users = await executeQuery(
      "SELECT * FROM users ORDER BY created_at DESC"
    );
    res.json({ data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, name } = req.body ?? {};

    if (!email || !name) {
      return res.status(400).json({ error: "Email and name are required" });
    }

    const id = `u_${Date.now()}`;
    const rows = await executeQuery(
      "INSERT INTO users (id, email, name) VALUES ($1, $2, $3) RETURNING *",
      [id, email, name]
    );

    res.status(201).json({ data: rows[0] });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "23505") {
      // unique_violation in Postgres
      res.status(409).json({ error: "User with this email already exists" });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
};
