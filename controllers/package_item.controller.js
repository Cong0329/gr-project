const { PackageItem, ServiceItem, ServicePackage } = require('../models');

// Get all package_items
exports.getAllPackageItems = async (req, res) => {
  try {
    const items = await PackageItem.findAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all items of a specific packageId
exports.getItemsByPackageId = async (req, res) => {
  const { packageId } = req.params;
  try {
    const items = await PackageItem.findAll({
      where: { packageId },
      include: [
        { model: ServiceItem, as: 'item' }
      ]
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Add item(s) to a package
exports.addItemToPackage = async (req, res) => {
  const { packageId, itemId, quantity } = req.body;
  try {
    const newItem = await PackageItem.create({ packageId, itemId, quantity });
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Update quantity of an item in a package
exports.updateItemQuantity = async (req, res) => {
  const { packageId, itemId } = req.params;
  const { quantity } = req.body;

  try {
    const updated = await PackageItem.update(
      { quantity },
      { where: { packageId, itemId } }
    );
    res.json({ message: 'Quantity updated', updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete item from package
exports.deleteItemFromPackage = async (req, res) => {
  const { packageId, itemId } = req.params;
  try {
    await PackageItem.destroy({ where: { packageId, itemId } });
    res.json({ message: 'Item removed from package' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
