const { Brand, Category, Origin, Country, MedicalObject, Indication, ProductImage, ProductOption } = require('../models');

const productIncludeOptions = [
    { model: Brand, as: 'brand', attributes: ['id', 'name','country', 'original'] },
    { model: Category, as: 'category', attributes: ['id', 'name'] },
    { model: MedicalObject, as: 'medical_object', attributes: ['id', 'name'] },
    { model: Indication, as: 'indication', attributes: ['id', 'name'] },
    {
        model: ProductImage,
        as: 'images',
        attributes: ['id', 'image']
    },
    {
        model: ProductOption,
        as: 'options',
        attributes: ['id', 'label', 'price', 'discounted_price']
    }
];

const productExcludeAttributes = {
    exclude: [
        'brand_id',
        'category_id',
        'origin_id',
        'country_id',
        'medical_object_id',
        'indication_id',
        'createdAt',
        'updatedAt'
    ]
};




module.exports = {
    productIncludeOptions,
    productExcludeAttributes
};
