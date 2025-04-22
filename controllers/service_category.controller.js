const { ServiceCategory, ServicePackage, ServiceItem } = require('../models');

// Get all service categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.findAll({
      include: [
        {
          model: ServiceCategory,
          as: 'subCategories'
        }
      ]
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching service categories:', error);
    res.status(500).json({ message: 'Failed to fetch service categories', error: error.message });
  }
};

// Get service categories by parent ID
const getCategoriesByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const whereCondition = parentId === '0' 
      ? { parentId: null } // Root categories
      : { parentId };
    
    const categories = await ServiceCategory.findAll({
      where: whereCondition,
      include: [
        {
          model: ServiceCategory,
          as: 'subCategories'
        }
      ]
    });
    
    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found for this parent' });
    }
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories by parent:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

// Get service category by ID with all related data
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await ServiceCategory.findByPk(id, {
      include: [
        {
          model: ServiceCategory,
          as: 'subCategories'
        },
        {
          model: ServicePackage,
          as: 'servicePackages'
        },
        {
          model: ServiceItem,
          as: 'serviceItems'
        }
      ]
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    
    res.status(200).json(category);
  } catch (error) {
    console.error('Error fetching service category:', error);
    res.status(500).json({ message: 'Failed to fetch service category', error: error.message });
  }
};

// Create a new service category
const createCategory = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    
    // Verify parent category exists if provided
    if (parentId) {
      const parentCategory = await ServiceCategory.findByPk(parentId);
      if (!parentCategory) {
        return res.status(404).json({ message: 'Parent category not found' });
      }
    }
    
    const newCategory = await ServiceCategory.create({
      name,
      parentId: parentId || null
    });
    
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating service category:', error);
    res.status(500).json({ message: 'Failed to create service category', error: error.message });
  }
};

// Update a service category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId } = req.body;
    
    const category = await ServiceCategory.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    
    // Verify parent category exists if provided and is not self
    if (parentId) {
      if (parseInt(parentId) === parseInt(id)) {
        return res.status(400).json({ message: 'Category cannot be its own parent' });
      }
      
      const parentCategory = await ServiceCategory.findByPk(parentId);
      if (!parentCategory) {
        return res.status(404).json({ message: 'Parent category not found' });
      }
      
      // Check for circular references
      let currentParent = parentId;
      while (currentParent) {
        const parent = await ServiceCategory.findByPk(currentParent);
        if (!parent) break;
        
        if (parent.parentId === id) {
          return res.status(400).json({ message: 'Circular reference detected in category hierarchy' });
        }
        
        currentParent = parent.parentId;
      }
    }
    
    await category.update({
      name,
      parentId: parentId || null
    });
    
    res.status(200).json(category);
  } catch (error) {
    console.error('Error updating service category:', error);
    res.status(500).json({ message: 'Failed to update service category', error: error.message });
  }
};

// Delete a service category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await ServiceCategory.findByPk(id, {
      include: [
        {
          model: ServiceCategory,
          as: 'subCategories'
        },
        {
          model: ServicePackage,
          as: 'servicePackages'
        },
        {
          model: ServiceItem,
          as: 'serviceItems'
        }
      ]
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    
    // Check if category has children or related items
    if (category.subCategories.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with subcategories. Please delete subcategories first.' 
      });
    }
    
    if (category.servicePackages.length > 0 || category.serviceItems.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with associated packages or items. Please delete or reassign them first.' 
      });
    }
    
    await category.destroy();
    
    res.status(200).json({ message: 'Service category deleted successfully' });
  } catch (error) {
    console.error('Error deleting service category:', error);
    res.status(500).json({ message: 'Failed to delete service category', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoriesByParent,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};