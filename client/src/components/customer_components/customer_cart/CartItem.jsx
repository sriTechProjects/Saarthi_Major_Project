// import React from "react";

// const CartItem = ({ index, img, product_id, name, price, actualPrice, quantity }) => {
//   return (
//     <div className="flex items-center gap-3 border-b pb-3">
//       <img src={img} alt={name} className="w-14 h-14 rounded-md" />
//       <div className="flex-1">
//         <p className="text-sm font-semibold">{name}</p>
//         <p className="text-sm text-gray-500">
//           <span className="text-primary font-semibold">{price}</span>{" "}
//           <span className="line-through text-gray-400">{actualPrice}</span>
//         </p>
//         <div className="flex items-center gap-2 mt-1">
//           <button className="px-2 bg-gray-200 rounded">-</button>
//           <span>{quantity}</span>
//           <button className="px-2 bg-gray-200 rounded">+</button>
//           <button className="ml-auto text-red-500 text-sm">Remove</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartItem;


import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";

const CartItem = ({ img, product_id, name, price, actualPrice, quantity: initialQty, onQuantityChange, onDelete }) => {
  const { currentUser } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(initialQty);

  const updateQuantity = async (change) => {
    try {
      const newQuantity = quantity + change;
      await axios.patch(`http://localhost:8000/api/saarthi/cart/update/${currentUser._id}`, {
        productId: product_id,
        quantity: newQuantity,
      });
      setQuantity(newQuantity);
      if (onQuantityChange) onQuantityChange();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const removeItem = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/saarthi/cart/delete/${currentUser._id}/${product_id}`);
      if (onDelete) onDelete();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  useEffect(() => {
    setQuantity(initialQty);
  }, [initialQty]);

  return (
    <div className="flex items-center gap-3 border-b pb-3">
      <img src={img} alt={name} className="w-14 h-14 rounded-md" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-sm text-gray-500">
          <span className="text-primary font-semibold">₹{price}</span>{" "}
          <span className="line-through text-gray-400">₹{actualPrice}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          <button
            className="px-2 bg-gray-200 rounded"
            onClick={() => quantity > 1 ? updateQuantity(-1) : removeItem()}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            className="px-2 bg-gray-200 rounded"
            onClick={() => updateQuantity(1)}
          >
            +
          </button>
          <button className="ml-auto text-red-500 text-sm" onClick={removeItem}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};


export default CartItem;
