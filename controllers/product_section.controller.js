const { ProductDetailSection, SectionIngredient, SectionIngredientDescription } = require("../models");
const cloudinary = require("../utils/cloudinary");
exports.createSection = async (req, res) => {
  try {
    const { product_detail_id } = req.params;
    const { type, title, description } = req.body;

    if (req.file) {
      // Có file => upload lên cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'blogs' },
        async (error, result) => {
          if (error) return res.status(500).json({ message: 'Upload error', error });

          const newSection = await ProductDetailSection.create({
            product_detail_id,
            type,
            title,
            description,
            image: result.secure_url,
          });

          res.status(201).json({ message: 'Detail section created', newSection });
        }
      );
      uploadStream.end(req.file.buffer);
    } else {
      // Không có file => tạo section bình thường, không có image
      const newSection = await ProductDetailSection.create({
        product_detail_id,
        type,
        title,
        description,
        image: null, // hoặc bạn bỏ luôn trường `image` cũng được
      });

      res.status(201).json({ message: 'Detail section created', newSection });
    }
  } catch (err) {
    console.error('Create section error:', err);
    res.status(500).json({ message: "Create section failed", error: err.message });
  }
};


exports.createFullSection = async (req, res) => {
  try {
    const { product_detail_id } = req.params;
    const { type, title,  descriptions } = req.body;


    // 1. Tạo section
    const section = await ProductDetailSection.create({
      product_detail_id,
      type,
      title,
      descriptions,
    });

    const section_id = section.id;

    // 2. Tạo mô tả từng dòng (section_ingredient_descriptions)
    if (descriptions?.description?.length) {
      const mappedDescriptions = descriptions.description.map(text => ({
        section_id,
        text
      }));
      await SectionIngredientDescription.bulkCreate(mappedDescriptions);
    }

    // 3. Tạo danh sách thành phần (section_ingredients)
    if (descriptions?.ingredients?.length) {
      const mappedIngredients = descriptions.ingredients.map(item => ({
        section_id,
        name: item.name,
        value: item.value
      }));
      await SectionIngredient.bulkCreate(mappedIngredients);
    }

    res.status(201).json({ message: 'Section created with details', section_id });
  } catch (err) {
    console.error('Error creating full section:', err);
    res.status(500).json({ message: 'Failed to create full section', error: err.message });
  }
};

// Update section
exports.updateSection = async (req, res) => {
  try {
    const { section_id } = req.params;
    const { type, title, description } = req.body;
    
    const section = await ProductDetailSection.findByPk(section_id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Nếu có file upload mới -> upload lên Cloudinary
    if (req.file) {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'blogs' },
        async (error, result) => {
          if (error) return res.status(500).json({ message: 'Upload error', error });

          await section.update({
            type: type ?? section.type,
            title: title ?? section.title,
            description: description ?? section.description,
            image: result.secure_url ?? section.image,
          });

          res.status(200).json({ message: 'Section updated', section });
        }
      );
      stream.end(req.file.buffer);
    } else {
      // Không có ảnh mới
      await section.update({
        type: type ?? section.type,
        title: title ?? section.title,
        description: description ?? section.description,
      });

      res.status(200).json({ message: 'Section updated', section });
    }
  } catch (err) {
    console.error('Update section error:', err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete section
exports.deleteSection = async (req, res) => {
  try {
    const { section_id } = req.params;

    const section = await ProductDetailSection.findByPk(section_id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await section.destroy();
    res.status(200).json({ message: 'Section deleted successfully' });
  } catch (err) {
    console.error('Delete section error:', err);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

exports.addDescription = async (req, res) => {
  try {
    const { section_id } = req.params;
    const { text } = req.body;

    const description = await SectionIngredientDescription.create({ section_id, text });
    res.status(201).json({ message: "Description added", description });
  } catch (err) {
    console.error("Add description error:", err);
    res.status(500).json({ message: "Failed to add description", error: err.message });
  }
};

exports.deleteDescription = async (req, res) => {
  try {
    const { id } = req.params;

    const description = await SectionIngredientDescription.findByPk(id);
    if (!description) return res.status(404).json({ message: "Description not found" });

    await description.destroy();
    res.status(200).json({ message: "Description deleted" });
  } catch (err) {
    console.error("Delete description error:", err);
    res.status(500).json({ message: "Failed to delete description", error: err.message });
  }
};

exports.addIngredient = async (req, res) => {
  try {
    const { section_id } = req.params;
    const { name, value } = req.body;

    const ingredient = await SectionIngredient.create({ section_id, name, value });
    res.status(201).json({ message: "Ingredient added", ingredient });
  } catch (err) {
    console.error("Add ingredient error:", err);
    res.status(500).json({ message: "Failed to add ingredient", error: err.message });
  }
};

exports.deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;

    const ingredient = await SectionIngredient.findByPk(id);
    if (!ingredient) return res.status(404).json({ message: "Ingredient not found" });

    await ingredient.destroy();
    res.status(200).json({ message: "Ingredient deleted" });
  } catch (err) {
    console.error("Delete ingredient error:", err);
    res.status(500).json({ message: "Failed to delete ingredient", error: err.message });
  }
};

