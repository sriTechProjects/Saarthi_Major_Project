import { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const SelectPaymentMethod = ({ totalPayable, handlePaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("amk.bhk@oksbi");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    cardNumber: "",
    validTill: "",
    cvv: "",
  });
  const amount = (totalPayable).toFixed(2);
  useEffect(() => {
    handlePaymentComplete({selectedMethod, totalPayable});
  }, [selectedMethod]);
  // console.log(amount);
  const renderForm = () => {
    switch (selectedMethod) {
      case "UPI":
        return (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Pay ₹{amount}
            </button>
          </div>
        );
      case "QR":
        return (
          <div className="space-y-3">
            <p className="text-gray-700">Scan the QR code to pay ₹{amount}</p>
            <div
              style={{
                background: "white",
                padding: "16px",
                display: "inline-block",
              }}
            >
              <QRCode
                value={`upi://pay?pa=${upiId}&pn=YourName&am=${amount}`}
                size={160}
              />
            </div>
          </div>
        );
      case "CARD":
        return (
          <>
            <h2 className="mb-3">Card Details</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name on card"
                value={cardDetails.name}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, name: e.target.value })
                }
                className="border p-2 w-full rounded text-sm"
              />
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cardNumber: e.target.value })
                }
                className="border p-2 w-full rounded text-sm"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Valid Till (MM/YY)"
                  value={cardDetails.validTill}
                  onChange={(e) =>
                    setCardDetails({
                      ...cardDetails,
                      validTill: e.target.value,
                    })
                  }
                  className="border p-2 w-full rounded text-sm"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  maxLength={3}
                  onChange={(e) =>
                    setCardDetails({ ...cardDetails, cvv: e.target.value })
                  }
                  className="border p-2 w-full rounded text-sm"
                />
              </div>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Pay ₹{amount}
              </button>
            </div>
          </>
        );
      case "COD":
        return (
          <div className="space-y-3">
            <p className="text-gray-700">
              You will pay ₹{amount} in cash upon delivery.
            </p>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Confirm COD
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 w-full max-w-4xl border rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-sky">
        Select Payment Method
      </h2>
      <div className="flex gap-6">
        {/* Left Tab - Payment Options */}
        <div className="w-[35%] flex flex-col gap-3 border-r pr-4">
          {["UPI", "QR", "CARD", "COD"].map((method) => (
            <button
              key={method}
              onClick={() => {
                setSelectedMethod(method);
                // handlePaymentComplete({ method, totalPayable });
              }}
              className={`p-3 text-left border rounded-md ${
                selectedMethod === method
                  ? "bg-sky-100 border-sky text-sky-700 font-medium"
                  : "hover:bg-gray-50"
              }`}
            >
              {method === "UPI" && "UPI"}
              {method === "QR" && "QR Code"}
              {method === "CARD" && "Credit/Debit Card"}
              {method === "COD" && "Cash on Delivery"}
            </button>
          ))}
        </div>

        {/* Right Form Section */}
        <div className="w-[65%]">{renderForm()}</div>
      </div>
    </div>
  );
};

export default SelectPaymentMethod;
