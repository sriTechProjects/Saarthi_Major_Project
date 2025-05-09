import { useEffect, useMemo, useState } from "react";

const OrderSummary = ({ cartItemsState, setTotalPayable }) => {
  // const [cartItems] = useState([
  //   { id: 1, name: "Product A", quantity: 2, price: 299 },
  //   { id: 2, name: "Product B", quantity: 1, price: 499 },
  //   { id: 3, name: "Product C", quantity: 3, price: 150 },
  // ]);

  const [addresses] = useState([
    {
      id: 1,
      name: "Srivaths Iyer",
      phoneNo: 9987551082,
      pinCode: 412105,
      locality: "Alandi",
      address: "F-2, GoodLuck Boys Hostel",
      city: "Pune",
      state: "Maharastra",
      landmark: "Near Neelam Hotel",
      alternateMobile: 7689854674,
      type: "Home",
      isActive: true,
    },
  ]);
  // console.log("Cart Items"+cartItemsState);
  const itemTotal = cartItemsState.reduce(
    (sum, item) =>
      sum +
      item.quantity *
        (item.productId.unit_price -
          (item.productId.discount * item.productId.unit_price) / 100),
    0
  );
  const tax = Math.round(itemTotal * 0.1); // 10% tax
  const deliveryCharge = 20;
  const discount = Math.round(itemTotal * 0.05);
  // const totalPayable = itemTotal + tax + deliveryCharge - discount;
  const totalPayable = useMemo(() => {
    return itemTotal + tax + deliveryCharge - discount;
  }, [itemTotal, tax, deliveryCharge, discount]);

  useEffect(() => {
    setTotalPayable(totalPayable);
  }, [totalPayable, setTotalPayable]);

  return (
    <div className="bg-white p-6 w-full max-w-4xl relative border rounded-lg">
      <h1 className="text-xl font-semibold text-sky mb-4">Order Summary</h1>
      <div className="w-full rounded-md flex mt-3">
        {/* Left Section */}
        <div className="left w-[55%] p-1 mr-4">
          <ul className="space-y-2 mb-4">
            {cartItemsState.map((item) => (
              <li
                key={item.productId._id}
                className="flex justify-between pb-2 text-base"
              >
                <span>{item.productId.name}</span>
                <span>x {item.quantity}</span>
                <span>
                  ₹
                  {(
                    item.quantity *
                    (item.productId.unit_price -
                      (item.productId.discount * item.productId.unit_price) /
                        100)
                  ).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <div className="mt-4 text-sm text-gray-700 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Item Total</span>
              <span>₹{(itemTotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Charges</span>
              <span>₹{tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Total Discount</span>
              <span>-₹{discount}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold text-lg text-primary-text">
              <span>Amount to Pay</span>
              <span className="text-sky">₹{(totalPayable).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Section: Delivery Address */}
        <div className="right w-[45%] flex flex-col items-center gap-y-2 overflow-y-auto">
          <h3 className="text-start pl-5 w-full font-medium">
            Delivery Address
          </h3>
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`w-[90%] rounded-md border border-gray-300 p-3 cursor-pointer relative`}
            >
              <h1 className="text-base text-primary-txt font-medium mb-1">
                {address.name}
              </h1>
              <p className="text-sm text-gray-400">{address.address}</p>
              <p className="text-sm text-gray-400">{address.landmark}</p>
              <p className="text-sm text-gray-400">
                {address.locality}, {address.city}, {address.state} -{" "}
                {address.pinCode}
              </p>
              <span className="w-full flex items-center gap-x-2 text-sm mt-1">
                <p className="py-1 px-2 rounded-md bg-success-op border border-success text-success">
                  {address.phoneNo}
                </p>
                <p className="py-1 px-2 rounded-md bg-gray-100 border border-gray-500 text-slate-500">
                  {address.alternateMobile}
                </p>
                <p className="py-1 px-2 rounded-md bg-sky-100 border border-sky text-sky-700">
                  {address.type}
                </p>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
