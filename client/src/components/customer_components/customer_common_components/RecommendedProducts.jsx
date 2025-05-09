// import Mango from "https://deyga.in/cdn/shop/articles/mangoes-cover-1.jpg?v=1617118328"
// import Banana from "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2018/08/bananas-1354785_1920.jpg"
// import Cherry from "https://www.simplyrecipes.com/thmb/qM4OHyTEdSjpHbfhIJAk-fCWK6k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-How-Store-Recipes-LEAD-OPTION-04-0bf195d4fee44090a3b4b89b6cfbf3e0.jpg"


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
import toast from "react-hot-toast"

const RecommendedProducts = ({ product }) => {
  const navigate = useNavigate();

  const getImageUrl = (name) => {
    if(name == 'Mango') return "https://deyga.in/cdn/shop/articles/mangoes-cover-1.jpg?v=1617118328"
    else if(name == 'Banana') return "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2018/08/bananas-1354785_1920.jpg"
    else if(name == 'Cherries') return "https://www.simplyrecipes.com/thmb/qM4OHyTEdSjpHbfhIJAk-fCWK6k=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-How-Store-Recipes-LEAD-OPTION-04-0bf195d4fee44090a3b4b89b6cfbf3e0.jpg"
    else if(name == 'Apple') return "https://assets.clevelandclinic.org/transform/cd71f4bd-81d4-45d8-a450-74df78e4477a/Apples-184940975-770x533-1_jpg"
    else if(name == 'Orange') return "https://www.allrecipes.com/thmb/y_uvjwXWAuD6T0RxaS19jFvZyFU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1205638014-2000-d0fbf9170f2d43eeb046f56eec65319c.jpg"
    else if(name=='Grapes') return "https://images.indianexpress.com/2021/02/grapes-1200.jpg"
    else if(name=='Guavas') return "https://www.health.com/thmb/XlWTD8TZF5574DVtMEfD-XSj5Lg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Guava-15d1050d22034909bfca038ef1f8aaa2.jpg"
    else if(name == 'Red Grapes') return "https://img.livestrong.com/-/clsd/getty/82965f93904649bba70ac8577b9335b5.jpg"
    else return "https://deyga.in/cdn/shop/articles/mangoes-cover-1.jpg?v=1617118328"
  }
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
        toast.success("Product added to cart!");
      } else {
        toast.error("Failed to add to cart.");
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
        src={getImageUrl(product.name)}
        alt={product.title}
        className="w-full h-32 object-cover rounded-md"
      />
      <span className="flex items-start justify-between mt-2">
        <h3 className="text-md font-semibold">{product.name}</h3>
        <ProductRatings rating={product.ratings} />
      </span>
      <div className="items-center flex gap-x-2">
        <p className="text-base font-semibold text-primary">
          ₹ {(product.unit_price - (product.discount * product.unit_price) / 100).toFixed(2)}
        </p>
        <p className="text-sm text-gray-400 line-through">₹ {(product.unit_price.toFixed(2))}</p>
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
