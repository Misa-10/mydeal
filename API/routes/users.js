// users.js

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { development } = require("../knexfile");
const db = require("knex")(development);
const jwt = require("jsonwebtoken");
const { emailRegex, passwordRegex, usernameRegex } = require("./regex");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
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
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 */

// Create User
router.post("/users", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Validation de l'email
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "L'email n'est pas valide." });
    }

    // Validation du mot de passe
    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "Le mot de passe n'est pas valide." });
    }

    // Validation de l'username
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: "L'username n'est pas valide." });
    }

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await db("users").where("email", email).first();
    if (existingUser) {
      return res.status(400).json({ message: "L'utilisateur existe déjà." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    const [userId] = await db("users")
      .insert({
        email,
        password: hashedPassword,
        username,
      })
      .returning("id");

    // Generate JWT token
    const token = jwt.sign(
      { email, username, id: userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "200h",
      }
    );

    res.status(201).json({ id: userId, token });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res.status(500).send("Erreur du serveur");
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   date_creation:
 *                     type: string
 */

// Read Users
router.get("/users", async (req, res) => {
  try {
    const users = await db
      .select("id", "email", "username", "date_creation")
      .from("users");
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).send("Erreur du serveur");
  }
});

/**
 * @swagger
 * /users/by-email:
 *   get:
 *     summary: Get a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         description: Email of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 date_creation:
 *                   type: string
 *       404:
 *         description: User not found
 */

router.get("/users/by-email", async (req, res) => {
  try {
    const userEmail = req.query.email;
    const user = await db("users").where("email", userEmail).first();

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur par email :",
      error
    );
    res.status(500).send("Erreur du serveur");
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 date_creation:
 *                   type: string
 *       404:
 *         description: User not found
 */

router.get("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db("users").where("id", userId).first();

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'utilisateur par ID :",
      error
    );
    res.status(500).send("Erreur du serveur");
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: integer
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
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */

router.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, password, username } = req.body;

    // Validation de l'email
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ message: "L'email n'est pas valide." });
    }

    // Validation du mot de passe
    if (password && !passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "Le mot de passe n'est pas valide." });
    }

    // Validation de l'username
    if (username && !usernameRegex.test(username)) {
      return res.status(400).json({ message: "L'username n'est pas valide." });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await db("users").where("id", userId).first();
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Mettre à jour l'utilisateur dans la base de données
    let updateFields = {};
    if (email) updateFields.email = email;
    if (password) updateFields.password = password;
    if (username) updateFields.username = username;

    await db("users").where("id", userId).update(updateFields);

    // Generate JWT token with ternary conditional for email field
    const token = jwt.sign(
      {
        email: email ? email : existingUser.email,
        username: username ? username : existingUser.username,
        id: userId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "200h",
      }
    );

    res
      .status(200)
      .json({ message: "Utilisateur mis à jour avec succès.", token });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res.status(500).send("Erreur du serveur");
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Vérifier si l'utilisateur existe
    const existingUser = await db("users").where("id", userId).first();
    if (!existingUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Supprimer l'utilisateur de la base de données
    await db("users").where("id", userId).del();

    res.status(200).json({ message: "Utilisateur supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    res.status(500).send("Erreur du serveur");
  }
});

module.exports = router;
