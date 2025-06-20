// import { useContext, useEffect, useState } from "react";
// import { ProductCategoryCardComponent } from "../../utils/resource/ComponentsProvider.util";
// import RecommendedProducts from "../../components/customer_components/customer_common_components/RecommendedProducts";
// import { AuthContext } from "../../contexts/AuthContext";
// import images from "../../utils/resource/ImageProvider.util";
// import axios from "axios";

// const CustomerHomePage = () => {
//   const { currentUser } = useContext(AuthContext);
//   const [recommendedProducts, setRecommendedProducts] = useState([]);

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

//   const [selectedLanguage, setSelectedLanguage] = useState("en");

//   const languages = [
//     { code: "en", label: "English" },
//     { code: "hi", label: "Hindi" },
//     { code: "bn", label: "Bengali" },
//     { code: "ta", label: "Tamil" },
//   ];

//   // Add state to track if greeting has been shown
//   const [hasGreeted, setHasGreeted] = useState(false);

//   // Fetch recommendations
//   useEffect(() => {
//     if (currentUser && currentUser._id) {
//       axios
//         .post("http://localhost:8000/api/saarthi/recommendations", {
//           userId: currentUser._id,
//         })
//         .then((res) => {
//           const recs = res.data.recommendations || [];
//           setRecommendedProducts(recs);

//           // Send greeting to chatbot
//           if (!hasGreeted && recs.length > 0) {
//             const greetingMsg = {
//               type: "product_buttons",
//               message:
//                 "Hi there! 👋 Looking for something special today? Here are a few handpicked products we think you’ll love:",
//               products: recs.slice(0, 5).map((p) => ({
//                 name: p.name,
//                 id: p.product_id,
//               })),
//             };

//             setChatHistory([{ role: "assistant", content: greetingMsg }]);
//             setHasGreeted(true);
//           }
//         })
//         .catch((err) => {
//           console.error("Failed to fetch recommended products:", err);
//         });
//     }
//   }, [currentUser]);

//   // 👇 Inject chatbot script dynamically
//   // 👇 Chatbot state & logic
//   const [chatOpen, setChatOpen] = useState(false);
//   const [chatHistory, setChatHistory] = useState([]);
//   const [userInput, setUserInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSendMessage = async () => {
//     if (!userInput.trim()) return;

//     const newHistory = [...chatHistory, { role: "user", content: userInput }];
//     setChatHistory(newHistory);
//     setUserInput("");
//     setLoading(true);

//     try {
//       const res = await axios.post("http://localhost:5001/chat", {
//         query: userInput,
//         history: newHistory,
//         buyer_id: currentUser?._id,
//       });

