import React, { useEffect, useState } from 'react'
import Cards from '../Cards'
import { GiHamburgerMenu } from 'react-icons/gi'
import DataTable from './DataTable'
import axios from 'axios'
import { baseUrl } from '../../../constants/baseUrl'

const Layout = ({ setShowSideNav, showSideNav }) => {
    const [loading, setLoading] = useState(true);
    const [statisticsData, setStatisticsData] = useState({});
    const fetchStatistics = () => {
        axios
            .get(`${baseUrl}/order/get-statistics`, {
                headers: {
                    authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
                },
            })
            .then((res) => {
                setStatisticsData(res?.data?.data);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchStatistics();
    }, []);


    return (

        <div className='bg-[#f1f2f5] w-[100%] pl-4 pr-4 pt-5 pb-10 h-screen font-mont overflow-x-hidden overflow-y-auto'>

            {/* HEADING AND HAMBURGER MENU  */}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg sm:text-2xl font-semibold'>MANAGE <span className='text-[#3741d8]'>YOUR</span> ORDERS !  </h1>
                <GiHamburgerMenu onClick={() => { setShowSideNav(!showSideNav) }} className='md:hidden block text-lg sm:text-2xl cursor-pointer text-[#3741d8]' />
            </div>

            {/* HERO CARDS  */}
            <div className='mt-8 flex gap-x-4 overflow-x-auto m-1'>
                <Cards title="Total Orders" amount={loading ? "Loading..." : statisticsData.totalOrders} />
                <Cards title="Total Placed Orders" amount={loading ? "Loading..." : statisticsData.totalPlacedOrders} />
                <Cards title="Total Inprogress Orders" amount={loading ? "Loading..." : statisticsData.totalInProgressOrders} />
                <Cards title="Total Delivered Orders" amount={loading ? "Loading..." : statisticsData.totalDeliveredOrders} />
            </div>

            {/* PRODUCT DATA TABLE  */}
            <div className='mt-8'>
                <DataTable />
            </div>

        </div>

    )
}

export default Layout
