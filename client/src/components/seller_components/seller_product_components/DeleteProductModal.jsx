import axios from "axios";
import {toast} from "react-hot-toast";

const DeleteProductModal = ({ onClose, onConfirm, deleteProductId, fetchProductsBySellerId }) => {
  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/saarthi/product/seller/deleteProductById/${deleteProductId}`
      );

      if (response.status === 201) {
        onClose();
        fetchProductsBySellerId()
        toast.success("Product Deleted!");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold text-red-600 mb-4">
          Confirm Deletion
        </h2>
        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
