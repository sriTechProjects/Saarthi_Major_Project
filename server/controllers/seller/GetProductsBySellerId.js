const asyncHandler = require("express-async-handler");
const Product = require("../../models/products");

const GetProductsBySellerId = asyncHandler(async (req, res) => {
    const { seller_id } = req.params;

    if (!seller_id) {
        return res.status(400).json({
            message: "Seller ID is required",
            success: false,
        });
    }

    try {
        const products = await Product.find({ seller_id });

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching products",
            success: false,
        });
    }
});

module.exports = { GetProductsBySellerId };
