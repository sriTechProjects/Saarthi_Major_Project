const Product = require('../../models/products');

const addProduct = async (req, res) => {
    try {
        console.log("Files:", req.files); // should be an array
        console.log("Body:", req.body);   // contains text fields

        const imagePaths = req.files.map(file => file.filename);

        const product = new Product({
            name: req.body.name,
            category: req.body.category,
            description: req.body.description,
            unit_type: req.body.unit_type,
            unit_price: req.body.unit_price,
            discount: req.body.discount,
            status: req.body.status,
            seller_id: req.body.seller_id,
            images: imagePaths,
        });

        await product.save();
        res.status(201).json({ message: "Product added", product });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { addProduct };
