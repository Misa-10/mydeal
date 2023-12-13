const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { development } = require("../knexfile");
const db = require("knex")(development);
const { emailRegex, passwordRegex } = require("./regex");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal Server Error
 */

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Invalid password format." });
    }

    // Find user by email using Knex
    const user = await db
      .select("id", "email", "username", "password")
      .from("users")
      .where("email", email)
      .first();

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email." });
    }

    // Check if the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, username: user.username, id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "200h", // Set the expiration time for the token
      }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
