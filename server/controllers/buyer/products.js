const Product = require("../../models/products");
const Interaction = require('../../models/interaction');

const getProducts = async (req, res) => {
    try {
        const { category } = req.params;
        console.log(category);

        // Get all products in the category
        const products = await Product.find({ category }).populate('seller_id');
        console.log(products[0].seller_id.shopAddress.city)
        res.status(200).json({ 
            success: true, 
            data: products,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching products', 
            error 
        });
    }
};

const getCategoryProductsWithFilters = async (req, res) => {
    try {
        const { category } = req.params;
        const { city, minRating, minDiscount, minPrice, maxPrice } = req.query;

        const productFilter = { category };

        if (minRating) productFilter.ratings = { $gte: parseFloat(minRating) };
        if (minDiscount) productFilter.discount = { $gte: parseFloat(minDiscount) };

        if (minPrice || maxPrice) {
            productFilter.unit_price = {};
            if (minPrice) productFilter.unit_price.$gte = parseFloat(minPrice);
            if (maxPrice) productFilter.unit_price.$lte = parseFloat(maxPrice);
        }

        // Fetch products with seller populated
        let products = await Product.find(productFilter).populate('seller_id');

        // Filter by city inside shopAddress
        if (city) {
            products = products.filter(p =>
                p.seller_id?.shopAddress?.city?.toLowerCase() === city.toLowerCase()
            );
        }

        // Min/Max price for full category (unfiltered)
        const priceStats = await Product.aggregate([
            { $match: { category } },
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$unit_price" },
                    maxPrice: { $max: "$unit_price" }
                }
            }
        ]);

        const overallMinPrice = priceStats[0]?.minPrice || 0;
        const overallMaxPrice = priceStats[0]?.maxPrice || 0;

        res.status(200).json({
            success: true,
            data: products,
            minPrice: overallMinPrice,
            maxPrice: overallMaxPrice
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching filtered category products',
            error
        });
    }
};

const logInteraction = async (req, res) => {
    try {
        const { buyer_id, product_id } = req.body;

        if (!buyer_id || !product_id) {
            return res.status(400).json({ success: false, message: 'buyer_id and product_id are required' });
        }
        const interaction = new Interaction({ buyer_id, product_id });
        await interaction.save();

        res.status(201).json({ success: true, message: 'Interaction logged successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error logging interaction', error });
    }
};

const getProductDetails = async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId).populate('seller_id');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching product details', error });
    }
};


module.exports = {getProducts, getCategoryProductsWithFilters, logInteraction, getProductDetails};