const axios = require("axios");
const Interaction = require("../../models/interaction"); // adjust path as needed
const Product = require("../../models/products");
const Buyer = require("../../models/buyer");

const getRecommendations = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Interactions now use string IDs
    const interactions = await Interaction.find({ buyer_id: userId });
    console.log("Interactions Preview:", JSON.stringify(interactions, null, 2));

    const products = await Product.find({}, { _id: 1, name: 1, category: 1, unit_price: 1 });


    const buyer = await Buyer.findById(userId);
    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }

    if (!interactions.length || !products.length) {
      return res.status(400).json({ error: "Insufficient data to generate recommendations" });
    }

    const buyers = [
      {
        _id: buyer._id.toString(),
        name: buyer.name || "Anonymous",
      },
    ];

    const formattedProducts = products.map((product) => ({
        _id: product._id.toString(),
        name: product.name,
        category: product.category,
        unit_price: product.unit_price || 0  // fallback if missing
      }));
      

    const formattedInteractions = interactions.map((interaction) => ({
      buyer_id: interaction.buyer_id, // already a string
      product_id: interaction.product_id, // already a string
      action: interaction.interaction || 1, // fallback if `interaction` not present
    }));

    const payload = {
      buyer_id: userId,
      buyers,
      products: formattedProducts,
      interactions: formattedInteractions,
    };

    console.log("Payload Preview:", JSON.stringify(payload, null, 2));

    const flaskRes = await axios.post("http://localhost:5000/recommend", payload);

    // res.status(200).json({ recommendations: flaskRes.data.recommendations });
            // After receiving recommendations from Flask
    const recommendations = flaskRes.data.recommendations;

    // Extract product IDs from the Flask recommendations
    const recommendedProductIds = recommendations.map(rec => rec.product_id);

    // Fetch the full product details from MongoDB for those IDs
    const recommendedProducts = await Product.find({
      _id: { $in: recommendedProductIds }
    });

    // Create a map for quick lookup
    const productMap = new Map();
    recommendedProducts.forEach(product => {
      productMap.set(product._id.toString(), product.toObject());
    });

    // Merge full product details into each recommendation
    const enrichedRecommendations = recommendations.map(rec => ({
      ...rec,
      ...productMap.get(rec.product_id)
    }));

    // Return the enriched list
    res.status(200).json({ recommendations: enrichedRecommendations });

  } catch (error) {
    console.error("Flask Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Internal Server Error" });
  }
};

module.exports = { getRecommendations };
