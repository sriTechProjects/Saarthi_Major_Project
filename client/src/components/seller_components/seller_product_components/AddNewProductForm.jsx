import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import axios from "axios"

const AddNewProductForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    unit: "",
    price: "",
    discount: "",
    status: "available",
    images: [],
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/jpg", "image/png"].includes(file.type)
    );
    setFormData({ ...formData, images: validFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const form = new FormData();
    form.append("name", formData.name);
    form.append("category", formData.category);
    form.append("description", formData.description);
    form.append("unit", formData.unit);
    form.append("price", formData.price);
    form.append("discount", formData.discount);
    form.append("status", formData.status);
  
    formData.images.forEach((img, index) => {
      form.append("images", img); // assuming backend supports array of files as 'images'
    });
  
    try {
      const res = await axios.post(
        "http://localhost:8000/api/saarthi/product/addProduct",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Product added:", res.data);
      alert("Product successfully added!");
      onClose(); // optionally close modal
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Something went wrong while submitting the form.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[600px] max-w-xl relative">
        <span className="flex gap-x-2 items-center mb-6">
          <div className="p-2 rounded-full bg-sky bg-opacity-[30%] border border-sky">
            <IoAddOutline className="text-sky text-2xl font-semibold"/>
          </div>
          <h2 className="text-2xl font-medium text-left">
            Add New Product
          </h2>
        </span>

        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md focus:border-sky"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Unit Type</label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">
              Unit Price (Rs.)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="available">Available</option>
              <option value="out of stock">Out of Stock</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">
              Upload Images
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageUpload}
              className="w-full border px-3 py-2 rounded-md transition duration-300 ease-in-out hover:border-blue-400 hover:shadow-md"
            />
            {formData.images.length > 0 && (
              <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
                <span>{formData.images.length} image(s) selected</span>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="text-blue-600 underline text-sm"
                >
                  Preview
                </button>
              </div>
            )}
          </div>

          <div className="col-span-2 flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#f1f1f1] shadow-sm rounded-md"
            >
              Discard
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Product
            </button>
          </div>
        </form>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-black"
              >
                ✕
              </button>
              <h3 className="text-lg font-medium mb-4">Selected Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {formData.images.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-32 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewProductForm;
