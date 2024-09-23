import React from 'react'
import VanImage from '../../../assets/home/van.png'
import MoneyImage from '../../../assets/home/money.png'
import CustomerServiceImage from '../../../assets/home/customerservice.png'

const Services = () => {
  return (

    <div data-aos='fade-left' className='pl-3 pr-3 pt-6 pb-6 font-lato flex  justify-normal md:justify-center items-center gap-x-4 w-screen overflow-x-auto'>

        <div className='flex items-center gap-x-5 w-[16rem] p-3 min-w-[16rem] '>

            <div>
                <img src={VanImage} alt=""  className='h-[3rem]'/>
            </div>

            <div>
                <h1 className='text-sm font-mont font-semibold'>Fast Shipping</h1>
                <p className='text-[#818183] text-sm'>On all over Pakistan</p>
            </div>
            <div className='w-[2px] h-[5rem] bg-[#c0c0c0] ml-4'></div>
        </div>

        <div className='flex items-center gap-x-5 w-[16rem] p-3 min-w-[16rem] '>

            <div>
                <img src={CustomerServiceImage} alt=""  className='h-[3rem]'/>
            </div>

            <div>
                <h1 className='text-sm font-mont font-semibold'>Dedicated Support</h1>
                <p className='text-[#818183] text-sm'>Quick response 24/7</p>
            </div>
            <div className='w-[2px] h-[5rem] bg-[#c0c0c0] ml-4'></div>
        </div>


        <div className='flex items-center gap-x-5 w-[16rem] p-3 min-w-[16rem] '>

            <div>
                <img src={MoneyImage} alt=""  className='h-[3rem]'/>
            </div>

            <div>
                <h1 className='text-sm font-mont font-semibold'>Money Back Gurantee</h1>
                <p className='text-[#818183] text-sm'>Worry free shopping</p>
            </div>
        </div> 

    </div>


  )
}

export default Services
