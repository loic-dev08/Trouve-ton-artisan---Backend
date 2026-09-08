const express = require("express");
const router = express.Router();
const artisanController = require("../controllers/artisanController");

router.get("/", artisanController.getTousLesArtisans);
router.get("/:id", artisanController.getArtisanParId);
router.post("/", artisanController.creerArtisan);
router.put("/:id", artisanController.modifierArtisan);
router.delete("/:id", artisanController.supprimerArtisan);

module.exports = router;