//       const response = res.data?.response || "Sorry, something went wrong.";
//       console.log(response);
//       setChatHistory([...newHistory, { role: "assistant", content: response }]);
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setChatHistory([
//         ...newHistory,
//         {
//           role: "assistant",
//           content: "Failed to get a response from Saarthi.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Category section */}
//       <section className="bg-white m-5 rounded-lg shadow-sm">
//         {/* ...category content... */}
//         <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
//           <div className="flex justify-between items-center">
//             <h2 className="text-[#333333] text-xl font-semibold">
//               Browse by <span className="text-primary">Category</span>
//             </h2>
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

//       {/* Recommended Products */}
//       <section className="bg-white m-5 rounded-lg shadow-sm">
//         <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
//           <div className="flex justify-between items-center">
//             <h2 className="text-[#333333] text-xl font-semibold">
//               <span className="text-primary">Recommended</span> Products
//             </h2>
//           </div>
//           <div className="flex items-center mt-2 w-full">
//             <div className="flex overflow-x-auto hide-scrollbar">
//               <div className="hide-scrollbar flex gap-4 text-0 px-1.5 py-2">
//                 {recommendedProducts.map((product, index) => (
//                   <RecommendedProducts
//                     key={product.product_id || index}
//                     product={product}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       {/* Chatbot Floating Button */}
//       <div className="fixed bottom-6 right-6 z-50">
//         {!chatOpen ? (
//           <button
//             onClick={() => setChatOpen(true)}
//             className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-opacity-80"
//           >
//             💬
//           </button>
//         ) : (
//           <div className="w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
//             <div className="bg-primary text-white p-3 flex justify-between items-center">
//               <span className="font-semibold">Saarthi Chatbot</span>

//               <button onClick={() => setChatOpen(false)} className="text-white">
//                 ✖
//               </button>
//               <div className="fixed top-6 right-6 z-50">
//                 <select
//                   value={selectedLanguage}
//                   onChange={(e) => setSelectedLanguage(e.target.value)}
//                   className="border px-3 py-1 rounded-md text-sm"
//                 >
//                   {languages.map((lang) => (
//                     <option key={lang.code} value={lang.code}>
//                       {lang.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//             <div className="flex-1 p-2 overflow-y-auto space-y-2">
//               {chatHistory.map((msg, idx) => {
//                 const isUser = msg.role === "user";
//                 const isButtonMsg =
//                   typeof msg.content === "object" &&
//                   msg.content.type === "product_buttons";

//                 return (
//                   <div
//                     key={idx}
//                     className={`p-2 rounded-md max-w-[80%] ${
//                       isUser
//                         ? "bg-blue-100 self-end ml-auto"
//                         : "bg-gray-100 self-start"
//                     }`}
//                   >
//                     {isButtonMsg ? (
//                       <>
//                         <p className="mb-2 text-sm text-gray-800">
//                           {msg.content.message}
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {msg.content.products.map((prod, i) => (
//                             <a
//                               key={i}
//                               href={`/product/${prod.id}`}
//                               className="bg-primary text-white px-3 py-1 text-xs rounded hover:bg-opacity-90"
//                             >
//                               {prod.name}
//                             </a>
//                           ))}
//                         </div>
//                       </>
//                     ) : (
//                       msg.content
//                     )}
//                   </div>
//                 );
//               })}

//               {loading && (
//                 <div className="text-sm text-gray-400">Typing...</div>
//               )}
//             </div>
//             <div className="p-2 border-t flex">
//               <input
//                 type="text"
//                 value={userInput}
//                 onChange={(e) => setUserInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                 className="flex-1 border rounded-md px-2 py-1 text-sm"
//                 placeholder="Ask something..."
//               />
//               <button
//                 onClick={handleSendMessage}
//                 className="ml-2 bg-primary text-white px-3 rounded-md text-sm"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default CustomerHomePage;

import { useContext, useEffect, useState } from "react";
import { ProductCategoryCardComponent } from "../../utils/resource/ComponentsProvider.util";
import RecommendedProducts from "../../components/customer_components/customer_common_components/RecommendedProducts";
import { AuthContext } from "../../contexts/AuthContext";
import images from "../../utils/resource/ImageProvider.util";
import axios from "axios";

const CustomerHomePage = () => {
  const { currentUser } = useContext(AuthContext);
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

  const [hasGreeted, setHasGreeted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "mr", label: "Marathi" },
    { code: "ta", label: "Tamil" },
  ];

  useEffect(() => {
    if (currentUser && currentUser._id) {
      axios
        .post("http://localhost:8000/api/saarthi/recommendations", {
          userId: currentUser._id,
        })
        .then((res) => {
          const recs = res.data.recommendations || [];
          setRecommendedProducts(recs);
          console.log(recs);
          if (!hasGreeted && recs.length > 0) {
            const greetingMsg = {
              type: "product_buttons",
              message:
                "Hi there! 👋 Looking for something special today? Here are a few handpicked products we think you’ll love:",
              products: recs.slice(0, 5).map((p) => ({
                name: p.name,
                id: p.product_id,
                category: p.category
              })),
            };

            setChatHistory([{ role: "assistant", content: greetingMsg }]);
            setHasGreeted(true);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch recommended products:", err);
        });
    }
  }, [currentUser]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newHistory = [...chatHistory, { role: "user", content: userInput }];
    setChatHistory(newHistory);
    setUserInput("");
    setLoading(true);
    console.log(selectedLanguage);
    try {
      const res = await axios.post("http://localhost:5001/chat", {
        query: userInput,
        history: newHistory,
        buyer_id: currentUser?._id,
        language: selectedLanguage,
      });

      const response = res.data?.response || "Sorry, something went wrong.";
      setChatHistory([...newHistory, { role: "assistant", content: response }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setChatHistory([
        ...newHistory,
        { role: "assistant", content: "Failed to get a response from Saarthi." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Category section */}
      <section className="bg-white m-5 rounded-lg shadow-sm">
        <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
          <div className="flex justify-between items-center">
            <h2 className="text-[#333333] text-xl font-semibold">
              Browse by <span className="text-primary">Category</span>
            </h2>
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

      {/* Recommended Products */}
      <section className="bg-white m-5 rounded-lg shadow-sm">
        <div className="mx-auto w-[84vw] flex flex-col gap-4 py-8">
          <div className="flex justify-between items-center">
            <h2 className="text-[#333333] text-xl font-semibold">
              <span className="text-primary">Recommended</span> Products
            </h2>
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

      {/* Chatbot Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-opacity-80"
          >
            💬
          </button>
        ) : (
          <div className="w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden">
            <div className="bg-primary text-white p-3 flex justify-between items-center">
              <span className="font-semibold">Saarthi Chatbot</span>
              <div className="flex items-center gap-2">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="border px-2 py-1 rounded-md text-sm text-black"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.label}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <button onClick={() => setChatOpen(false)} className="text-white text-xl">
                  ✖
                </button>
              </div>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-2">
              {chatHistory.map((msg, idx) => {
                const isUser = msg.role === "user";
                const isButtonMsg =
                  typeof msg.content === "object" &&
                  msg.content.type === "product_buttons";

                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-md max-w-[80%] ${
                      isUser
                        ? "bg-blue-100 self-end ml-auto"
                        : "bg-gray-100 self-start"
                    }`}
                  >
                    {isButtonMsg ? (
                      <>
                        <p className="mb-2 text-sm text-gray-800">
                          {msg.content.message}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.content.products.map((prod, i) => (
                            <a
                              key={i}
                              href={`/product/${prod.category}/${prod.id}`}
                              className="bg-primary text-white px-3 py-1 text-xs rounded hover:bg-opacity-90"
                            >
                              {prod.name}
                            </a>
                          ))}
                        </div>
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                );
              })}
              {loading && (
                <div className="text-sm text-gray-400">Typing...</div>
              )}
            </div>
            <div className="p-2 border-t flex">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border rounded-md px-2 py-1 text-sm"
                placeholder="Ask something..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 bg-primary text-white px-3 rounded-md text-sm"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerHomePage;
