const { ProductDetailSection, SectionIngredient, SectionIngredientDescription } = require("../models");
const cloudinary = require("../utils/cloudinary");
exports.createSection = async (req, res) => {
  try {
    const { product_detail_id } = req.params;
    const { type, title, text_description } = req.body;

    const result = cloudinary.uploader.upload_stream(
      { folder: 'blogs' },
      async (error, result) => {
        if (error) return res.status(500).json({ message: 'Upload error', error });

        const newSection = await ProductDetailSection.create({
          product_detail_id,
          type,
          title,
          text_description,
          image: result.secure_url,
        });

        res.status(201).json({ message: 'Detail section created', newSection });
      }
    );
    result.end(req.file.buffer);
  } catch (err) {
    console.error('Create section error:', err);
    res.status(500).json({ message: "Create section failed", error: err.message });
  }
};

exports.createFullSection = async (req, res) => {
  try {
    const { product_detail_id } = req.params;
    const { type, title, text_description, description } = req.body;


    // 1. Tạo section
    const section = await ProductDetailSection.create({
      product_detail_id,
      type,
      title,
      text_description,
    });

    const section_id = section.id;

    // 2. Tạo mô tả từng dòng (section_ingredient_descriptions)
    if (description?.description?.length) {
      const mappedDescriptions = description.description.map(text => ({
        section_id,
        text
      }));
      await SectionIngredientDescription.bulkCreate(mappedDescriptions);
    }

    // 3. Tạo danh sách thành phần (section_ingredients)
    if (description?.ingredients?.length) {
      const mappedIngredients = description.ingredients.map(item => ({
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
    const { product_detail_id } = req.params;
    const { type, title, text_description } = req.body;

    const section = await ProductDetailSection.findByPk(product_detail_id);
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
            text_description: text_description ?? section.text_description,
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
        text_description: text_description ?? section.text_description,
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
    const { product_detail_id } = req.params;

    const section = await ProductDetailSection.findByPk(product_detail_id);
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
