const { SectionIngredient } = require("../models");
exports.createIngredient = async (req, res) => {
    try {
      const { section_id } = req.params;
      const data = await SectionIngredient.create({ ...req.body, section_id });
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ message: "Create failed", error: err.message });
    }
  };

  // update ingredient

  exports.updateIngredient = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, value } = req.body;
  
      const ingredient = await SectionIngredient.findByPk(id);
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
  
      await ingredient.update({ name, value });
      res.status(200).json({ message: "Ingredient updated", data: ingredient });
    } catch (err) {
      res.status(500).json({ message: "Update failed", error: err.message });
    }
  };

// delete ingredient  
  exports.deleteIngredient = async (req, res) => {
    try {
      const { id } = req.params;
  
      const ingredient = await SectionIngredient.findByPk(id);
      if (!ingredient) {
        return res.status(404).json({ message: "Ingredient not found" });
      }
  
      await ingredient.destroy();
      res.status(200).json({ message: "Ingredient deleted" });
    } catch (err) {
      res.status(500).json({ message: "Delete failed", error: err.message });
    }
  };
  