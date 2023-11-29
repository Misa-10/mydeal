/**
 * @swagger
 * /example:
 *   get:
 *     description: Exemple de route
 *     responses:
 *       200:
 *         description: Réponse réussie
 */
const express = require("express");
const router = express.Router();

router.get("/example", (req, res) => {
  res.json({ message: "Exemple réussi !" });
});

module.exports = router;
