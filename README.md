# Trouve ton artisan — Backend

API REST du projet "Trouve ton artisan" (plateforme régionale Auvergne-Rhône-Alpes mettant en relation particuliers et artisans).

## Stack

- Node.js / Express
- Sequelize ORM / MySQL
- dotenv, cors

## Structure

```
config/database.js       → connexion Sequelize
models/Artisan.js         → modèle Artisan
models/Categorie.js       → modèle Categorie
models/index.js           → associations (Categorie 1—N Artisan)
controllers/               → logique métier (CRUD)
routes/                    → définition des endpoints
middlewares/erreurs.js    → 404 + gestion centralisée des erreurs
seed/artisans.csv          → données fournies (converties en UTF-8)
seed/seed.js                → script de peuplement de la BDD depuis le CSV
server.js                   → point d'entrée
```

## Modèle de données

**Categorie**
| Champ | Type |
|---|---|
| id | INTEGER (PK) |
| nom | STRING, unique |

**Artisan**
| Champ | Type |
|---|---|
| id | INTEGER (PK) |
| nom | STRING |
| specialite | STRING |
| note | DECIMAL(2,1) |
| ville | STRING |
| aPropos | TEXT |
| email | STRING |
| siteWeb | STRING, nullable |
| top | BOOLEAN |
| categorieId | FK → Categorie |

## Installation

```bash
npm install
cp .env.example .env   # renseigner les identifiants MySQL
```

Créer la base de données vide au préalable :

```sql
CREATE DATABASE trouve_ton_artisan CHARACTER SET utf8mb4;
```

## Peupler la base depuis le CSV fourni

```bash
npm run seed
```

Ce script recrée les tables (`sync({ force: true })`), extrait les catégories uniques du CSV, les insère, puis insère tous les artisans en les reliant à leur catégorie. Les notes ("4,5") et les booléens ("VRAI"/"FAUX") du fichier source sont convertis automatiquement.

## Lancer le serveur

```bash
npm run dev     # avec nodemon
npm start        # en production
```

Serveur disponible sur `http://localhost:5000`.

## Endpoints

### Artisans

| Méthode | Route | Description |
|---|---|---|
| GET | /api/artisans | Liste des artisans (filtres : `?ville=`, `?categorie=`, `?recherche=`, `?top=true`) |
| GET | /api/artisans/:id | Détail d'un artisan (avec sa catégorie) |
| POST | /api/artisans | Créer un artisan |
| PUT | /api/artisans/:id | Modifier un artisan |
| DELETE | /api/artisans/:id | Supprimer un artisan |

### Categories

| Méthode | Route | Description |
|---|---|---|
| GET | /api/categories | Liste des catégories |
| GET | /api/categories/:id | Détail d'une catégorie (avec ses artisans) |
| POST | /api/categories | Créer une catégorie |
| PUT | /api/categories/:id | Modifier une catégorie |
| DELETE | /api/categories/:id | Supprimer une catégorie |

## Exemple de body pour créer un artisan

```json
{
  "nom": "Chez Paul",
  "specialite": "Boulanger",
  "note": 4.6,
  "ville": "Lyon",
  "aPropos": "Boulangerie artisanale depuis 1985.",
  "email": "contact@chezpaul.fr",
  "siteWeb": "https://chezpaul.fr",
  "top": false,
  "categorieId": 1
}
```
