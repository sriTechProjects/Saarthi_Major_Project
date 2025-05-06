// // import components
// import { ProductCategoryCardComponent } from "../../utils/resource/ComponentsProvider.util";
// import RecommendedProducts from "../../components/customer_components/customer_common_components/RecommendedProducts";
// import { recommendedProducts } from "../../utils/resource/DataProvider.util";
// import { AuthContext } from "../../contexts/AuthContext";

// // import images
// import images from "../../utils/resource/ImageProvider.util";

// const CustomerHomePage = () => {
//   const categories = [
//     { title: "Fruits", image: images.category_fruits },
//     { title: "Vegetables", image: images.category_vegetable },
//     { title: "Snacks", image: images.category_snacks },
//     { title: "Rice", image: images.category_rice },
//     { title: "Flour", image: images.category_atta },
//     { title: "Spices", image: images.category_spices },
//     { title: "Sugar", image: images.category_sugar },
//     { title: "Salt", image: images.category_salt },
//     { title: "Oil", image: images.category_oil },
//     { title: "Ghee", image: images.category_ghee },
//     { title: "Beverages", image: images.category_beverages },
//     { title: "Sweets", image: images.category_sweets },
//   ];
//   // const recommendedProducts = [
//   //   {
//   //     id: 1,
//   //     img: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.sfimpex.co.in%2Ffresh-banana.htm&psig=AOvVaw1nt8fJM6p0WJYtCw96NzdO&ust=1744356085895000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMiKk_n2zIwDFQAAAAAdAAAAABAE",
//   //     title: "Fresh Bananas",
//   //     price: "Rs. 80",
//   //     rating: 4.8,
//   //   },
//   //   {
//   //     id: 2,
//   //     img: "https://imgs.search.brave.com/E4B3F1kqjhub03Tnmzg7vrlOIJbuj9sfy1n1lD8HEFg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTM2/NTA5OTg2OS9waG90/by9zaXgtYXBwbGVz/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1LeDlqTnZFRVQ1/RVJyN29ITkZNeHJv/VGM1NEsxTmdrN1Ix/Qlc5SUNYMlBVPQ",
//   //     title: "Red Apples",
//   //     price: "Rs. 80",
//   //     rating: 4.8,
//   //   },
//   //   {
//   //     id: 3,
//   //     img: "https://imgs.search.brave.com/Wim1vOJq_-t7HGc0xKxH52MndHQYQrQhdl1L85Hois8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzc5LzYwLzY5/LzM2MF9GXzI3OTYw/Njk5OV80Zkl0anYx/UkdqN29ndWp6UVNa/cUI5aGZrYnl6eEo0/ci5qcGc",
//   //     title: "Juicy Oranges",
//   //     price: "Rs. 80",
//   //     rating: 4.8,
//   //   },
//   //   {
//   //     id: 4,
//   //     img: "https://imgs.search.brave.com/EHArHypwlGrB5iYPJUV-IUMLvdZOA-ZWrpdRG_yVVYY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTEz/Mjk0MjYzMS9waG90/by93aGl0ZS1ncmFw/ZS5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9VVZSUUw0a25Q/ZTh0SmE1aXJSdDN5/ZGF0Y1VrUThCSklK/WUtKejlJSDdYZz0",
//   //     title: "Green Grapes",
//   //     price: "Rs. 80",
//   //     rating: 4.8,
//   //   },
//   // ];

//   return (
//     <>
//       {/* Browse category section */}
//       <section className="bg-white m-5 rounded-lg shadow-sm">
//         <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-[#333333] text-xl font-semibold">
//                 Browse by <span className="text-primary">Category</span>
//               </h2>
//             </div>
//           </div>

//           <div className="flex items-center mt-2 w-full">
//             <div className="flex overflow-x-auto hide-scrollbar">
//               <div className="hide-scrollbar flex gap-4 text-0 px-1.5 py-2">
//                 {categories.map((category, index) => (
//                   <ProductCategoryCardComponent
//                     key={index}
//                     title={category.title}
//                     image={category.image}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Recomended product section */}
//       <section className="bg-white m-5 rounded-lg shadow-sm">
//         <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-[#333333] text-xl font-semibold">
//                 <span className="text-primary">Recommended</span> Products
//               </h2>
//             </div>
//           </div>

//           <div className="flex items-center mt-2 w-full">
//             <div className="flex overflow-x-auto hide-scrollbar">
//               <div className="hide-scrollbar flex gap-4 text-0 px-1.5 py-2">
//                 {recommendedProducts.map((product, index) => (
//                   <RecommendedProducts
//                     key={product.id || index}
//                     product={product}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default CustomerHomePage;


import { useContext, useEffect, useState } from "react";

// import components
import { ProductCategoryCardComponent } from "../../utils/resource/ComponentsProvider.util";
import RecommendedProducts from "../../components/customer_components/customer_common_components/RecommendedProducts";
import { AuthContext } from "../../contexts/AuthContext";

// import images
import images from "../../utils/resource/ImageProvider.util";
import axios from "axios"; // assuming you're using axios for API calls

const CustomerHomePage = () => {
  const { currentUser } = useContext(AuthContext); // ✅ Get currentUser from context
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const categories = [
    { title: "Fruits", image: images.category_fruits },
    { title: "Vegetables", image: images.category_vegetable },
    { title: "Snacks", image: images.category_snacks },
    { title: "Rice", image: images.category_rice },
    { title: "Flour", image: images.category_atta },
    { title: "Spices", image: images.category_spices },
    { title: "Sugar", image: images.category_sugar },
    { title: "Salt", image: images.category_salt },
    { title: "Oil", image: images.category_oil },
    { title: "Ghee", image: images.category_ghee },
    { title: "Beverages", image: images.category_beverages },
    { title: "Sweets", image: images.category_sweets },
  ];

  useEffect(() => {
    console.log("useEffect triggered", currentUser._id);
    if (currentUser && currentUser._id) {
      console.log("Fetching recommendations for:", currentUser.userId);
      axios
        .post("http://localhost:8000/api/saarthi/recommendations", {
          userId: currentUser._id
        })
        .then((res) => {
          console.log("Recommended Products:", res.data);
          setRecommendedProducts(res.data.recommendations || []);
        })
        .catch((err) => {
          console.error("Failed to fetch recommended products:", err);
        });
    }
  }, [currentUser]);

  return (
    <>
      {/* Browse category section */}
      <section className="bg-white m-5 rounded-lg shadow-sm">
        <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[#333333] text-xl font-semibold">
                Browse by <span className="text-primary">Category</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center mt-2 w-full">
            <div className="flex overflow-x-auto hide-scrollbar">
              <div className="hide-scrollbar flex gap-4 text-0 px-1.5 py-2">
                {categories.map((category, index) => (
                  <ProductCategoryCardComponent
                    key={index}
                    title={category.title}
                    image={category.image}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended product section */}
      <section className="bg-white m-5 rounded-lg shadow-sm">
        <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-[#333333] text-xl font-semibold">
                <span className="text-primary">Recommended</span> Products
              </h2>
            </div>
          </div>

          <div className="flex items-center mt-2 w-full">
            <div className="flex overflow-x-auto hide-scrollbar">
              <div className="hide-scrollbar flex gap-4 text-0 px-1.5 py-2">
                {recommendedProducts.map((product, index) => (
                  <RecommendedProducts
                    key={product.product_id || index}
                    product={product}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerHomePage;
