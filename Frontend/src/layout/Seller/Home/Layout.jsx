import React, { useEffect, useState } from 'react'
import {GiHamburgerMenu} from 'react-icons/gi'
import Cards from '../Cards'
import Chart from './Chart'
import axios from 'axios'

import {baseUrl} from '../../../constants/baseUrl'

const Layout = ({setShowSideNav,showSideNav}) => {

  const [profileData, setprofileData] = useState([])

  const getSellerProfile = ()=>{
    axios.get(`${baseUrl}/user/get-profile`,{headers:{authorization:`Bearer ${localStorage.getItem("sellerToken")}`}})
    .then((res)=>{setprofileData(res.data?.data)})
    .catch((e)=>{console.log(e)})
  }
  useEffect(()=>{getSellerProfile()},[])
  return (

    <div className='bg-[#f1f2f5] w-[100%] pl-4 pr-4 pt-5 pb-10 h-screen font-mont overflow-x-auto overflow-y-auto'>

      {/* HEADING AND HAMBURGER MENU  */}
      <div className='flex justify-between items-center'>
        <h1 className='text-lg sm:text-2xl font-semibold'>WELCOME <span className='text-[#3741d8]'>BACK</span> {profileData?.firstName} !  </h1>
        <GiHamburgerMenu onClick={()=>{setShowSideNav(!showSideNav)}} className='md:hidden block text-lg sm:text-2xl cursor-pointer text-[#3741d8]'/>
      </div>


      {/* HERO CARDS  */}
      <div className='mt-8 flex gap-x-4 overflow-x-auto m-1'>
        <Cards title="Total Sale" amount="1000000"/>
        <Cards title="Total Profit" amount="100000"/>
        <Cards title="Total Customers" amount="87"/>
        <Cards title="Total Products" amount="40"/>
      </div>

      {/* CHARTS  */}
      <div className='mrl-2 ml-2'>
        <Chart/>
      </div>


    </div>
  )
}

export default Layout
