import React, { useEffect, useState } from 'react'
import ProductImage from '../../../../assets/home/product.jpg'
import ProductImage2 from '../../../../assets/home/product2.jpg'
import { FaStar } from "react-icons/fa";
import { GiHamburgerMenu } from 'react-icons/gi'
import axios from 'axios';
import { baseUrl } from '../../../../constants/baseUrl';
import { useLocation } from 'react-router-dom';

const Layout = ({ setShowSideNav, showSideNav }) => {

    const stars = [1, 2, 3, 4, 5]
    const [productData, setproductData] = useState([])
    const productId = useLocation().pathname.split('/')[4]
    const [imageIndex, setImageIndex] = useState(0)

    const getSingleProduct = () => {
        axios.get(`${baseUrl}/product/get-product/${productId}`, { headers: { authorization: `Bearer ${localStorage.getItem("sellerToken")}` } })
            .then((res) => {
                console.log(res.data.data)
                setproductData(res.data?.data)
            })
    }
    useEffect(() => {
        getSingleProduct()
    }, [])



    return (

        <div className='bg-[#f1f2f5] w-[100%] pl-4 pr-4 pt-5 pb-10 h-screen font-mont overflow-x-hidden overflow-y-auto'>

            {/* HEADING AND HAMBURGER MENU  */}
            <div className='flex justify-between items-center'>
                <h1 className='text-lg sm:text-2xl font-semibold'><span className='text-[#3741d8]'>{productData?.title} !</span> </h1>
                <GiHamburgerMenu onClick={() => { setShowSideNav(!showSideNav) }} className='md:hidden block text-lg sm:text-2xl cursor-pointer text-[#3741d8]' />
            </div>

            {/* MAIN CONTENT  */}

            <div className='p-3 font-lato bg-[#f4f3f4] overflow-y-auto pb-14'>

                {/* MAIN PRODUCT DETAILS  */}
                <div className='flex justify-center items-start gap-x-8 mt-[5rem] lg:flex-row flex-col'>

                    {/* IMAGES  */}

                    <div className='flex justify-center w-[100%] lg:w-fit lg:justify-normal items-start gap-x-5 lg:mb-0 mb-10'>
                        {/* SMALL IMAGES  */}
                        <div>

                            {
                                productData?.images?.map((item, index) => {
                                    return (
                                        <div onClick={()=>setImageIndex(index)} className='bg-[#e1e1e1] cursor-pointer sm:w-[5rem] sm:h-[4rem] w-[3rem] h-[3rem]  flex justify-center items-center mb-4'>
                                            <img src={item?.url} alt="" className='sm:h-[2rem] h-[1rem]' />
                                        </div>

                                    )
                                })
                            }

                        </div>

                        {/* LARGE IMAGE  */}
                        <div className='bg-[#e1e1e1] flex justify-center items-center h-[18rem] p-2'>
                            <img src={productData?.images&& productData?.images[imageIndex]?.url} alt="" className='h-[10rem] w-[20rem]' />
                        </div>

                    </div>

                    {/* DETAILS  */}
                    <div className='flex flex-col justify-start items-start lg:block w-[100%] lg:w-[25rem]'>
                        {/* TITLE  */}
                        <h1 className='font-mono text-xl'>{productData?.title}</h1>
                        {/* PRICE AND DISCOUNTED PRICED  */}
                        <div className='flex gap-x-4 items-start mt-2'>
                            {/* <strike className='font-lato text-xl font-medium'>{productData?.price}</strike> */}
                            <p className='font-lato text-xl font-medium'>Rs {productData?.price}</p>
                        </div>
                        {/* STARS AND RATING  */}
                        <div className='flex gap-x-4 items-start mt-2'>
                            {/* <div className='flex items-start mt-1'>
                                {
                                    stars.map((item) => {
                                        return (
                                            <FaStar className={`${item <= 4 ? "text-[#ffe44a]" : "text-[#737379]"}`} key={item} />
                                        )
                                    })
                                }
                            </div>
                            <div>
                                <p className='text-[#7d7b7d]'>( 1 customer review )</p>
                            </div> */}
                        </div>
                        {/* DESCRIPTION  */}
                        <div className='mt-3'>
                            <p className=' text-sm w-[100%] lg:w-[100%] text-[#7d7b7d]'>{productData?.description}!</p>
                        </div>
                        {/* TAGS  */}
                        <div className='flex gap-x-3 items-center mt-4 cursor-pointer text-sm'>
                            {/* <div>
                                <p>Tags: </p>
                            </div> */}
                            {/* <div className='flex gap-x-3'>
                                <p>Fashion ,</p>
                                <p>Jacket ,</p>
                                <p>Man ,</p>
                                <p>Summer</p>
                            </div> */}
                        </div>

                    </div>


                </div>


            </div>


        </div>
    )
}

export default Layout
