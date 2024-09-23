import React, { useEffect, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import SellerProfile from './SellerProfile'

const Layout = ({ setShowSideNav, showSideNav }) => {


    return (

        <div className='bg-[#f1f2f5] w-[100%] pl-4 pr-4 pt-5 pb-10 h-screen font-mont overflow-x-hidden overflow-y-auto'>

            {/* HEADING AND HAMBURGER MENU  */}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg sm:text-2xl font-semibold'>MANAGE <span className='text-[#3741d8]'>YOUR</span> PROFILE !  </h1>
                <GiHamburgerMenu onClick={() => { setShowSideNav(!showSideNav) }} className='md:hidden block text-lg sm:text-2xl cursor-pointer text-[#3741d8]' />
            </div>


            {/* PRODUCT DATA TABLE  */}
            <div className='mt-8'>
                <SellerProfile />
            </div>

        </div>

    )
}

export default Layout
