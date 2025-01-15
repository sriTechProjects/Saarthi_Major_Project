import React from 'react'
import Modal from 'react-modal'
import { Outlet } from 'react-router-dom'
import { HeaderComponent, FooterComponent } from '../utils/resource/ComponentsProvider.util'


const CustomerLayout = () => {
  return (
    <div className="bg-[#efefef]">
      {/* Header Section */}
      <header
        id="header"
        className="h-[12vh] w-full bg-white flex items-center justify-between px-[7vw] relative"
      >
        <HeaderComponent />
      </header>

      <main>
        {<Outlet/>}
      </main>

      {/* footer section */}
      <footer className="w-full h-fit bg-black px-[7vw] py-[7vh]">
        <FooterComponent />
      </footer>
    </div>
  )
}

export default CustomerLayout