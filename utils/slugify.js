// Transforme "Bâtiment" -> "batiment", "Auvergne-Rhône-Alpes" -> "auvergne-rhone-alpes"
function slugify(texte) {
  return texte
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

module.exports = slugify;
