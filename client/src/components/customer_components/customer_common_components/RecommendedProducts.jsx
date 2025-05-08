// import PropTypes from "prop-types";
// import { ProductRatings } from "../../../utils/resource/ComponentsProvider.util";
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';

// const RecommendedProducts = ({ product }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate(`/product/${product.category}/${product._id}`); // Adjust this according to your routing structure
//   };

//   return (
//     <div
//       className="w-[250px] h-fit bg-white rounded-lg shadow-card overflow-hidden p-3 flex flex-col gap-y-1 cursor-pointer hover:shadow-lg transition"
//       onClick={handleClick}
//     >
//       <img
//         src={product.images[0]}
//         alt={product.title}
//         className="w-full h-32 object-cover rounded-md"
//       />
//       <span className="flex items-start justify-between mt-2">
//         <h3 className="text-md font-semibold">{product.name}</h3>
//         <ProductRatings rating={product.ratings} />
//       </span>
//       <div className="items-center flex gap-x-2">
//         <p className="text-base font-semibold text-primary">₹ {product.unit_price - (product.discount * product.unit_price)/100}</p>
//         <p className="text-sm text-gray-400 line-through">₹ {product.unit_price}</p>
//         <span className="text-sm text-gray-400 ">({product.discount}%)</span>
//       </div>
//       <button
//         onClick={(e) => {
//           e.stopPropagation(); // Prevent card click from triggering
//           // your add-to-cart logic here
//         }}
//         className="mt-2 bg-primary hover:bg-primary-hover text-sm font-semibold text-white py-2 px-4 rounded-md w-full transition"
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// };


// RecommendedProducts.propTypes = {
//   product: PropTypes.shape({
//     id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     img: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     price: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//       .isRequired,
//     rating: PropTypes.number.isRequired,
//   }).isRequired,
// };

// export default RecommendedProducts;

import PropTypes from "prop-types";
import { ProductRatings } from "../../../utils/resource/ComponentsProvider.util";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { useContext } from "react";
import axios from "axios";

const RecommendedProducts = ({ product }) => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const handleClick = () => {
    navigate(`/product/${product.category}/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click

    const buyerId = currentUser._id; 

    try {
      const res = await axios.post("http://localhost:8000/api/saarthi/cart/add", {
        buyerId,
        productId: product._id,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Product added to cart!");
      } else {
        alert("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
      alert("Error adding to cart.");
    }
  };

  return (
    <div
      className="w-[250px] h-fit bg-white rounded-lg shadow-card overflow-hidden p-3 flex flex-col gap-y-1 cursor-pointer hover:shadow-lg transition"
      onClick={handleClick}
    >
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-full h-32 object-cover rounded-md"
      />
      <span className="flex items-start justify-between mt-2">
        <h3 className="text-md font-semibold">{product.name}</h3>
        <ProductRatings rating={product.ratings} />
      </span>
      <div className="items-center flex gap-x-2">
        <p className="text-base font-semibold text-primary">
          ₹ {product.unit_price - (product.discount * product.unit_price) / 100}
        </p>
        <p className="text-sm text-gray-400 line-through">₹ {product.unit_price}</p>
        <span className="text-sm text-gray-400 ">({product.discount}%)</span>
      </div>
      <button
        onClick={handleAddToCart}
        className="mt-2 bg-primary hover:bg-primary-hover text-sm font-semibold text-white py-2 px-4 rounded-md w-full transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

RecommendedProducts.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    images: PropTypes.array.isRequired,
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    unit_price: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    ratings: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default RecommendedProducts;
