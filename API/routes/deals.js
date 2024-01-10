const express = require("express");
const router = express.Router();
const { development } = require("../knexfile");
const db = require("knex")(development);
const multer = require("multer");

/**
 * @swagger
 * tags:
 *   name: Deals
 *   description: API for managing deals
 */

/**
 * @swagger
 * /deals:
 *   get:
 *     summary: Récupérer tous les deals
 *     tags: [Deals]
 *     responses:
 *       200:
 *         description: Liste de tous les deals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Deal'
 */
router.get("/deals", async (req, res) => {
  try {
    const { page = 1, pageSize = 2, name } = req.query;
    const offset = (page - 1) * pageSize;

    let query = db.select("*").from("deals");

    if (name) {
      query = query.where("title", "ilike", `%${name}%`);
    }

    const deals = await query.offset(offset).limit(pageSize);

    const totalCountQuery = name
      ? db("deals").where("title", "ilike", `%${name}%`).count("*").first()
      : db("deals").count("*").first();

    const totalCount = await totalCountQuery;

    const totalPages = Math.ceil(totalCount.count / pageSize);

    res.json({ deals, totalPages });
  } catch (error) {
    console.error("Erreur lors de la récupération des deals : ", error);
    res.status(500).send("Erreur serveur");
  }
});

/**
 * @swagger
 * /deals/{id}:
 *   get:
 *     summary: Récupérer un deal par son ID
 *     tags: [Deals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du deal à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deal récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deal'
 *       404:
 *         description: Deal non trouvé
 */
router.get("/deals/:id", async (req, res) => {
  try {
    const dealId = req.params.id;
    const deal = await db("deals").where("id", dealId).first();

    if (!deal) {
      return res.status(404).send("Deal non trouvé");
    }

    res.json(deal);
  } catch (error) {
    console.error("Erreur lors de la récupération du deal : ", error);
    res.status(500).send("Erreur serveur");
  }
});

/**
 * @swagger
 * /deals:
 *   post:
 *     summary: Créer un nouveau deal
 *     tags: [Deals]
 *     requestBody:
 *       description: Objet deal à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deal'
 *     responses:
 *       201:
 *         description: Deal créé avec succès
 *       400:
 *         description: Requête invalide
 */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/deals", upload.array("image", 3), async (req, res) => {
  try {
    const deal = req.body;

    const images = req.files.map((file) => ({
      filename: file.originalname,
      data: file.buffer,
    }));

    // attach image to the deal but image1 image2 image3
    deal.image1 = images[0]?.data;
    deal.image2 = images[1]?.data;
    deal.image3 = images[2]?.data;

    // Insert the deal into the database
    const insertedDeal = await db("deals").insert(deal).returning("id");

    res.status(201).send({ id: insertedDeal[0] });
  } catch (error) {
    console.error("Erreur lors de la création du deal : ", error);
    res.status(500).send("Erreur serveur");
  }
});

/**
 * @swagger
 * /deals/{id}:
 *   put:
 *     summary: Mettre à jour un deal par son ID
 *     tags: [Deals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du deal à mettre à jour
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Nouvelles informations du deal
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deal'
 *     responses:
 *       200:
 *         description: Deal mis à jour avec succès
 *       404:
 *         description: Deal non trouvé
 */

router.put("/deals/:id", upload.array("image", 3), async (req, res) => {
  try {
    const dealId = req.params.id;
    const updatedDeal = req.body;

    const images = req.files.map((file) => ({
      filename: file.originalname,
      data: file.buffer,
    }));

    // attach image to the deal but image1 image2 image3
    updatedDeal.image1 = images[0]?.data;
    updatedDeal.image2 = images[1]?.data;
    updatedDeal.image3 = images[2]?.data;

    const result = await db("deals").where("id", dealId).update(updatedDeal);

    if (result === 0) {
      return res.status(404).send("Deal non trouvé");
    }

    res.send("Deal mis à jour avec succès");
  } catch (error) {
    console.error("Erreur lors de la mise à jour du deal : ", error);
    res.status(500).send("Erreur serveur");
  }
});

/**
 * @swagger
 * /deals/{id}:
 *   delete:
 *     summary: Supprimer un deal par son ID
 *     tags: [Deals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du deal à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deal supprimé avec succès
 *       404:
 *         description: Deal non trouvé
 */
router.delete("/deals/:id", async (req, res) => {
  try {
    const dealId = req.params.id;

    const result = await db("deals").where("id", dealId).del();

    if (result === 0) {
      return res.status(404).send("Deal non trouvé");
    }

    res.send("Deal supprimé avec succès");
  } catch (error) {
    console.error("Erreur lors de la suppression du deal : ", error);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
