const express = require("express");
const router = express.Router();
const categorieController = require("../controllers/categorieController");

router.get("/", categorieController.getToutesLesCategories);
router.get("/:id", categorieController.getCategorieParId);
router.post("/", categorieController.creerCategorie);
router.put("/:id", categorieController.modifierCategorie);
router.delete("/:id", categorieController.supprimerCategorie);

module.exports = router;
