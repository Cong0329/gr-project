const { body, validationResult } = require('express-validator');

const validateProductOption = [
  body('product_id')
    .notEmpty().withMessage('Product ID is required')
    .isUUID().withMessage('Product ID must be a valid UUID'),

  body('label')
    .notEmpty().withMessage('Label is required'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

  body('discounted_price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Discounted price must be a positive number'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateProductOption;
