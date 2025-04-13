const { Country } = require('../models');

exports.createCountry = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const country = await Country.create({ name });
        res.status(201).json({ message: 'country created', country });
    } catch (err) {
        console.error('Create country error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllCountries = async (req, res) => {
    try {
        const countrys = await Country.findAll();
        res.json({ countrys });
    } catch (err) {
        console.error('Get countrys error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateCountry = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const country = await Country.findByPk(id);
        if (!country) {
            return res.status(404).json({ message: 'country not found' });
        }

        if (name !== undefined) country.name = name;
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



