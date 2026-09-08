const fs = require("fs");
const path = require("path");
const { sequelize, Artisan, Categorie } = require("../models");
const slugify = require("../utils/slugify");

const CHEMIN_CSV = path.join(__dirname, "artisans.csv");

// Parseur CSV minimal adapté au fichier fourni (séparateur ";", pas de guillemets)
function parserCSV(contenu) {
  const lignes = contenu.split("\n").filter((l) => l.trim() !== "");
  const entetes = lignes[0].split(";").map((e) => e.trim());

  return lignes.slice(1).map((ligne) => {
    const valeurs = ligne.split(";");
    const objet = {};
    entetes.forEach((entete, i) => {
      objet[entete] = (valeurs[i] || "").trim();
    });
    return objet;
  });
}

// "4,5" -> 4.5 ; "5,0" -> 5.0
function parserNote(valeur) {
  return parseFloat(valeur.replace(",", "."));
}

// "VRAI" / "FAUX" -> true / false
function parserBooleen(valeur) {
  return valeur.trim().toUpperCase() === "VRAI";
}

async function peuplerBDD() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données établie");

    await sequelize.sync({ force: true }); // recrée les tables à chaque exécution du seed
    console.log("Tables recréées");

    const contenu = fs.readFileSync(CHEMIN_CSV, "utf-8");
    const lignes = parserCSV(contenu);

    // 1. Extraction des catégories uniques et création
    const nomsCategories = [...new Set(lignes.map((l) => l["Catégorie"]))];
    const categoriesCreees = await Categorie.bulkCreate(
      nomsCategories.map((nom) => ({ nom, slug: slugify(nom) })),
      { returning: true }
    );
    const idParCategorie = Object.fromEntries(
      categoriesCreees.map((cat) => [cat.nom, cat.id])
    );
    console.log(`${categoriesCreees.length} catégories insérées`);

    // 2. Création des artisans reliés à leur catégorie
    const artisansAInserer = lignes.map((l) => ({
      nom: l["Nom"],
      specialite: l["Spécialité"],
      note: parserNote(l["Note"]),
      ville: l["Ville"],
      aPropos: l["A propos"],
      email: l["Email"],
      siteWeb: l["Site Web"] || null,
      top: parserBooleen(l["Top"]),
      categorieId: idParCategorie[l["Catégorie"]],
    }));

    await Artisan.bulkCreate(artisansAInserer);
    console.log(`${artisansAInserer.length} artisans insérés`);

    console.log("Seed terminé avec succès");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seed :", err);
    process.exit(1);
  }
}

peuplerBDD();
