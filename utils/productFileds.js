const pickProductFields = (body) => {
    const {
      name,
      code,
      type,
      dosage_form,
      specification,
      ingredients,
      registration_number,
      description,
      manufacturer,
      quantity,
      brand_id,
      category_id,
      medical_object_id,
      indication_id,
    } = body;
  
    return {
      name,
      code,
      type,
      dosage_form,
      specification,
      ingredients,
      registration_number,
      description,
      manufacturer,
      quantity,
      brand_id,
      category_id,
      medical_object_id,
      indication_id,
    };
  };
  
  module.exports = pickProductFields;
  