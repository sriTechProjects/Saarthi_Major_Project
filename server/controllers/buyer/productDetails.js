const { model } = require("mongoose");
const Product = require("../../models/products");

const productDetails = async (req, res) => {
    try {
        const { productId } = req.params;

        // Fetch the product details by ID
        const product = await Product.findById(productId).populate('seller_id');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product details",
            error,
        });
    }
}

module.exports = {productDetails}