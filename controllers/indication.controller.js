const { Indication } = require('../models');

exports.createIndication = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const indication = await Indication.create({ name });
        res.status(201).json({ message: 'indication created', indication });
    } catch (err) {
        console.error('Create indication error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllIndications = async (req, res) => {
    try {
        const indications = await Indication.findAll();
        res.json({ indications });
    } catch (err) {
        console.error('Get indications error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateIndication = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const indication = await Indication.findByPk(id);
        if (!indication) {
            return res.status(404).json({ message: 'indication not found' });
        }

        if (name !== undefined) indication.name = name;
        await indication.save();

        res.json({ message: 'indication updated', indication });
    } catch (err) {
        console.error('Update indication error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteIndication = async (req, res) => {
    try {
        const { id } = req.params;

        const indication = await Indication.findByPk(id);
        if (!indication) {
            return res.status(404).json({ message: 'indication not found' });
        }

        await indication.destroy();
        res.json({ message: 'indication deleted' });
    } catch (err) {
        console.error('Delete indication error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};



