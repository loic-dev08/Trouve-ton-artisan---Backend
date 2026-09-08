const { Op } = require("sequelize");
const { Artisan, Categorie } = require("../models");

// GET /api/artisans?ville=Lyon&categorie=Alimentation&recherche=boucher&top=true
exports.getTousLesArtisans = async (req, res, next) => {
  try {
    const { ville, categorie, recherche, top } = req.query;
    const where = {};
    const includeWhere = {};

    if (ville) where.ville = { [Op.like]: `%${ville}%` };
    if (top !== undefined) where.top = top === "true";
    if (recherche) {
      where[Op.or] = [
        { nom: { [Op.like]: `%${recherche}%` } },
        { specialite: { [Op.like]: `%${recherche}%` } },
      ];
    }
    if (categorie) includeWhere.nom = { [Op.like]: `%${categorie}%` };

    const artisans = await Artisan.findAll({
      where,
      include: [{ model: Categorie, as: "categorie", where: Object.keys(includeWhere).length ? includeWhere : undefined, attributes: ["id", "nom","slug"] }],
      order: [["top", "DESC"], ["note", "DESC"]],
    });

    res.json(artisans);
  } catch (err) {
    next(err);
  }
};

// GET /api/artisans/:id
exports.getArtisanParId = async (req, res, next) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id, {
      include: [{ model: Categorie, as: "categorie", attributes: ["id", "nom","slug"] }],
    });
    if (!artisan) {
      const erreur = new Error("Artisan introuvable");
      erreur.statut = 404;
      return next(erreur);
    }
    res.json(artisan);
  } catch (err) {
    next(err);
  }
};

// POST /api/artisans
exports.creerArtisan = async (req, res, next) => {
  try {
    const { nom, specialite, note, ville, aPropos, email, siteWeb, top, categorieId } = req.body;
    const nouvelArtisan = await Artisan.create({
      nom,
      specialite,
      note,
      ville,
      aPropos,
      email,
      siteWeb,
      top: top || false,
      categorieId,
    });
    res.status(201).json(nouvelArtisan);
  } catch (err) {
    next(err);
  }
};

// PUT /api/artisans/:id
exports.modifierArtisan = async (req, res, next) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id);
    if (!artisan) {
      const erreur = new Error("Artisan introuvable");
      erreur.statut = 404;
      return next(erreur);
    }
    await artisan.update(req.body);
    res.json(artisan);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/artisans/:id
exports.supprimerArtisan = async (req, res, next) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id);
    if (!artisan) {
      const erreur = new Error("Artisan introuvable");
      erreur.statut = 404;
      return next(erreur);
    }
    await artisan.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
