import React from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import CustomerHomePage from './pages/customer/CustomerHomePage';
import CustomerLayout from './layouts/CustomerLayout';

const App = () => {

  const routes = createBrowserRouter([
    { 
      path: "/", 
      element: <CustomerLayout/>, 
      children: [{
        path: "/", element: <CustomerHomePage/>
      }]
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