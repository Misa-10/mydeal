const express = require("express");
const router = express.Router();
const { development } = require("../knexfile");
const db = require("knex")(development);
const multer = require("multer");
const path = require("path");
const { put } = require("@vercel/blob");

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
    const { page = 1, pageSize = 2 } = req.query;
    const offset = (page - 1) * pageSize;

    const deals = await db
      .select("*")
      .from("deals")
      .offset(offset)
      .limit(pageSize);

    const totalCount = await db("deals").count("*").first();

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
router.post("/deals", async (req, res) => {
  try {
    const deal = req.body;
    await db("deals").insert(deal).returning("id");
    res.status(201).send("Deal créé avec succès");
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
router.put("/deals/:id", async (req, res) => {
  try {
    const dealId = req.params.id;
    const updatedDeal = req.body;

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

/**
 * @swagger
 * /deals/upload-image:
 *   post:
 *     summary: Uploader une image pour un deal
 *     tags: [Deals]
 *     requestBody:
 *       description: Image à uploader
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dealId:
 *                 type: integer
 *               image:
 *                 type: string  # Remplacez par le type approprié selon votre cas
 *             required:
 *               - dealId
 *               - image
 *     responses:
 *       201:
 *         description: Image uploadée avec succès
 *       400:
 *         description: Requête invalide
 */
const storage = multer.memoryStorage(); // Use memory storage for file buffer
const upload = multer({ storage: storage });

// Use multer middleware to handle the file uploads
router.post(
  "/deals/upload-image",
  upload.array("images", 3),
  async (req, res) => {
    try {
      // Check if req.files is available and not empty
      if (!req.files || req.files.length === 0) {
        throw new Error("No files uploaded");
      }

      // Loop through each file and upload to blob storage
      const uploadPromises = req.files.map(async (file) => {
        const dealId = req.body.dealId || "unknown";
        const timestamp = Date.now();
        const filename = `${dealId}-${timestamp}${path.extname(
          file.originalname
        )}`;

        // Use Vercel Blob put function to upload the file
        const blob = await put(filename, file.buffer, {
          access: "public",
        });

        // You may want to store the blob URLs or other information in your database
        return blob.url;
      });

      // Wait for all uploads to complete
      const blobUrls = await Promise.all(uploadPromises);

      console.log("Files uploaded to Blob Storage:", blobUrls);

      // Respond with the blob URLs or other relevant information
      res.status(201).json({ blobUrls });
    } catch (error) {
      console.error("Error uploading images to Blob Storage:", error.message);
      res.status(500).json({ error: "Error uploading images to Blob Storage" });
    }
  }
);

module.exports = router;
