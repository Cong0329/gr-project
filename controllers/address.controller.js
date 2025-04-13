const { Address, User } = require("../models");

// Add new Address
exports.createAddress = async (req, res) => {
  try {
    const { name, phone, street, ward, district, province, type, default_address } = req.body;
    const user_id = req.user.id;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newAddress = await Address.create({
      user_id,
      name,
      phone,
      street,
      ward,
      district,
      province,
      type,
      default_address
    });

    res.status(201).json({ message: "Address created", address: newAddress });
  } catch (err) {
    console.error("Create address error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Address by User
exports.getAddressesByUser = async (req, res) => {
    try {
      const  user_id = req.user.id;
  
      const addresses = await Address.findAll({
        where: { user_id },
        order: [['created_at', 'DESC']],
        attributes : { exclude: ['user_id', 'created_at', 'updated_at'] },
      });
  
      res.json({ addresses });
    } catch (err) {
      console.error("Get address error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
 
// Get All Address 
  exports.getAllAddresses = async (req, res) => {
    try {
      const addresses = await Address.findAll({
        order: [['created_at', 'DESC']],
        attributes : { exclude: ['user_id', 'created_at', 'updated_at'] },
        include: [
          {
            model: User,
            as: 'user',
            attributes:  ['id', 'name', 'email']
          }
        ]
      });
  
      res.json({ addresses });
    } catch (err) {
      console.error("Get all addresses error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// Update Address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const {
      name, phone, street, ward, district, province, type, default_address
    } = req.body;

    const address = await Address.findByPk(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Kiểm tra quyền sở hữu
    if (address.user_id !== user_id) {
      return res.status(403).json({ message: "You do not have permission to update this address." });
    }

    await address.update({
      name, phone, street, ward, district, province, type, default_address,
      updated_at: new Date(),
    });

    res.json({ message: "Address updated", address });
  } catch (err) {
    console.error("Update address error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Delete Address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const address = await Address.findByPk(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user_id !== user_id) {
      return res.status(403).json({ message: "You do not have permission to delete this address." });
    }

    await address.destroy();
    res.json({ message: "Address deleted" });
  } catch (err) {
    console.error("Delete address error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
