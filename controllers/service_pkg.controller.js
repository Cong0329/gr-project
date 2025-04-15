const { ServicePackage, ServiceCategory, ServiceItem, PackageItem } = require('../models');
const { Op } = require('sequelize');

// Get all service packages
const getAllPackages = async (req, res) => {
  try {
    const { type } = req.query;
    
    // Tạo điều kiện tìm kiếm
    const whereCondition = {};
    if (type && ['general', 'medical'].includes(type)) {
      whereCondition.type = type;
    }
    
    const packages = await ServicePackage.findAll({
      where: whereCondition,
      include: [
        { 
          model: ServiceCategory, 
          as: 'category' 
        },
        {
          model: ServiceItem,
          as: 'items',
          through: { attributes: ['quantity'] }
        }
      ]
    });
    
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching service packages:', error);
    res.status(500).json({ message: 'Failed to fetch service packages', error: error.message });
  }
};

// Get service packages by category ID
const getPackagesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { type } = req.query;
    
    // Tạo điều kiện tìm kiếm
    const whereCondition = { categoryId };
    if (type && ['general', 'medical'].includes(type)) {
      whereCondition.type = type;
    }
    
    const packages = await ServicePackage.findAll({
      where: whereCondition,
      include: [
        { 
          model: ServiceCategory, 
          as: 'category' 
        },
        {
          model: ServiceItem,
          as: 'items',
          through: { attributes: ['quantity'] }
        }
      ]
    });
    
    if (packages.length === 0) {
      return res.status(404).json({ message: 'No packages found for this category' });
    }
    
    res.status(200).json(packages);
  } catch (error) {
    console.error('Error fetching packages by category:', error);
    res.status(500).json({ message: 'Failed to fetch packages', error: error.message });
  }
};

// Get service package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await ServicePackage.findByPk(id, {
      include: [
        { 
          model: ServiceCategory, 
          as: 'category' 
        },
        {
          model: ServiceItem,
          as: 'items',
          through: { attributes: ['quantity'] }
        }
      ]
    });
    
    if (!pkg) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    res.status(200).json(pkg);
  } catch (error) {
    console.error('Error fetching service package:', error);
    res.status(500).json({ message: 'Failed to fetch service package', error: error.message });
  }
};

// Create a new service package
const createPackage = async (req, res) => {
  try {
    const { 
      name, description, type, price, totalDuration, rating, 
      reviews, target, image, details, availableLocations, 
      validUntil, categoryId, items 
    } = req.body;
    
    // Verify service category exists
    const category = await ServiceCategory.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    
    // Create package
    const newPackage = await ServicePackage.create({
      name,
      description,
      type,
      price,
      totalDuration,
      rating,
      reviews,
      target,
      image,
      details,
      availableLocations,
      validUntil,
      categoryId
    });
    
    // Add items to package if provided
    if (items && Array.isArray(items) && items.length > 0) {
      const packageItems = items.map(item => ({
        packageId: newPackage.id,
        itemId: item.itemId,
        quantity: item.quantity || 1
      }));
      
      await PackageItem.bulkCreate(packageItems);
    }
    
    // Fetch created package with relations
    const createdPackage = await ServicePackage.findByPk(newPackage.id, {
      include: [
        { model: ServiceCategory, as: 'category' },
        {
          model: ServiceItem,
          as: 'items',
          through: { attributes: ['quantity'] }
        }
      ]
    });
    
    res.status(201).json(createdPackage);
  } catch (error) {
    console.error('Error creating service package:', error);
    res.status(500).json({ message: 'Failed to create service package', error: error.message });
  }
};

// Update a service package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, description, type, price, totalDuration, rating, 
      reviews, target, image, details, availableLocations, 
      validUntil, categoryId, items 
    } = req.body;
    
    const pkg = await ServicePackage.findByPk(id);
    
    if (!pkg) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    // If categoryId is being updated, verify the new category exists
    if (categoryId && categoryId !== pkg.categoryId) {
      const category = await ServiceCategory.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Service category not found' });
      }
    }
    
    // Update package details
    await pkg.update({
      name,
      description,
      type,
      price,
      totalDuration,
      rating,
      reviews,
      target,
      image,
      details,
      availableLocations,
      validUntil,
      categoryId
    });
    
    // Update package items if provided
    if (items && Array.isArray(items)) {
      // Remove existing items
      await PackageItem.destroy({
        where: { packageId: id }
      });
      
      // Add new items
      if (items.length > 0) {
        const packageItems = items.map(item => ({
          packageId: id,
          itemId: item.itemId,
          quantity: item.quantity || 1
        }));
        
        await PackageItem.bulkCreate(packageItems);
      }
    }
    
    // Fetch updated package with relations
    const updatedPackage = await ServicePackage.findByPk(id, {
      include: [
        { model: ServiceCategory, as: 'category' },
        {
          model: ServiceItem,
          as: 'items',
          through: { attributes: ['quantity'] }
        }
      ]
    });
    
    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error('Error updating service package:', error);
    res.status(500).json({ message: 'Failed to update service package', error: error.message });
  }
};

// Delete a service package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pkg = await ServicePackage.findByPk(id);
    
    if (!pkg) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    // Delete package items first (cascade delete would work too if set up)
    await PackageItem.destroy({
      where: { packageId: id }
    });
    
    // Delete the package
    await pkg.destroy();
    
    res.status(200).json({ message: 'Service package deleted successfully' });
  } catch (error) {
    console.error('Error deleting service package:', error);
    res.status(500).json({ message: 'Failed to delete service package', error: error.message });
  }
};

module.exports = {
  getAllPackages,
  getPackagesByCategory,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};