const { Country, Product } = require('../models');

exports.createCountry = async (req, res) => {
    try {
        const { name, code } = req.body;

        if (!name && code) {
            return res.status(400).json({ message: 'Name and code is required' });
        }

        const country = await Country.create({ name, code });
        res.status(201).json({ message: 'country created', country });
    } catch (err) {
        console.error('Create country error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllCountries = async (req, res) => {
    try {
        const countrys = await Country.findAll({
            attributes: ['id', 'name', 'code'],
        });
        res.json({ countrys });
    } catch (err) {
        console.error('Get countrys error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;

        const country = await Country.findByPk(id);
        if (!country) {
            return res.status(404).json({ message: 'country not found' });
        }

        if (name !== undefined) country.name = name;
        if (code !== undefined) country.code = code;
        await country.save();

        res.json({ message: 'country updated', country });
    } catch (err) {
        console.error('Update country error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteCountry = async (req, res) => {
    try {
        const { id } = req.params;

        const country = await Country.findByPk(id);
        if (!country) {
            return res.status(404).json({ message: 'country not found' });
        }

        await country.destroy();
        res.json({ message: 'country deleted' });
    } catch (err) {
        console.error('Delete country error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getProductsByCountryName = async (req, res) => {
    const { name } = req.params;

    try {
        const country = await Country.findOne({
            where: { name: name },
            include: [
                {
                    model: Product,
                    as: 'products',
                    attributes: ['id', 'name', 'slug', 'code', 'rating']
                }
            ]
        });

        if (!country) return res.status(404).json({ message: 'Country not found' });

        res.status(200).json({
            products: country.products
        });
    } catch (error) {
        console.error('Error fetching products by country name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

