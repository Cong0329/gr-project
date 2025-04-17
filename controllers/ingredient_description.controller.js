const { SectionIngredientDescription } = require("../models");
exports.createIngredientDescription = async (req, res) => {
    try {
      const { section_id } = req.params;
      const data = await SectionIngredientDescription.create({ ...req.body, section_id });
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ message: "Create failed", error: err.message });
    }
  };

// update description
  exports.updateIngredientDescription = async (req, res) => {
    try {
      const { id } = req.params;
      const { text } = req.body;
  
      const description = await SectionIngredientDescription.findByPk(id);
      if (!description) {
        return res.status(404).json({ message: "Description not found" });
      }
  
      await description.update({ text });
      res.status(200).json({ message: "Description updated", data: description });
    } catch (err) {
      res.status(500).json({ message: "Update failed", error: err.message });
    }
  };
  // delete description
  exports.deleteIngredientDescription = async (req, res) => {
    try {
      const { id } = req.params;
  
      const description = await SectionIngredientDescription.findByPk(id);
      if (!description) {
        return res.status(404).json({ message: "Description not found" });
      }
  
      await description.destroy();
      res.status(200).json({ message: "Description deleted" });
    } catch (err) {
      res.status(500).json({ message: "Delete failed", error: err.message });
    }
  };
    