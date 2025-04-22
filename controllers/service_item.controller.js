const { ServiceItem, ServiceCategory, ServicePackage, PackageItem } = require('../models');

// Get all service items
const getAllItems = async (req, res) => {
  try {
    const items = await ServiceItem.findAll({
      include: [{ model: ServiceCategory, as: 'category' }]
    });
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching service items:', error);
    res.status(500).json({ message: 'Failed to fetch service items', error: error.message });
  }
};

// Get service items by category ID
const getItemsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const items = await ServiceItem.findAll({
      where: { categoryId },
      include: [{ model: ServiceCategory, as: 'category' }]
    });
    
    if (items.length === 0) {
      return res.status(404).json({ message: 'No service items found for this category' });
    }
    
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching service items by category:', error);
    res.status(500).json({ message: 'Failed to fetch service items', error: error.message });
  }
};

// Get service items by package ID
const getItemsByPackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    
    // Verify package exists
    const packageExists = await ServicePackage.findByPk(packageId);
    if (!packageExists) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    // Get all items in this package with quantity
    const packageItems = await PackageItem.findAll({
      where: { packageId },
      include: [
        {
          model: ServiceItem,
          include: [{ model: ServiceCategory, as: 'category' }]
        }
      ]
    });
    
    if (packageItems.length === 0) {
      return res.status(404).json({ message: 'No service items found in this package' });
    }
    
    // Format response
    const formattedItems = packageItems.map(pi => ({
      ...pi.ServiceItem.dataValues,
      quantity: pi.quantity
    }));
    
    res.status(200).json(formattedItems);
  } catch (error) {
    console.error('Error fetching service items by package:', error);
    res.status(500).json({ message: 'Failed to fetch service items', error: error.message });
  }
};

// Get service item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ServiceItem.findByPk(id, {
      include: [
        { model: ServiceCategory, as: 'category' },
        {
          model: ServicePackage,
          as: 'packages',
          through: { attributes: ['quantity'] }
        }
      ]
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Service item not found' });
    }
    
    res.status(200).json(item);
  } catch (error) {
    console.error('Error fetching service item:', error);
    res.status(500).json({ message: 'Failed to fetch service item', error: error.message });
  }
};

// Create a new service item
const createItem = async (req, res) => {
  try {
    const { 
      name, description, duration, price, categoryId 
    } = req.body;
    
    // Verify service category exists
    const category = await ServiceCategory.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Service category not found' });
    }
    
    const newItem = await ServiceItem.create({
      name,
      description,
      duration,
      price,
      categoryId
    });
    
    // Fetch created item with relations
    const createdItem = await ServiceItem.findByPk(newItem.id, {
      include: [{ model: ServiceCategory, as: 'category' }]
    });
    
    res.status(201).json(createdItem);
  } catch (error) {
    console.error('Error creating service item:', error);
    res.status(500).json({ message: 'Failed to create service item', error: error.message });
  }
};

// Update a service item
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, description, duration, price, categoryId 
    } = req.body;
    
    const item = await ServiceItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Service item not found' });
    }
    
    // If categoryId is being updated, verify the new category exists
    if (categoryId && categoryId !== item.categoryId) {
      const category = await ServiceCategory.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Service category not found' });
      }
    }
    
    await item.update({
      name,
      description,
      duration,
      price,
      categoryId
    });
    
    // Fetch updated item with relations
    const updatedItem = await ServiceItem.findByPk(id, {
      include: [{ model: ServiceCategory, as: 'category' }]
    });
    
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating service item:', error);
    res.status(500).json({ message: 'Failed to update service item', error: error.message });
  }
};

// Delete a service item
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await ServiceItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Service item not found' });
    }
    
    // Check if this item is used in any packages
    const packageItems = await PackageItem.findAll({
      where: { itemId: id }
    });
    
    if (packageItems.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete item that is used in packages. Please remove it from packages first.',
        usedInPackages: packageItems.map(pi => pi.packageId)
      });
    }
    
    await item.destroy();
    
    res.status(200).json({ message: 'Service item deleted successfully' });
  } catch (error) {
    console.error('Error deleting service item:', error);
    res.status(500).json({ message: 'Failed to delete service item', error: error.message });
  }
};

// Add service item to a package
const addItemToPackage = async (req, res) => {
  try {
    const { itemId, packageId } = req.params;
    const { quantity = 1 } = req.body;
    
    // Verify item and package exist
    const item = await ServiceItem.findByPk(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Service item not found' });
    }
    
    const pkg = await ServicePackage.findByPk(packageId);
    if (!pkg) {
      return res.status(404).json({ message: 'Service package not found' });
    }
    
    // Check if item is already in package
    const existingItem = await PackageItem.findOne({
      where: { itemId, packageId }
    });
    
    if (existingItem) {
      // Update quantity if already exists
      await existingItem.update({ quantity });
      return res.status(200).json({ 
        message: 'Item quantity updated in package',
        packageItem: existingItem
      });
    }
    
    // Add item to package
    const packageItem = await PackageItem.create({
      itemId,
      packageId,
      quantity
    });
    
    res.status(201).json({ 
      message: 'Item added to package successfully',
      packageItem
    });
  } catch (error) {
    console.error('Error adding item to package:', error);
    res.status(500).json({ message: 'Failed to add item to package', error: error.message });
  }
};

// Remove service item from a package
const removeItemFromPackage = async (req, res) => {
  try {
    const { itemId, packageId } = req.params;
    
    // Check if item is in package
    const packageItem = await PackageItem.findOne({
      where: { itemId, packageId }
    });
    
    if (!packageItem) {
      return res.status(404).json({ message: 'Item not found in this package' });
    }
    
    // Remove item from package
    await packageItem.destroy();
    
    res.status(200).json({ message: 'Item removed from package successfully' });
  } catch (error) {
    console.error('Error removing item from package:', error);
    res.status(500).json({ message: 'Failed to remove item from package', error: error.message });
  }
};

module.exports = {
  getAllItems,
  getItemsByCategory,
  getItemsByPackage,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  addItemToPackage,
  removeItemFromPackage
};