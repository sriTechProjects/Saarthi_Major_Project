import React from "react";
import { useState } from "react";

//asstes import
import images from "../../../utils/resource/ImageProvider.util";

// react icons import
import { FaStore, FaBasketShopping, RxHamburgerMenu, RxCross1, FaUser } from '../../../utils/resource/IconsProvider.util'

import { HeaderNavIcons, SolidButton } from '../../../utils/resource/ComponentsProvider.util'

const HeaderComponent = () => {
  // Use state to manage the visibility of the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to open the menu
  const openMenu = () => {
    setIsMenuOpen(true);
  };

  // Function to close the menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <a href="">
        <img src={images.logo} alt="saarthi logo" className="w-[25vh]" />
      </a>
      <div>
        <div className="items-center justify-between gap-8 hidden md:flex">
          <HeaderNavIcons icon={<FaStore/>} item="Become a seller" indicator={false} indicatorValue={0}/>
          
          <HeaderNavIcons icon={<FaBasketShopping/>} item="Basket" indicator={true} indicatorValue={2}/>

          <SolidButton containsIcon={true} icon={<FaUser/>} onClick={""} text="Login" />
        </div>

        {/* Use onClick to call openMenu function */}
        <button
          onClick={openMenu}
          className="flex md:hidden text-3xl text-[#333]"
        >
          <RxHamburgerMenu />
        </button>
      </div>

      {/* Conditionally render the menu based on isMenuOpen state */}
      {isMenuOpen && (
        <div
          className="w-screen h-screen bg-[#000] absolute top-0 left-0 flex text-white p-10 justify-center items-center"
          id="menu"
        >
          {/* Use onClick to call closeMenu function */}
          <button className="absolute top-10 right-12" onClick={closeMenu}>
            <RxCross1 className="text-white text-2xl" />
          </button>
          <div className="flex flex-col gap-20 w-full">
            <a
              href="#"
              className="w-full text-center font-semibold text-xl flex items-center gap-6 justify-center"
            >
              <FaStore className="text-[1.1rem] flex items-center gap-6" />
              Become a Seller
            </a>
            <a
              href="#"
              className="w-full text-center font-semibold text-xl flex items-center gap-6 justify-center"
            >
              <FaBasketShopping className="text-xl" />
              Visit Basket
            </a>

            <a className="flex items-center justify-center gap-3 bg-[#fff] text-[#333] py-4 px-10 rounded-lg font-bold text-[1.09rem] cursor-pointer">
              <FaUser/>
              Login
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderComponent;
