import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { X } from "lucide-react";

const OrderDetailModal = ({ order, onClose }) => {
  const [address, setAddress] = useState({});
  const [cartItemsState, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    console.log(`Particular order: ${order}`);
    setAddress(order.shippingAddress);
    setCartItems(order.items);
    setTotalPrice(order.totalPrice);
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-5xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={24} onClick={onClose} />
        </button>

        <div>
          <h1 className="text-xl font-semibold text-sky mb-4">Order Summary</h1>
          <div className="w-full rounded-md flex mt-3">
            {/* Left Section */}
            <div className="left w-[55%] p-1 mr-4">
              <ul className="space-y-2 mb-4">
                {cartItemsState.map((item) => (
                  <li
                    key={item.productId}
                    className="flex justify-between pb-2 text-base"
                  >
                    <span>{item.productName}</span>
                    <span>x {item.quantity}</span>
                    <span>₹{item.priceAtPurchase.toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              {/* Summary */}
              <div className="mt-4 text-sm text-gray-700 space-y-2 border-t pt-4">
                <div className="flex justify-between font-semibold text-lg text-primary-text">
                  <span>Amount to Pay</span>
                  <span className="text-sky">₹{totalPrice.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex flex-col gap-y-5 pt-5">
                  <p>
                    Payment Method: <span className="px-2 py-1 rounded-md border border-sky text-sky bg-sky-op">{order.paymentMethod}</span>
                  </p>
                  <p>
                    Payment Status: <span className="px-2 py-1 rounded-md border border-sky text-sky bg-sky-op">{order.paymentStatus}</span>
                  </p>
                  <p>
                    Order Date:{" "}
                    <span className="px-2 py-1 rounded-md border border-sky text-sky bg-sky-op">{new Date(order.orderDate).toLocaleDateString()}</span>
                  </p>
                  <p>
                    Delivery Date:{" "}
                    <span className="px-2 py-1 rounded-md border border-sky text-sky bg-sky-op">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section: Delivery Address */}
            <div className="right w-[45%] flex flex-col items-center gap-y-2 overflow-y-auto">
              <h3 className="text-start pl-5 w-full font-medium">
                Delivery Address
              </h3>
              <div
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  useEffect(() => {
    // Replace this with an actual API call
    // const mockOrders = [
    //   {
    //     _id: "681d194a69512629cd3ddfaa",
    //     orderDate: new Date(2025, 4, 8), // Month is 0-indexed
    //     deliveryDate: new Date(2025, 4, 12),
    //     status: "Placed",
    //     paymentMethod: "UPI",
    //     paymentStatus: "Paid",
    //     totalPrice: 641.56,
    //     items: [
    //       { productId: "prod1", quantity: 3, priceAtPurchase: 536.82 },
    //       { productId: "prod2", quantity: 1, priceAtPurchase: 100.74 },
    //     ],
    //     shippingAddress: {
    //       name: "Srivaths Iyer",
    //       phoneNo: "9987551082",
    //       pinCode: "412105",
    //       locality: "Alandi",
    //       address: "F-2, GoodLuck Boys Hostel",
    //       city: "Pune",
    //       state: "Maharastra",
    //       landmark: "Near Neelam Hotel",
    //       alternateMobile: "7689854674",
    //       type: "Home",
    //     },
    //   },
    // ];
    const fetchOrdersByCustomer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/saarthi/order/getOrders/${currentUser._id}`
        );
        if (response.status == 201) {
          console.log(response.data.orders);
          setOrders(response.data.orders);
          // setFilteredOrders(mockOrders);
        }
      } catch (error) {
        console.log("Internal Server Error");
      }
    };

    fetchOrdersByCustomer();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const date = new Date(order.orderDate);
      const matchesMonth = monthFilter
        ? date.getMonth() + 1 === parseInt(monthFilter)
        : true;
      const matchesYear = yearFilter
        ? date.getFullYear() === parseInt(yearFilter)
        : true;
      return matchesMonth && matchesYear;
    });
    setFilteredOrders(filtered);
  }, [monthFilter, yearFilter, orders]);

  return (
    <section className="bg-white m-5 rounded-lg shadow-sm">
      <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
        <h1 className="text-xl font-semibold">My Orders</h1>
        <div className="grid grid-cols-2 gap-4">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="w-full border border-gray-300 rounded-md p-3"
            >
              {/* header */}
              <span className="flex items-center justify-between border-b-2 pb-2">
                <h1 className="text-xl font-semibold text-primary-txt">
                  Order-{String(order._id).slice(-6)}
                </h1>
                <span className="text-sm font-semibold py-1 px-2 border-2 border-sky rounded-md text-sky bg-sky-op">
                  {order.status}
                </span>
              </span>

              {/* body */}
              <span className="text-sm text-gray-500 flex flex-col gap-y-2 my-4">
                <div className="flex gap-x-4 items-center">
                  <span className="px-2 py-1 rounded-md border border-sky bg-sky-op text-sky">
                    Order Date: {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-1 rounded-md border border-sky bg-sky-op text-sky">
                    Delivery Date:{" "}
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-x-4">
                  <span className="px-2 py-1 rounded-md border border-sky bg-sky-op text-sky">
                    Items: {order.items.length}
                  </span>
                  <span className="px-2 py-1 rounded-md border border-sky bg-sky-op text-sky">
                    Payment: {order.paymentMethod}
                  </span>
                  <span className="px-2 py-1 rounded-md border border-sky bg-sky-op text-sky">
                    Payment Status: {order.paymentStatus}
                  </span>
                </div>
              </span>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-sky">
                  ₹ {order.totalPrice.toFixed(2)}
                </h2>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsOrderDetailOpen(true);
                  }}
                  className="text-white bg-primary-btn rounded-md px-2 py-2 text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isOrderDetailOpen && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setIsOrderDetailOpen(false);
          }}
        />
      )}
    </section>
  );
};

export default CustomerOrdersPage;
