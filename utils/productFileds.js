const pickProductFields = (body) => {
    const {
      name,
      code,
      type,
      rating,
      review_count,
      comment_count,
      dosage_form,
      specification,
      ingredients,
      registration_number,
      description,
      manufacturer,
      quantity,
      brand_id,
      category_id,
      origin_id,
      country_id,
      medical_object_id,
      indication_id,
    } = body;
  
    return {
      name,
      code,
      type,
      rating,
      review_count,
      comment_count,
      dosage_form,
      specification,
      ingredients,
      registration_number,
      description,
      manufacturer,
      quantity,
      brand_id,
      category_id,
      origin_id,
      country_id,
      medical_object_id,
      indication_id,
    };
  };
  
  module.exports = pickProductFields;
  