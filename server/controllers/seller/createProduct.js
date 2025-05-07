const Product = require('../../models/products');

const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            unit_type,
            unit_price,
            status,
            ratings,
            reviews,
            seller_id,
            discount,
            comments
        } = req.body;

        const newProduct = new Product({
            name,
            description,
            category,
            unit_type,
            unit_price,
            status,
            ratings,
            reviews,
            seller_id,
            discount,
            comments
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { addProduct };
