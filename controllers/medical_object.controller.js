const { MedicalObject, Product } = require('../models');

exports.createMedicalObject = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const medical_object = await MedicalObject.create({ name });
        res.status(201).json({ message: 'medical_object created', medical_object });
    } catch (err) {
        console.error('Create medical_object error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllMedicalObjects = async (req, res) => {
    try {
        const medical_objects = await MedicalObject.findAll();
        res.json({ medical_objects });
    } catch (err) {
        console.error('Get medical_objects error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateMedicalObject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const medical_object = await MedicalObject.findByPk(id);
        if (!medical_object) {
            return res.status(404).json({ message: 'medical_object not found' });
        }

        if (name !== undefined) medical_object.name = name;
        await medical_object.save();

        res.json({ message: 'medical_object updated', medical_object });
    } catch (err) {
        console.error('Update medical_object error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteMedicalObject = async (req, res) => {
    try {
        const { id } = req.params;

        const medical_object = await MedicalObject.findByPk(id);
        if (!medical_object) {
            return res.status(404).json({ message: 'medical_object not found' });
        }
        await medical_object.destroy();
        res.json({ message: 'medical_object deleted' });
    } catch (err) {
        console.error('Delete country error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getProductsByMedicalObjectName = async (req, res) => {
    const { name } = req.params;

    try {
        const medical_object = await MedicalObject.findOne({
            where: { name: name },
            include: [
                {
                    model: Product,
                    as: 'products',
                    attributes: ['id', 'name', 'slug', 'code', 'rating']
                }
            ]
        });

        if (!medical_object) return res.status(404).json({ message: 'Medical object not found' });

        res.status(200).json({
            products: medical_object.products
        });
    } catch (error) {
        console.error('Error fetching products by medical object name:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

