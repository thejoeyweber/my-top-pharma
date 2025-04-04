function dbTherapeuticAreaToTherapeuticArea(dbTherapeuticArea) {
  return {
    id: dbTherapeuticArea.id,
    name: dbTherapeuticArea.name,
    slug: dbTherapeuticArea.slug,
    description: dbTherapeuticArea.description || "",
    iconPath: dbTherapeuticArea.icon_path || void 0,
    createdAt: dbTherapeuticArea.created_at || void 0,
    updatedAt: dbTherapeuticArea.updated_at || void 0
  };
}

export { dbTherapeuticAreaToTherapeuticArea as d };
