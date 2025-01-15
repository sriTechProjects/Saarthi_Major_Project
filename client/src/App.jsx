import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CustomerHomePage from './pages/customer/CustomerHomePage';
import CustomerLayout from './layouts/CustomerLayout';
import FormLayout from './layouts/FormsLayout';

// Import auth components
import LoginForm from './pages/forms/LoginForm';
import ForgetPassword from './pages/forms/ForgetPassword';
import VerifyOTP from './pages/forms/VerifyOTP';
import ResetPassword from './pages/forms/ResetPassword';
import CustomerRegistration from './pages/forms/CustomerRegistration';


const App = () => {
  const routes = createBrowserRouter([
    { 
      path: "/", 
      element: <CustomerLayout/>, 
      children: [{
        path: "/", 
        element: <CustomerHomePage/>
      }]
    },
    // Auth routes
    {
      path: "/auth",
      element: <FormLayout/>,
      children: [
        {
          path: "login",
          element: <LoginForm />
        },
        {
          path: "forget-password",
          element: <ForgetPassword />
        },
        {
          path: "verify-otp",
          element: <VerifyOTP />
        },
        {
          path: "reset-password",
          element: <ResetPassword />
        },
        {
          path: "customer-registration",
          element: <CustomerRegistration />
        }
      ]
    }
  ])

  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={routes} />
    </>
  )
}

export default App