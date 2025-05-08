import {
  FaShoppingCart,
  FaBolt,
  FaStore,
  FaLocationDot,
  FaClock,
} from "../../utils/resource/IconsProvider.util";
// import ProductImage from "../../assets/images/google.png"

import { ProductRatings } from "../../utils/resource/ComponentsProvider.util";
import RecommendedProducts from "../../components/customer_components/customer_common_components/RecommendedProducts";

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

const CustomerProductPage = () => {
  const [productDetails, setproductDetails] = useState({});
  const [sellerDetails, setSellerDetails] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [shopAddress, setShopAddress] = useState({})
  const { category, product_id } = useParams();
  const { currentUser } = useContext(AuthContext);

  const productImage = `../../assets/images/google.png`

  useEffect(() => {
    const fetchproductDetails = async () => {
      try {
        console.log(
          `Fetching product for category: ${category}, ID: ${product_id}, UserID: ${currentUser._id}`
        );
        const response = await axios.get(
          `http://localhost:8000/api/saarthi/products/${category}/${product_id}?userId=${currentUser._id}`
        );

        if (response.data.data) {
          console.log("Product data1:", response.data.data);
          console.log(`Seller details: ${response.data.data.seller_id.shopName}`)
          setproductDetails(response.data.data);
          setSellerDetails(response.data.data.seller_id);
          setShopAddress(response.data.data.seller_id.shopAddress);
        } else {
          setproductDetails({});
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setproductDetails({});
        setRecommendations([]);
      }
    };

    if (category && product_id) {
      fetchproductDetails();
    }
  }, []);

  return (
    <>
      {/* Product Section */}
      <div className="py-5 px-[7vw] flex flex-col gap-y-4 lg:flex-row lg:gap-x-8">
        {/* Image Section */}
        <div className="image-container lg:px-4 w-full lg:w-1/2 flex flex-col gap-3">
          <div className="upper w-full h-[55vh] bg-white rounded-md shadow-sm overflow-hidden">
            <img
              src={"https://deyga.in/cdn/shop/articles/mangoes-cover-1.jpg?v=1617118328"}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="lower flex gap-x-3">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white w-1/3 h-32 rounded-md shadow-sm overflow-hidden"
                >
                  <img
                    src={"https://deyga.in/cdn/shop/articles/mangoes-cover-1.jpg?v=1617118328"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="description-container px-7 py-8 bg-white w-full lg:w-1/2 rounded-md shadow-sm flex flex-col gap-y-4">
          <h1 className="font-bold text-3xl text-primary-txt">
            {productDetails.name}
          </h1>
          <p className="text-sm text-[#666]">{productDetails.description}</p>

          <ProductRatings rating={productDetails.ratings} />

          <div className="flex justify-between items-center">
            <div className="items-center gap-x-2">
              <p className="text-2xl font-semibold text-primary">
                Rs. {productDetails.unit_price - (productDetails.discount * productDetails.unit_price)/100} {" "}
                <span className="text-xs text-[#8b8b8b] font-normal ml-2">
                  ( including all taxes )
                </span>
              </p>
              <p className="text-sm text-gray-400 line-through">Rs. {productDetails.unit_price} per {productDetails.unit_type}</p>
            </div>

            <div>
              <h3 className="text-[0.9rem] font-medium text-primary text-right mb-2">
                Quantity
              </h3>
              <select
                name=""
                id=""
                className="text-sm border p-1 rounded-md outline-none"
              >
                <option value="">Select qty</option>
                <option value="">50g</option>
                <option value="">100g</option>
                <option value="">200g</option>
                <option value="">500g</option>
                <option value="">1kg</option>
              </select>
            </div>
          </div>

          <hr />

          <div>
            <h3 className="text-primary font-medium mb-2">Details</h3>
            <div className="py-3 flex flex-col gap-y-4 md:flex-row md:items-center">
              {/* shop name */}
              <div className="flex md:w-1/3 items-center gap-x-4">
                <div className="border border-[#8b8b8b] p-4 md:p-3 text-xl md:text-lg text-[#8b8b8b] rounded-md">
                  <FaStore />
                </div>
                <div>
                  <p className="text-[0.8rem] md:text-xs font-semibold text-primary-txt">
                    Shop Name
                  </p>
                  <p className="text-[1rem] md:text-sm font-medium text-[#8b8b8b]">
                    {sellerDetails.shopName}
                  </p>
                </div>
              </div>

              {/* location */}
              <div className="flex md:w-1/3 items-center gap-x-4">
                <div className="border border-[#8b8b8b] p-4 md:p-3 text-xl md:text-lg text-[#8b8b8b] rounded-md">
                  <FaLocationDot />
                </div>
                <div>
                  <p className="text-[0.8rem] md:text-xs font-semibold text-primary-txt">
                    Location
                  </p>
                  <p className="text-[1rem] md:text-sm font-medium text-[#8b8b8b]">
                    {shopAddress.city}, {shopAddress.state} - {shopAddress.zip}
                  </p>
                </div>
              </div>

              {/* delivery time */}
              <div className="flex md:w-1/3 items-center gap-x-4">
                <div className="border border-[#8b8b8b] p-4 md:p-3 text-xl md:text-lg text-[#8b8b8b] rounded-md">
                  <FaClock />
                </div>
                <div>
                  <p className="text-[0.8rem] md:text-xs font-semibold text-primary-txt">
                    Delivery Time
                  </p>
                  <p className="text-[1rem] md:text-sm font-medium text-[#8b8b8b]">
                    8min
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-y-4">
            <button className="text-primary-txt border border-[#333] py-3 px-6 rounded-md flex items-center justify-center gap-2 transition">
              <FaShoppingCart /> Add to Cart
            </button>
            <button className="bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 transition">
              <FaBolt /> Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      <div className="px-[7vw] py-8">
        <h2 className="text-3xl font-semibold mb-3 text-primary-txt">
          Recommended Products
        </h2>
        <div className="flex overflow-x-auto gap-4 py-3 scrollbar-hide">
          {productDetails.length > 0 ? (
            productDetails.map((product) => (
              <RecommendedProducts key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500">Loading recommendations...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerProductPage;
