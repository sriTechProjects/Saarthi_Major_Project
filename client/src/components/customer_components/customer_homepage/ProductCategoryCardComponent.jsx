import React from "react";
import {Link} from "react-router-dom"

const ProductCategoryCardComponent = ({ title, image }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-w-[8rem] min-h-[8.4rem] rounded-lg bg-[#ececec68] transition-all duration-300 ease-in-out cursor-pointer text-center shadow-sm hover:bg-gradient-to-r from-[#abecd6] to-[#fbed96] hover:shadow-md">
      <div className="w-[3.5rem] flex justify-center">
        <img src={image} alt="fruit icon" className="w-full" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#4d4d4d] mt-1">
          <Link to={`/product-list/${title.toLowerCase()}`}>{title}</Link>
        </h3>
      </div>
    </div>
  );
};

export default ProductCategoryCardComponent;
