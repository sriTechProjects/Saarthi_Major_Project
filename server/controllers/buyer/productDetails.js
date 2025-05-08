const { model } = require("mongoose");
const Product = require("../../models/products");
const Interaction = require('../../models/interaction'); 

const productDetails = async (req, res) => {
    try {
        const { productId } = req.params;
        const { userId } = req.query;

        // Fetch the product details by ID
        const product = await Product.findById(productId).populate('seller_id');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // console.log("User Id: "+userId)
        if (userId) {
            // Check if interaction already exists
            const existingInteraction = await Interaction.findOne({
              buyer_id: userId,
              product_id: product._id.toString()
            });
            
            // Only insert if no interaction exists
            if (!existingInteraction) {
              await Interaction.create({
                buyer_id: userId,
                product_id: product._id.toString(),
                interaction: 1  // Fixed reward value for this event type
              });
            }
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