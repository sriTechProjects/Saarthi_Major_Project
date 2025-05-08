// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import {
//   HeaderComponent,
//   FooterComponent,
// } from "../utils/resource/ComponentsProvider.util";
// import Basket from "../components/customer_components/customer_cart/Basket";
// import { cartItems } from "../utils/resource/DataProvider.util";

// const CustomerLayout = () => {
//   const [isBasketOpen, setIsBasketOpen] = useState(false);
//   return (
//     <div className="bg-[#efefef]">
//       {/* Header Section */}
//       <header
//         id="header"
//         className="h-[11vh] w-full bg-white flex items-center justify-between px-[7vw] relative"
//       >
//         <HeaderComponent
//           toggleBasket={() => {
//             setIsBasketOpen(!isBasketOpen);
//           }}
//         />
//       </header>

//       <main>{<Outlet />}</main>

//       {/* footer section */}
//       <footer className="w-full h-fit bg-black px-[7vw] py-[7vh]">
//         <FooterComponent />
//       </footer>

//       <Basket
//         isOpen={isBasketOpen}
//         onClose={() => setIsBasketOpen(false)}
//         cartItems={cartItems}
//         finalPrice="Rs. 500"
//       />
//     </div>
//   );
// };

// export default CustomerLayout;

import { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import {
  HeaderComponent,
  FooterComponent,
} from "../utils/resource/ComponentsProvider.util";
import Basket from "../components/customer_components/customer_cart/Basket";
import { cartItems } from "../utils/resource/DataProvider.util";
import { AuthContext } from "../contexts/AuthContext";
import CheckoutComponent from "../components/customer_components/customer_payment_components/CheckoutComponent.jsx"
import OrderPlaced from "../components/customer_components/customer_payment_components/OrderPlaced.jsx";

const CustomerLayout = () => {
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [cartItemsState, setCartItemsState] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser?._id) return;

      try {
        const res = await axios.get(
          `http://localhost:8000/api/saarthi/cart/${currentUser._id}`
        );
        // console.log(res.data)
        setCartItemsState(res.data.items);
      } catch (err) {
        console.error("Error fetching cart items:", err);
      }
    };

    fetchCartItems();
  }, [currentUser]);
  const finalPrice = cartItemsState.reduce(
    (total, item) => total + item.productId.unit_price - (item.productId.discount * item.productId.unit_price) / 100 * item.quantity,
    0
  );
  console.log(finalPrice)

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false)
  console.log(isCheckoutOpen);
  return (
    <div className="bg-[#efefef]">
      <header
        id="header"
        className="h-[11vh] w-full bg-white flex items-center justify-between px-[7vw] relative"
      >
        <HeaderComponent
          toggleBasket={() => {
            setIsBasketOpen(!isBasketOpen);
          }}
          cartItemCount={cartItemsState.length}
        />
      </header>

      <main>{<Outlet />}</main>

      <footer className="w-full h-fit bg-black px-[7vw] py-[7vh]">
        <FooterComponent />
      </footer>

      <Basket
        isOpen={isBasketOpen}
        onClose={() => setIsBasketOpen(false)}
        cartItems={cartItemsState} 
        finalPrice={finalPrice}
        onClick={()=> setIsCheckoutOpen(true)}
      />

      {
        isCheckoutOpen && (
          <CheckoutComponent setIsCheckoutOpen={setIsCheckoutOpen} setIsOrderPlaced={setIsOrderPlaced} cartItemsState={cartItemsState}/>
        )
      }

      {
        isOrderPlaced && (
          <OrderPlaced setIsOrderPlaced={setIsOrderPlaced}/>
        )
      }
    </div>
  );
};

export default CustomerLayout;
