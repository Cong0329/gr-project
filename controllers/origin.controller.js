const { Origin } = require('../models');

exports.createOrigin = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const origin = await Origin.create({ name });
        res.status(201).json({ message: 'Origin created', origin });
    } catch (err) {
        console.error('Create origin error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllOrigins = async (req, res) => {
    try {
        const origins = await Origin.findAll();
        res.json({ origins });
    } catch (err) {
        console.error('Get origins error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateOrigin = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const origin = await Origin.findByPk(id);
        if (!origin) {
            return res.status(404).json({ message: 'Origin not found' });
        }

        if (name !== undefined) origin.name = name;
        await origin.save();

        res.json({ message: 'Origin updated', origin });
    } catch (err) {
        console.error('Update origin error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteOrigin = async (req, res) => {
    try {
        const { id } = req.params;

        const origin = await Origin.findByPk(id);
        if (!origin) {
            return res.status(404).json({ message: 'Origin not found' });
        }

        await origin.destroy();
        res.json({ message: 'Origin deleted' });
    } catch (err) {
        console.error('Delete origin error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



