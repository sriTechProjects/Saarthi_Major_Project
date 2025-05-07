import { useEffect, useState, useContext } from "react";
import { Range } from "react-range";
import { FaAngleUp, FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
// import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { LuFilter } from "react-icons/lu";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import RecommendedProducts from "../../components/customer_components/customer_common_components/RecommendedProducts";
import {
  cities,
  recommendedProducts,
} from "../../utils/resource/DataProvider.util";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";

const CustomerProductList = () => {
  const { currentUser } = useContext(AuthContext);
  const MIN = 0;
  const MAX = 200;
  const [filterValues, setFilterValues] = useState({
    priceRange: [MIN, MAX],
    ratings: [],
    discounts: [],
    city: "",
  });
  const { category } = useParams();
  const [productList, setProductList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchedCity, setSearchedCity] = useState("");
  const [showCityMenu, openCityMenu] = useState(false);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchedCity.toLowerCase())
  );

  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [discountOpen, setDiscountOpen] = useState(true);
  const [cityOpen, setCitytOpen] = useState(true);

  const [showFilter, setShowFilter] = useState(true);

  // const [priceRange, setPriceRange] = useState([0, 200]);

  const [currentPage, setCurrentPage] = useState(1);
  let productsPerPage = 8; // Number of products to show per page

  useEffect(() => {
    console.log("useEffect triggered", currentUser._id);
    if (currentUser && currentUser._id) {
      console.log("Fetching category wise products for:", category);
      axios
        .get(`http://localhost:8000/api/saarthi/products/${category}`, {
          userId: currentUser._id
        })
        .then((res) => {
          console.log("Category Products:", res.data.data);
          setProductList(res.data.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch category wise products:", err);
        });
    }
  }, [currentUser]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:8000/api/saarthi/products/${category}/${product_id}`);
  //       const data = response.data?.data;
  //       if (data) {
  //         setProductDetails(data);
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   };
  
  //   fetchData();
  // }, [category]);
  
  // useEffect(() => {
  //   console.log("Product details updated:", productDetails);
  // }, [productDetails]);

  // Pagination logic
  const totalPages = Math.ceil(productList.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = productList.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="py-5 px-[7vw]">
      <div className="flex gap-4">
        {/* Left Filter Box */}
        <div
          className={`${
            showFilter ? "w-[32%]" : "w-[40px]"
          } transition-all duration-300 sticky top-5 h-fit bg-white rounded-md flex flex-col shadow-sm`}
        >
          <div className="filter-header flex justify-between items-center p-3 border-b text-[#111]">
            {showFilter && (
              <div className="flex gap-x-2 items-center">
                <LuFilter />
                <p className="font-semibold">Filter</p>
              </div>
            )}

            {showFilter ? (
              <TbLayoutSidebarLeftCollapse
                className="text-xl cursor-pointer"
                onClick={() => setShowFilter(!showFilter)}
              />
            ) : (
              <TbLayoutSidebarRightCollapse
                className="text-xl cursor-pointer"
                onClick={() => setShowFilter(!showFilter)}
              />
            )}
          </div>

          {showFilter && (
            <>
              {/* price filter */}
              <div className="filter-header flex flex-col gap-2 p-3 border-b text-[#111]">
                <div className="w-full flex justify-between items-center mb-2">
                  <p className="text-[#464646] text-sm">Price</p>
                  {priceOpen ? (
                    <IoMdArrowDropup
                      className="text-xl"
                      onClick={() => setPriceOpen(!priceOpen)}
                    />
                  ) : (
                    <IoMdArrowDropdown
                      className="text-xl"
                      onClick={() => setPriceOpen(!priceOpen)}
                    />
                  )}
                </div>

                {priceOpen && (
                  <div>
                    <Range
                      step={1}
                      min={MIN}
                      max={MAX}
                      values={filterValues.priceRange}
                      onChange={(values) =>
                        setFilterValues((prev) => ({
                          ...prev,
                          priceRange: values,
                        }))
                      }
                      renderTrack={({ props, children }) => (
                        <div
                          {...props}
                          className="h-1 rounded bg-gray-300 w-full"
                          style={{ ...props.style }}
                        >
                          <div
                            className="h-1 bg-green-600 rounded"
                            style={{
                              marginLeft: `${
                                ((filterValues.priceRange[0] - MIN) /
                                  (MAX - MIN)) *
                                100
                              }%`,
                              width: `${
                                ((filterValues.priceRange[1] -
                                  filterValues.priceRange[0]) /
                                  (MAX - MIN)) *
                                100
                              }%`,
                            }}
                          />
                          {children}
                        </div>
                      )}
                      renderThumb={({ props }) => (
                        <div
                          {...props}
                          className="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-md"
                        />
                      )}
                    />

                    <div className="flex justify-between items-center gap-2 mt-3">
                      <span>
                        <label
                          htmlFor="minPrice"
                          className="text-xs text-[#bbb]"
                        >
                          Min
                        </label>
                        <input
                          type="number"
                          min={MIN}
                          max={filterValues.priceRange[1]}
                          value={filterValues.priceRange[0]}
                          onChange={(e) =>
                            setFilterValues((prev) => ({
                              ...prev,
                              priceRange: [
                                Math.min(
                                  Number(e.target.value),
                                  prev.priceRange[1]
                                ),
                                prev.priceRange[1],
                              ],
                            }))
                          }
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </span>

                      <span>
                        <label
                          htmlFor="maxPrice"
                          className="text-xs text-[#bbb]"
                        >
                          Max
                        </label>
                        <input
                          type="number"
                          id="maxPrice"
                          min={filterValues.priceRange[0]}
                          max={MAX}
                          value={filterValues.priceRange[1]}
                          onChange={(e) =>
                            setFilterValues((prev) => ({
                              ...prev,
                              priceRange: [
                                prev.priceRange[0],
                                Math.max(
                                  Number(e.target.value),
                                  prev.priceRange[0]
                                ),
                              ],
                            }))
                          }
                          className="w-full border rounded px-2 py-1 text-sm"
                        />
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* rating filter */}
              <div className="filter-header flex flex-col gap-2 p-3 border-b text-[#111]">
                <div className="w-full flex justify-between items-center mb-2">
                  <p className="text-[#464646] text-sm">Customer Ratings</p>
                  {ratingOpen ? (
                    <IoMdArrowDropup
                      className="text-xl"
                      onClick={() => setRatingOpen(!ratingOpen)}
                    />
                  ) : (
                    <IoMdArrowDropdown
                      className="text-xl"
                      onClick={() => setRatingOpen(!ratingOpen)}
                    />
                  )}
                </div>

                {ratingOpen && (
                  <div className="flex flex-col gap-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="accent-green-600 text-white w-4 h-4"
                          name="rating"
                          value={rating}
                          checked={filterValues.ratings.includes(rating)}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setFilterValues((prev) => ({
                              ...prev,
                              ratings: e.target.checked
                                ? [...prev.ratings, value]
                                : prev.ratings.filter((r) => r !== value),
                            }));
                          }}
                        />

                        <span className="text-[#444] flex gap-x-1">
                          <p>{rating}</p>
                          <FaStar />
                          <p>& above</p>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* discount filter */}
              <div className="filter-header flex flex-col gap-2 p-3 border-b text-[#111]">
                <div className="w-full flex justify-between items-center mb-2">
                  <p className="text-[#464646] text-sm">Discounts</p>
                  {discountOpen ? (
                    <IoMdArrowDropup
                      className="text-xl"
                      onClick={() => setDiscountOpen(!discountOpen)}
                    />
                  ) : (
                    <IoMdArrowDropdown
                      className="text-xl"
                      onClick={() => setDiscountOpen(!discountOpen)}
                    />
                  )}
                </div>

                {discountOpen && (
                  <div className="flex flex-col gap-2">
                    {[50, 40, 30, 20, 10].map((discount) => (
                      <label
                        key={discount}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="accent-green-600 text-white w-4 h-4"
                          name="discount"
                          value={discount}
                          checked={filterValues.discounts.includes(discount)}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setFilterValues((prev) => ({
                              ...prev,
                              discounts: e.target.checked
                                ? [...prev.discounts, value]
                                : prev.discounts.filter((d) => d !== value),
                            }));
                          }}
                        />

                        <span className="text-[#444] flex gap-x-1">
                          {discount}% or more
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* city filter */}
              <div className="filter-header flex flex-col gap-2 p-3 border-b text-[#111]">
                <div className="w-full flex justify-between items-center mb-2">
                  <p className="text-[#464646] text-sm">City</p>
                  {cityOpen ? (
                    <IoMdArrowDropup
                      className="text-xl"
                      onClick={() => setCitytOpen(!cityOpen)}
                    />
                  ) : (
                    <IoMdArrowDropdown
                      className="text-xl"
                      onClick={() => setCitytOpen(!cityOpen)}
                    />
                  )}
                </div>

                {cityOpen && (
                  <div className="">
                    <div
                      className="flex items-center gap-x-1 p-0.5 pr-2 border rounded-md focus:ring-2 focus:ring-primary"
                      onClick={() => openCityMenu(!showCityMenu)}
                    >
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full px-3 py-2 text-sm focus:outline-none"
                        readOnly={true}
                      />

                      {showCityMenu ? (
                        <FaAngleUp className="cursor-pointer" />
                      ) : (
                        <FaAngleDown className="cursor-pointer" />
                      )}
                    </div>
                    {showCityMenu && (
                      <div className="w-full border rounded-md shadow-sm mt-1">
                        <input
                          type="text"
                          placeholder="Search city..."
                          value={searchedCity}
                          onChange={(e) => setSearchedCity(e.target.value)}
                          className="m-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <ul className="mt-1 max-h-40 overflow-y-auto bg-white rounded-md">
                          {filteredCities.map((city, index) => (
                            <li
                              key={index}
                              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setSelectedCity(city);
                                setFilterValues((prev) => ({
                                  ...prev,
                                  city: city,
                                }));
                                openCityMenu(false);
                              }}
                            >
                              {city}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Product Cards Container */}
        <div className="flex flex-col gap-y-2 max-h-[100vh]">
          <div className="flex flex-wrap gap-4 transition-all duration-300">
            {currentProducts.map((product) => (
              <RecommendedProducts key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <ul className="flex items-center gap-2">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <li key={pageNum}>
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === pageNum ? "bg-green-600 text-white" : ""
                      }`}
                    >
                      {pageNum}
                    </button>
                  </li>
                )
              )}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProductList;
