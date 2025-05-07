import { useContext, useEffect, useState } from "react";
import { IoSearch, IoAdd } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import AddNewProductForm from "../../components/seller_components/seller_product_components/AddNewProductForm";
import DeleteProductModal from "../../components/seller_components/seller_product_components/DeleteProductModal";
import EditProductDetails from "../../components/seller_components/seller_product_components/EditProductDetails";
import { products as initialProducts } from "../../utils/resource/DataProvider.util";
import { AuthContext } from "../../contexts/AuthContext";
import NoData from "../../assets/images/NoData.svg";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

const getStatusColor = (status) => {
  return status === "available"
    ? "bg-success-op text-success border border-success"
    : "bg-danger-op text-danger border border-danger";
};

const SellerProducts = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const { currentUser, loading, fetchUser, refreshLoginContext } =
    useContext(AuthContext);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedProducts = products.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  console.log(displayedProducts);
  console.log(currentUser._id);
  const handleDelete = () => {
    setProducts((prev) => prev.filter((p) => p.id !== deleteProductId));
    setIsDeleteModalOpen(false);
    setDeleteProductId(null);
  };

  const fetchProductsBySellerId = async (seller_id) => {
    try {
      console.log("hey i am here!");
      const res = await axios.get(
        `http://localhost:8000/api/saarthi/product/seller/getProductsById/${currentUser?._id}`,
        { withCredentials: true }
      );

      console.log("Response Data:", res);

      if (res.data?.success && Array.isArray(res.data.products)) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      setProducts([]);
      console.error(
        "Error fetching products:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchProductsBySellerId(currentUser?.id);
  }, [currentUser?.id]);

  const handleEditProduct = () => {};

  return (
    <div className="relative w-full border rounded-md shadow-sm bg-white mt-2">
      {/* Header */}
      <header className="py-3 px-5 flex justify-between items-center border-b">
        <h3 className="text-lg font-medium text-primary-text">Product List</h3>
        <div className="flex items-center gap-x-3">
          <div className="searchbar border px-3 py-2 rounded-md flex items-center gap-x-2">
            <IoSearch className="text-[#8b8b8b]" />
            <input
              type="text"
              placeholder="Search"
              className="w-40 outline-none bg-transparent text-sm"
            />
          </div>

          <button
            className="text-sm bg-primary-txt px-3 py-2 rounded-md text-white flex items-center gap-x-2"
            onClick={() => {
              setEditProduct(null);
              setIsFormOpen(true);
            }}
          >
            <IoAdd className="text-lg" />
            <p>Add Product</p>
          </button>
        </div>
      </header>

      {/* Table */}
      {products.length > 0 ? (
        <table className="w-full border-collapse">
          <thead className="bg-[#f7f7f7] text-primary-text uppercase text-sm">
            <tr>
              {[
                "#",
                "Name",
                "Category",
                "Price (Rs).",
                "Unit",
                "Status",
                "Actions",
              ].map((heading, index) => (
                <th
                  key={index}
                  className="px-5 py-3 text-center font-medium text-sm"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {displayedProducts.map((product, index) => (
              <tr key={product.id} className="border-b transition text-sm">
                <td className="py-3 px-5 text-center">
                  {startIndex + index + 1}
                </td>
                <td className="py-3 px-5 text-center">{product.name}</td>
                <td className="py-3 px-5 text-center">{product.category}</td>
                <td className="py-3 px-5 text-center">{product.price}</td>
                <td className="py-3 px-5 text-center">{product.unit}</td>
                <td className="py-3 px-5 text-center">
                  <p
                    className={`w-fit mx-auto rounded-full px-2 py-1 ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </p>
                </td>
                <td className="py-2 px-5 text-center space-x-2 flex justify-center">
                  {/* Edit */}
                  <button
                    className="relative group border p-2 rounded-md"
                    onClick={() => {
                      setEditProduct(product);
                      setIsEditFormOpen(true);
                    }}
                  >
                    <CiEdit />
                    <span className="absolute hidden group-hover:block text-xs text-white bg-gray-800 px-2 py-1 rounded-md -top-8 left-1/2 -translate-x-1/2 z-10">
                      Edit
                    </span>
                  </button>

                  {/* Delete */}
                  <button
                    className="relative group border p-2 rounded-md"
                    onClick={() => {
                      setDeleteProductId(product.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <RiDeleteBin7Line />
                    <span className="absolute hidden group-hover:block text-xs text-white bg-gray-800 px-2 py-1 rounded-md -top-8 left-1/2 -translate-x-1/2 z-10">
                      Delete
                    </span>
                  </button>

                  {/* Star */}
                  <button className="relative group border p-2 rounded-md">
                    <FaRegStar />
                    <span className="absolute hidden group-hover:block text-xs text-white bg-gray-800 px-2 py-1 rounded-md -top-8 left-1/2 -translate-x-1/2 z-10">
                      Star
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-3 flex flex-col items-center justify-center w-full">
          <img src={NoData} alt="" className="w-[20%]" />
          {/* <h3>No Products</h3> */}
        </div>
      )}

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-between items-center p-4 border-t">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-primary-btn text-white rounded-md disabled:bg-primary-bg disabled:text-primary-txt"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary-btn text-white rounded-md disabled:bg-primary-bg disabled:text-primary-txt"
          >
            Next
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <AddNewProductForm
          onClose={() => setIsFormOpen(false)}
          productToEdit={editProduct}
        />
      )}

      {isEditFormOpen && (
        <EditProductDetails
          onClose={() => setIsEditFormOpen(false)}
          onSubmit={handleEditProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteProductModal
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default SellerProducts;
