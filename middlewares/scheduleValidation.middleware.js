const { Department, GeneralPackage, MedicalPackage } = require('../models');

const validateServiceTypeAndId = async (req, res, next) => {
  try {
    const { type, service_id } = req.body;
    
    if (!type || !service_id) {
      return next(); // Skip validation if fields are not provided
    }
    
    let model;
    switch (type) {
      case 'general':
        model = GeneralPackage;
        break;
      case 'medical':
        model = MedicalPackage;
        break;
      case 'specialist':
      case 'specialist_online':
        model = Department;
        break;
      default:
        return res.status(400).json({ message: 'Invalid service type' });
    }
    
    const service = await model.findByPk(service_id);
    if (!service) {
      return res.status(400).json({ 
        message: `Service ID not found in ${type} table` 
      });
    }
    
    next();
  } catch (error) {
    console.error('Validation error:', error);
    return res.status(500).json({ message: 'Server Error during validation' });
  }
};

module.exports = { validateServiceTypeAndId };