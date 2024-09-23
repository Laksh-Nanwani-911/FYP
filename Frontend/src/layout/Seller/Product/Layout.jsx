import React from 'react'
import Cards from '../Cards'
import {GiHamburgerMenu} from 'react-icons/gi'
import DataTable from './DataTable'

const Layout = ({ setShowSideNav, showSideNav }) => {

    return (

        <div className='bg-[#f1f2f5] w-[100%] pl-4 pr-4 pt-5 pb-10 h-screen font-mont overflow-x-hidden overflow-y-auto'>

            {/* HEADING AND HAMBURGER MENU  */}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg sm:text-2xl font-semibold'>MANAGE <span className='text-[#3741d8]'>YOUR</span> PRODUCTS !  </h1>
                <GiHamburgerMenu onClick={() => { setShowSideNav(!showSideNav) }} className='md:hidden block text-lg sm:text-2xl cursor-pointer text-[#3741d8]' />
            </div>

            {/* HERO CARDS  */}
            {/* <div className='mt-8 flex gap-x-4 overflow-x-auto m-1'>
                <Cards title="Total Sale" amount="1000000" />
                <Cards title="Total Profit" amount="100000" />
                <Cards title="Total Customers" amount="87" />
                <Cards title="Total Products" amount="40" />
            </div> */}

            {/* PRODUCT DATA TABLE  */}
            <div className='mt-8'>
                <DataTable/>
            </div>

        </div>

    )
}

export default Layout
