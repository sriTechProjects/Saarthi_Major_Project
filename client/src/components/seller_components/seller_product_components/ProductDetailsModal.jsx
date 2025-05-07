import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import dragon1 from "../../../assets/uploads/dragon3.jpg"
import dragon2 from "../../../assets/uploads/dragon2.jpg"
import dragon3 from "../../../assets/uploads/dragon1.jpg"

const ProductDetailsModal = ({ onClose, selectedProduct }) => {
  //   const [product, setProduct] = useState({
  //     name: "Dragon Fruit",
  //     description: "A vibrant tropical fruit rich in antioxidants.",
  //     category: "Fruits",
  //     unit_type: "kg",
  //     unit_price: 210,
  //     status: "available",
  //     ratings: 4.5,
  //     reviews: 12,
  //     discount: 12,
  //     images: [
  //       dragon1,
  //       dragon2,
  //       dragon3
  //     ],
  //     comments: [
  //       {
  //         buyer_id: "123",
  //         comment_desc: "Very fresh and tasty!",
  //         rating_given: 5,
  //       },
  //       {
  //         buyer_id: "456",
  //         comment_desc: "Good quality but a bit expensive.",
  //         rating_given: 4,
  //       },
  //       {
  //         buyer_id: "789",
  //         comment_desc: "Excellent packaging and taste.",
  //         rating_given: 5,
  //       },
  //     ],
  //   });

  const prodImage = [
    dragon1, dragon2, dragon3
  ]

  console.log(selectedProduct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-5xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
        >
          <X size={24} onClick={onClose} />
        </button>

        {/* Carousel */}
        <div className="mb-6">
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={3000}
            className="rounded-xl"
          >
            {prodImage.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img}
                  alt={`Product ${idx}`}
                  className="h-64 object-cover rounded-xl"
                />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Product Info */}
        <div className="space-y-2 text-gray-800">
          <h2 className="text-3xl font-semibold">{selectedProduct.name}</h2>
          <p className="text-gray-600">{selectedProduct.description}</p>
          <div className="grid grid-cols-2 gap-2 mt-5 border rounded-md p-3">
            <div className="text-[0.95rem]">
              <strong>Category:</strong> {selectedProduct.category}
            </div>
            <div className="text-[0.95rem]">
              <strong>Unit Type:</strong> {selectedProduct.unit_type}
            </div>
            <div className="text-[0.95rem]">
              <strong>Unit Price:</strong> ₹ {selectedProduct.unit_price}
            </div>
            <div className="text-[0.95rem]">
              <strong>Discount:</strong> {selectedProduct.discount}%
            </div>
            <div className={`text-[0.95rem] flex items-center gap-x-2`}>
              <strong>Status:</strong>{" "}
              <p
                className={`${
                  selectedProduct.status === "available"
                    ? "bg-green-700 text-white"
                    : "bg-red-600 text-white"
                } px-2 py-1 rounded-md w-fit`}
              >
                {selectedProduct.status}
              </p>
            </div>
            <div className="text-[0.95rem]">
              <strong>Ratings:</strong> {selectedProduct.ratings} ⭐
            </div>
            <div className="text-[0.95rem]">
              <strong>Reviews:</strong> {selectedProduct.reviews}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Customer Comments</h3>
          <div className="flex overflow-x-auto space-x-4 p-1">
            {selectedProduct.comments.map((c, i) => (
              <div key={i} className="min-w-[250px] border rounded-md p-4">
                <p className="text-sm text-gray-700">{c.comment_desc}</p>
                <div className="mt-2 text-sm text-yellow-600">
                  Rating: {c.rating_given} ⭐
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
