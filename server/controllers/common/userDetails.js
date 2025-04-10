const asyncHandler = require("express-async-handler");
const Buyer = require("../../models/buyer");
const Seller = require("../../models/seller");

const GetUserDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "User ID is required",
            success: false,
        });
    }

    try {
        const buyer = await Buyer.findById(id);
        const seller = await Seller.findById(id);

        const user = buyer || seller;

        if (!user) {
            return res.status(404).json({
                message: "User does not exist",
                success: false,
            });
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            userInfo: user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching user details",
            success: false,
        });
    }
});

module.exports = { GetUserDetails };
