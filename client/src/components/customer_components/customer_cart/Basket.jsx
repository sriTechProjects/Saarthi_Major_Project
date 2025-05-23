// import React from "react";
// import { FaTimes } from "react-icons/fa"; // Close Icon
// import CartItem from "./CartItem";

// const Basket = ({ isOpen, onClose, cartItems, finalPrice }) => {
//   return (
//     <>
//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40"
//           onClick={onClose}
//         />
//       )}

//       {/* Basket Panel */}
//       <div
//         className={`fixed top-0 right-0 w-[25%] bg-white shadow-lg h-screen flex flex-col transform ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         } transition-transform duration-300 ease-in-out z-50`}
//       >
//         {/* Header */}
//         <div className="p-4 border-b flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Basket ({cartItems.length})</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-black">
//             <FaTimes size={20} />
//           </button>
//         </div>

//         {/* Cart Items - Scrollable */}
//         <div className="p-4 space-y-4 overflow-y-auto flex-1 hide-scrollbar">
//           {cartItems.length > 0 ? (
//             cartItems.map((item, index) => (
//               <CartItem
//                 key={index}
//                 index={index}
//                 img={item.img}
//                 product_id = {item.productId._id} 
//                 name={item.productId.name}
//                 price={item.productId.unit_price - (item.productId.discount * item.productId.unit_price) / 100}
//                 actualPrice={item.productId.unit_price}
//                 quantity={item.quantity}
//               />
//             ))
//           ) : (
//             <p className="text-center text-gray-500">Your cart is empty.</p>
//           )}
//         </div>

//         {/* Checkout Footer - Stays at the bottom */}
//         <div className="p-4 border-t flex justify-between items-center">
//           <p className="text-lg font-semibold">Total: {finalPrice}</p>
//           <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">
//             Checkout
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Basket;

import React, { useEffect, useState, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import CartItem from "./CartItem";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";

const Basket = ({ isOpen, onClose, onClick }) => {
  const { currentUser } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [finalPrice, setFinalPrice] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/saarthi/cart/${currentUser._id}`);
      const items = res.data.items;
      setCartItems(items);
      calculateTotal(items);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      const price = item.productId.unit_price - (item.productId.discount * item.productId.unit_price) / 100;
      return sum + price * item.quantity;
    }, 0);
    setFinalPrice(total.toFixed(2));
  };

  const handleQuantityChange = () => {
    fetchCart(); // Refresh both cart and total
  };

  const handleItemDelete = () => {
    fetchCart(); // Refresh both cart and total
  };

  useEffect(() => {
    if (isOpen) fetchCart();
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 right-0 w-[25%] bg-white shadow-lg h-screen flex flex-col transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Basket ({cartItems.length})</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1 hide-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <CartItem
                key={index}
                img={item.img}
                product_id={item.productId._id}
                name={item.productId.name}
                price={item.productId.unit_price - (item.productId.discount * item.productId.unit_price) / 100}
                actualPrice={item.productId.unit_price}
                quantity={item.quantity}
                onQuantityChange={handleQuantityChange}
                onDelete={handleItemDelete}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-lg font-semibold">Total: ₹{finalPrice}</p>
          <button onClick={()=>{
            onClose()
            onClick()
          }} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover">
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Basket;