const { body, validationResult } = require("express-validator");

const validatePatchProduct = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("code").optional().isString().withMessage("Code must be a string"),
  body("type").optional().isString().withMessage("Type must be a string"),
  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
  body("review_count").optional().isInt({ min: 0 }).withMessage("Review count must be a non-negative integer"),
  body("comment_count").optional().isInt({ min: 0 }).withMessage("Comment count must be a non-negative integer"),
  body("dosage_form").optional().isString(),
  body("specification").optional().isString(),
  body("ingredients").optional().isString(),
  body("registration_number").optional().isString(),
  body("description").optional().isString(),
  body("manufacturer").optional().isString(),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  body("brand_id").optional().isInt().withMessage("Brand ID must be an integer"),
  body("category_id").optional().isInt().withMessage("Category ID must be an integer"),
  body("origin_id").optional().isInt().withMessage("Origin ID must be an integer"),
  body("country_id").optional().isInt().withMessage("Country ID must be an integer"),
  body("medical_object_id").optional().isInt().withMessage("Medical Object ID must be an integer"),
  body("indication_id").optional().isInt().withMessage("Indication ID must be an integer"),

  // validate result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validatePatchProduct;
