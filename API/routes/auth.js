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

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Invalid password format." });
    }

    const user = await db
      .select("id", "email", "username", "password", "avatar")
      .from("users")
      .where("email", email)
      .first();

    if (!user) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      {
        email: user.email,
        username: user.username,
        id: user.id,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "200h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
