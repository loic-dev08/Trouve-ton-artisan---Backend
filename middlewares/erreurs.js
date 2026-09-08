// Erreur 404 lorsqu'aucune route ne correspond
function routeIntrouvable(req, res, next) {
  res.status(404).json({ message: `Route ${req.originalUrl} introuvable` });
}

// Gestionnaire d'erreurs global (Sequelize + erreurs applicatives)
function gestionnaireErreurs(err, req, res, next) {
  console.error(err);

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    return res.status(400).json({
      message: "Données invalides",
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({ message: "Catégorie associée invalide ou inexistante" });
  }

  const statut = err.statut || 500;
  res.status(statut).json({ message: err.message || "Erreur interne du serveur" });
}

module.exports = { routeIntrouvable, gestionnaireErreurs };
