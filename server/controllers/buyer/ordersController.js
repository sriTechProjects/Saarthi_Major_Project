const Order = require('../../models/orders')
const Buyer = require('../../models/buyer');
const Product = require('../../models/products');

const getOrderById = async (req, res) => {
    const customer_id = req.params.customer_id;
    try {
        const customer = await Buyer.findOne({ _id: customer_id });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found!" });
        }


        // Fetch all orders for the customer
        const orders = await Order.find({ buyerId: customer_id }).lean(); // .lean() returns plain JS objects

        // For each order, populate product name in items
        for (let order of orders) {
            for (let item of order.items) {
                const product = await Product.findById(item.productId).select("name");
                item.productName = product ? product.name : "Unknown Product";
            }
        }

        return res.status(201).json({ orders });

    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getOrderById };