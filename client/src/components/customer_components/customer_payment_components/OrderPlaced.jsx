import { useEffect } from "react";
import Success from "../../../assets/images/success.gif";

const OrderPlaced = ({ setIsOrderPlaced }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOrderPlaced(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup
  }, [setIsOrderPlaced]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-auto p-4">
      <div className="bg-white rounded-2xl shadow-md p-10 flex items-center flex-col relative">
        <img src={Success} alt="Order Success" height={200} width={200} />
        <h1 className="font-medium text-primary-txt mt-4">
          Order Placed Successfully!
        </h1>
      </div>
    </div>
  );
};

export default OrderPlaced;
