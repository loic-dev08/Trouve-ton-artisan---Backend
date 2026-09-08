const { Categorie, Artisan } = require("../models");
const slugify = require("../utils/slugify");

// GET /api/categories
exports.getToutesLesCategories = async (req, res, next) => {
  try {
    const categories = await Categorie.findAll({ order: [["nom", "ASC"]] });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// GET /api/categories/:id (avec la liste de ses artisans)
exports.getCategorieParId = async (req, res, next) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id, {
      include: [{ model: Artisan, as: "artisans" }],
    });
    if (!categorie) {
      const erreur = new Error("Catégorie introuvable");
      erreur.statut = 404;
      return next(erreur);
    }
    res.json(categorie);
  } catch (err) {
    next(err);
  }
};

// POST /api/categories
exports.creerCategorie = async (req, res, next) => {
  try {
    const { nom } = req.body;
    const nouvelleCategorie = await Categorie.create({ nom, slug: slugify(nom) });
    res.status(201).json(nouvelleCategorie);
  } catch (err) {
    next(err);
  }
};

// PUT /api/categories/:id
exports.modifierCategorie = async (req, res, next) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (!categorie) {
      const erreur = new Error("Catégorie introuvable");
      erreur.statut = 404;
      return next(erreur);
    }
    const donnees = { ...req.body };
    if (donnees.nom) donnees.slug = slugify(donnees.nom);
    await categorie.update(donnees);
    res.json(categorie);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/categories/:id
exports.supprimerCategorie = async (req, res, next) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);
    if (!categorie) {
      const erreur = new Error("Catégorie introuvable");
      erreur.statut = 404;
      return next(erreur);
    }
    await categorie.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
