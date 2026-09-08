const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const artisansRouter = require("./routes/artisans");
const categoriesRouter = require("./routes/categories");
const { routeIntrouvable, gestionnaireErreurs } = require("./middlewares/erreurs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Trouve ton artisan opérationnelle" });
});

app.use("/api/artisans", artisansRouter);
app.use("/api/categories", categoriesRouter);

app.use(routeIntrouvable);
app.use(gestionnaireErreurs);

async function demarrer() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données MySQL établie");

    await sequelize.sync(); // ne recrée pas les tables si elles existent déjà
    console.log("Modèles synchronisés avec la base de données");

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Impossible de démarrer le serveur :", err);
    process.exit(1);
  }
}

demarrer();
