// import PropTypes from "prop-types";
// import { useContext, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";

// // Assets import
// import images from "../../../utils/resource/ImageProvider.util";

// // React icons import
// import {
//   FaStore,
//   FaBasketShopping,
//   RxHamburgerMenu,
//   RxCross1,
//   FaUser,
// } from "../../../utils/resource/IconsProvider.util";

// import {
//   HeaderNavIcons,
//   SolidButton,
// } from "../../../utils/resource/ComponentsProvider.util";

// import ProfileDropDown from "./ProfileDropDown";
// import { AuthContext } from "../../../contexts/AuthContext";

// const HeaderComponent = ({ toggleBasket }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const { currentUser, loading, fetchUser, refreshLoginContext } =
//     useContext(AuthContext);
//   const navigate = useNavigate();

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
//   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

//   const handleLogout = () => {
//     // setUser(null); // Clear user from context
//     setIsDropdownOpen(false);
//     navigate("/auth/login");
//   };

//   return (
//     <>
//       <Link to="/">
//         <img src={images.logo} alt="saarthi logo" className="w-[25vh]" />
//       </Link>
//       <div>
//         <div className="items-center justify-between gap-8 hidden md:flex">
//           <HeaderNavIcons
//             icon={<FaStore />}
//             item="Become a seller"
//             indicator={false}
//             indicatorValue={0}
//           />
//           <button onClick={toggleBasket}>
//             <HeaderNavIcons
//               icon={<FaBasketShopping />}
//               item="Basket"
//               indicator={true}
//               indicatorValue={2}
//             />
//           </button>

//           {currentUser ? (
//             <ProfileDropDown
//               toggleDropdown={toggleDropdown}
//               user={currentUser}
//               handleLogout={handleLogout}
//               isDropdownOpen={isDropdownOpen}
//             />
//           ) : (
//             <SolidButton
//               containsIcon={true}
//               icon={<FaUser />}
//               onClick={() => navigate("/auth/login")}
//               text="Login"
//             />
//           )}
//         </div>

//         <button
//           onClick={toggleMenu}
//           className="flex md:hidden text-3xl text-[#333]"
//         >
//           <RxHamburgerMenu />
//         </button>
//       </div>

//       {isMenuOpen && (
//         <div className="w-screen h-screen bg-[#000] absolute top-0 left-0 flex text-white p-10 justify-center items-center">
//           <button className="absolute top-10 right-12" onClick={toggleMenu}>
//             <RxCross1 className="text-white text-2xl" />
//           </button>
//           <div className="flex flex-col gap-20 w-full">
//             <Link
//               to="/auth/seller-registration"
//               className="w-full text-center font-semibold text-xl flex items-center gap-6 justify-center"
//             >
//               <FaStore className="text-[1.1rem]" /> Become a Seller
//             </Link>
//             <Link
//               to="#"
//               className="w-full text-center font-semibold text-xl flex items-center gap-6 justify-center"
//             >
//               <FaBasketShopping className="text-xl" /> Visit Basket
//             </Link>
//             {currentUser ? (
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center justify-center gap-3 bg-[#fff] text-[#333] py-4 px-10 rounded-lg font-bold text-[1.09rem] cursor-pointer"
//               >
//                 Logout
//               </button>
//             ) : (
//               <button
//                 onClick={() => navigate("/auth/signin")}
//                 className="flex items-center justify-center gap-3 bg-[#fff] text-[#333] py-4 px-10 rounded-lg font-bold text-[1.09rem] cursor-pointer"
//               >
//                 <FaUser /> Login
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// HeaderComponent.propTypes = {
//   toggleBasket: PropTypes.func.isRequired,
// };

// export default HeaderComponent;


import PropTypes from "prop-types";
import { useContext, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

// Assets import
import images from "../../../utils/resource/ImageProvider.util";

// React icons import
import {
  FaStore,
  FaBasketShopping,
  RxHamburgerMenu,
  RxCross1,
  FaUser,
} from "../../../utils/resource/IconsProvider.util";

import {
  HeaderNavIcons,
  SolidButton,
} from "../../../utils/resource/ComponentsProvider.util";

import ProfileDropDown from "./ProfileDropDown";
import { AuthContext } from "../../../contexts/AuthContext";

const HeaderComponent = ({ toggleBasket, cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("Cart Items: "+cartItemCount)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = useCallback(() => {
    setIsDropdownOpen(false);
    navigate("/auth/login");
  }, [navigate]);

  return (
    <>
      <Link to="/">
        <img src={images.logo} alt="saarthi logo" className="w-[25vh]" />
      </Link>

      <div>
        <div className="items-center justify-between gap-8 hidden md:flex">
          <HeaderNavIcons
            icon={<FaStore />}
            item="Become a seller"
            indicator={false}
            indicatorValue={0}
          />
          <button onClick={toggleBasket}>
            <HeaderNavIcons
              icon={<FaBasketShopping />}
              item="Basket"
              indicator={true}
              indicatorValue={cartItemCount}
            />
          </button>

          {currentUser ? (
            <ProfileDropDown
              toggleDropdown={toggleDropdown}
              user={currentUser}
              handleLogout={handleLogout}
              isDropdownOpen={isDropdownOpen}
            />
          ) : (
            <SolidButton
              containsIcon={true}
              icon={<FaUser />}
              onClick={() => navigate("/auth/login")}
              text="Login"
            />
          )}
        </div>

        <button
          onClick={toggleMenu}
          className="flex md:hidden text-3xl text-[#333]"
        >
          <RxHamburgerMenu />
        </button>
      </div>

      {isMenuOpen && (
        <div className="w-screen h-screen bg-[#000] absolute top-0 left-0 flex text-white p-10 justify-center items-center">
          <button className="absolute top-10 right-12" onClick={toggleMenu}>
            <RxCross1 className="text-white text-2xl" />
          </button>
          <div className="flex flex-col gap-20 w-full">
            <Link
              to="/auth/seller-registration"
              className="w-full text-center font-semibold text-xl flex items-center gap-6 justify-center"
            >
              <FaStore className="text-[1.1rem]" /> Become a Seller
            </Link>
            <button
              onClick={() => {
                toggleBasket();
                toggleMenu();
              }}
              className="w-full text-center font-semibold text-xl flex items-center gap-6 justify-center"
            >
              <FaBasketShopping className="text-xl" /> Visit Basket
            </button>
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 bg-[#fff] text-[#333] py-4 px-10 rounded-lg font-bold text-[1.09rem] cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth/login")}
                className="flex items-center justify-center gap-3 bg-[#fff] text-[#333] py-4 px-10 rounded-lg font-bold text-[1.09rem] cursor-pointer"
              >
                <FaUser /> Login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

HeaderComponent.propTypes = {
  toggleBasket: PropTypes.func.isRequired,
  cartItemCount: PropTypes.number.isRequired,
};

export default HeaderComponent;
