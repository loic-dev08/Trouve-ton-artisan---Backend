const sequelize = require("../config/database");
const Artisan = require("./Artisan");
const Categorie = require("./Categorie");

// Une catégorie regroupe plusieurs artisans / un artisan appartient à une catégorie
Categorie.hasMany(Artisan, {
  foreignKey: { name: "categorieId", field: "categorie_id", allowNull: false },
  as: "artisans",
  onDelete: "RESTRICT",
});
Artisan.belongsTo(Categorie, {
  foreignKey: { name: "categorieId", field: "categorie_id", allowNull: false },
  as: "categorie",
});

module.exports = { sequelize, Artisan, Categorie };
