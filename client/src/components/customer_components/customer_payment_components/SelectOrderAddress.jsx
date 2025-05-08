import { useState } from "react";

const SelectOrderAddress = () => {
  const [addresses, setAddresses] = useState([
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
    {
      id: 2,
      name: "Amrik Bhadra",
      phoneNo: 7739226540,
      pinCode: 412105,
      locality: "Alandi",
      address: "C-16, Concept Heritage",
      city: "Pune",
      state: "Maharastra",
      landmark: "Near Gajanan Maharaj Mandir",
      alternateMobile: 8092744080,
      type: "Work",
      isActive: false,
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    name: "",
    phoneNo: "",
    pinCode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    alternateMobile: "",
    type: "Home",
  });

  const handleSetAddressActive = (id) => {
    setAddresses((prev) =>
      prev.map((address) => ({
        ...address,
        isActive: address.id === id,
      }))
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const newId = addresses.length ? addresses[addresses.length - 1].id + 1 : 1;

    const updatedAddress = {
      ...newAddress,
      id: newId,
      isActive: true,
      phoneNo: parseInt(newAddress.phoneNo),
      alternateMobile: parseInt(newAddress.alternateMobile),
      pinCode: parseInt(newAddress.pinCode),
    };

    setAddresses((prev) =>
      prev.map((addr) => ({ ...addr, isActive: false })).concat(updatedAddress)
    );

    setNewAddress({
      name: "",
      phoneNo: "",
      pinCode: "",
      locality: "",
      address: "",
      city: "",
      state: "",
      landmark: "",
      alternateMobile: "",
      type: "Home",
    });
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((address) => address.id !== id));
  };

  return (
    <div className="bg-white p-6 w-full max-w-4xl relative border rounded-lg">
      <h1 className="text-xl font-semibold text-sky">Select Address</h1>
      <div className="w-full rounded-md flex mt-3">
        <div className="left w-[45%] flex flex-col gap-y-2 overflow-y-auto">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`w-[90%] rounded-md ${
                address.isActive ? "border border-sky" : "border"
              } p-3 cursor-pointer relative`}
              onClick={() => handleSetAddressActive(address.id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering setActive
                  handleDeleteAddress(address.id);
                }}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
              >
                ✖
              </button>
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
                <p className="py-1 px-2 rounded-md bg-sky-op border border-sky text-sky">
                  {address.type}
                </p>
              </span>
            </div>
          ))}
        </div>

        <div className="right w-[55%] p-1">
          <h3 className="text-primary-txt font-medium mb-2">Add New Address</h3>
          <form className="py-1" onSubmit={handleAddAddress}>
            <div className="flex gap-x-3 mb-3">
              <input
                className="border p-2 w-full rounded"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={newAddress.name}
                onChange={handleChange}
                required
              />
              <input
                className="border p-2 w-full rounded"
                type="text"
                name="phoneNo"
                placeholder="Enter phone number"
                value={newAddress.phoneNo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-x-3 mb-3">
              <input
                className="border p-2 w-full rounded"
                type="text"
                name="pinCode"
                placeholder="Enter pin code"
                value={newAddress.pinCode}
                onChange={handleChange}
                required
              />
              <input
                className="border p-2 w-full rounded"
                type="text"
                name="locality"
                placeholder="Enter locality"
                value={newAddress.locality}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <textarea
                className="border p-2 w-full rounded"
                type="text"
                name="address"
                placeholder="Enter full address"
                value={newAddress.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-x-3 mb-3">
              <input
                className="border p-2 w-full rounded"
                type="text"
                name="city"
                placeholder="Enter city"
                value={newAddress.city}
                onChange={handleChange}
                required
              />
              <input
                className="border p-2 w-full rounded"
                type="text"
                name="state"
                placeholder="Enter state"
                value={newAddress.state}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex gap-x-3 mb-3">
              <input
                className="border p-2 w-full rounded"
                type="text"
                name="landmark"
                placeholder="Nearby landmark"
                value={newAddress.landmark}
                onChange={handleChange}
              />
              <input
                className="border p-2 w-full rounded"
                type="text"
                name="alternateMobile"
                placeholder="Alternate number"
                value={newAddress.alternateMobile}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-x-4 items-center mb-3">
              <label className="text-sm font-medium text-gray-600">Type:</label>
              <select
                name="type"
                value={newAddress.type}
                onChange={handleChange}
                className="border px-2 py-1 rounded-md text-sm"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-sky text-white rounded-md hover:bg-sky-dark text-sm"
            >
              Add Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SelectOrderAddress;
