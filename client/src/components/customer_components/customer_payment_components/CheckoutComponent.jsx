import { useState, useEffect, useContext } from "react";
import SelectPaymentMethod from "./SelectPaymentMethod";
import { FaLocationDot } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";
import SelectOrderAddress from "./SelectOrderAddress";
import OrderSummary from "./OrderSummary";
import { AuthContext } from "../../../contexts/AuthContext";
import axios from "axios";

const CheckoutComponent = ({
  setIsCheckoutOpen,
  setIsOrderPlaced,
  cartItemsState,
}) => {
  const [step, setStep] = useState(1);
  const [totalPayable, setTotalPayable] = useState(0);
  const [checkoutData, setCheckoutData] = useState({
    address: null,
    payment: null,
  });
  const { currentUser } = useContext(AuthContext);

  // // Move to step 2 after address is selected
  // useEffect(() => {
  //   if (checkoutData.address && step === 1) {
  //     setStep(2);
  //   }
  // }, [checkoutData.address]);

  // // Move to step 3 after payment method is selected
  // useEffect(() => {
  //   if (checkoutData.payment && step === 2) {
  //     setStep(3);
  //   }
  // }, [checkoutData.payment]);

  const handleAddressComplete = (data) => {
    console.log("Inside handleAddressComplete, received:", data);
    setCheckoutData((prev) => ({ ...prev, address: data }));
  };

  const handlePaymentComplete = (data) => {
    console.log("Inside handlePaymentComplete, received:", data);
    setCheckoutData((prev) => ({ ...prev, payment: data }));
  };
  console.log(cartItemsState);
  const stepTitles = ["Address", "Summary", "Payment Method"];
  const icons = [<FaLocationDot />, <IoBagCheckOutline />, <MdPayments />];

  const handleCheckOut = async () => {
  // e.preventDefault();
  try {
    const payload = {
      checkoutData: checkoutData,
      cartItems: cartItemsState,  // Assuming each item has _id, quantity, and price
      buyerId: currentUser._id, // Adjust if buyerId is stored elsewhere
      totalPayable: totalPayable,
    };

    const response = await axios.post("http://localhost:8000/api/saarthi/cart/checkout", payload);
    console.log("Checkout data sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending checkout data:", error);
  }
};


  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleCheckOut();
      setIsCheckoutOpen(false);
      setIsOrderPlaced(true);
    }
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-4xl relative">
        {/* Step Indicator Navigation */}
        <nav className="w-full flex justify-center mb-6">
          <div className="px-3 py-2 flex items-center gap-x-4">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex items-center gap-x-2">
                <span
                  className={`border-2 p-2 text-lg rounded-full ${
                    step === index + 1
                      ? "border-sky text-sky bg-sky-op"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {icons[index]}
                </span>
                <p
                  className={`${
                    step === index + 1
                      ? "text-sky font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {title}
                </p>
                {index !== stepTitles.length - 1 && (
                  <div className="border border-gray-300 w-14 sm:w-24"></div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Step Content */}
        {step === 1 && (
          <SelectOrderAddress handleAddressComplete={handleAddressComplete} />
        )}
        {step === 2 && (
          <OrderSummary
            cartItemsState={cartItemsState}
            setTotalPayable={setTotalPayable}
          />
        )}
        {step === 3 && (
          <SelectPaymentMethod
            totalPayable={totalPayable}
            handlePaymentComplete={handlePaymentComplete}
          />
        )}

        {/* Step Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={step === 1}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              step === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-sky text-white rounded-md hover:bg-sky-dark text-sm"
          >
            {step === 3 ? "Place Order" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;
