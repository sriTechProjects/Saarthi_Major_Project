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


const editProduct = async (req, res) => {
    try {
        console.log("Files:", req.files); 
        console.log("Body:", req.body);  

        const imagePaths = req.files?.map(file => file.filename);
        const id = req.body.id;

        console.log(`Product id: ${id}`);
        const product = await Product.findOne({_id: id});
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        console.log(`Product details: ${product}`);

        // Update fields
        product.name = req.body.name || product.name;
        product.category = req.body.category || product.category;
        product.description = req.body.description || product.description;
        product.unit_type = req.body.unit_type || product.unit_type;
        product.unit_price = req.body.unit_price || product.unit_price;
        product.discount = req.body.discount || product.discount;
        product.status = req.body.status || product.status;
        product.seller_id = req.body.seller_id || product.seller_id;

        await product.save();
        res.status(201).json({ message: "Product added", product });
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { addProduct, editProduct };
