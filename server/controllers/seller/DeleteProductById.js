    const asyncHandler = require("express-async-handler");
    const Product = require('../../models/products')

    const deleteProduct = asyncHandler(async (req, res) => {
        try {
            const {product_id} = req.params;
            console.log(`Product id: ${product_id}`);
            const product = await Product.findOne({_id: product_id});
            console.log(`Product detail: ${product}`);
            if (!product) {
                return res.status(404).json({ message: 'Product Not found!' });
            }
        
            await Product.deleteOne({_id: product_id}); 
            return res.status(200).json({ message: 'Product Deleted!' });
        }catch(error){
            res.status(501).json({ message: 'Internal Server Error' });
        }
    });


    module.exports = {deleteProduct};