const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Artisan = sequelize.define(
  "Artisan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    specialite: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    note: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: { min: 0, max: 5 },
      get() {
        const valeur = this.getDataValue("note");
        return valeur === null ? null : parseFloat(valeur);
      },
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ville: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    aPropos: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "a_propos",
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    siteWeb: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "site_web",
    },
    top: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "artisans",
    timestamps: false,
  }
);

module.exports = Artisan;
