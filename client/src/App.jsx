import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CustomerHomePage from "./pages/customer/CustomerHomePage";
import CustomerLayout from "./layouts/CustomerLayout";
import FormLayout from "./layouts/FormsLayout";

// Import auth components
import LoginForm from "./pages/forms/LoginForm";
import ForgetPassword from "./pages/forms/ForgetPassword";
import VerifyOTP from "./pages/forms/VerifyOTP";
import ResetPassword from "./pages/forms/ResetPassword";
import CustomerRegistration from "./pages/forms/CustomerRegistration";
import SellerRegistration from "./pages/forms/SellerRegistration";
import SellerLayout from "./layouts/SellerLayout";

// Import seller pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerAnalytics from "./pages/seller/SellerAnalytics";

const App = () => {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <CustomerLayout />,
      children: [
        {
          path: "/",
          element: <CustomerHomePage />,
        },
      ],
    },
    // Auth routes
    {
      path: "/auth",
      element: <FormLayout />,
      children: [
        {
          path: "login",
          element: <LoginForm />,
        },
        {
          path: "forget-password",
          element: <ForgetPassword />,
        },
        {
          path: "verify-otp",
          element: <VerifyOTP />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "customer-registration",
          element: <CustomerRegistration />,
        },
        {
          path: "seller-registration",
          element: <SellerRegistration />,
        },
      ],
    },
    // Seller routes
    {
      path: "/seller",
      element: <SellerLayout />,
      children: [
        {
          path: "/seller",
          element: <SellerDashboard />,
        },
        {
          path: "/seller/products",
          element: <SellerProducts />,
        },
        {
          path: "/seller/orders",
          element: <SellerOrders />,
        },
        {
          path: "/seller/analytics",
          element: <SellerAnalytics />,
        }
      ]
    },
  ]);

  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={routes} />
    </>
  );
};

export default App;
