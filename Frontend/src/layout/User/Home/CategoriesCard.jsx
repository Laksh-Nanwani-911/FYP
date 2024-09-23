import React from 'react'
// import ShirtBg from '../../../assets/home/shirt.jpg'
// import MugBg from '../../../assets/home/mugs.jpg'
// import ShoesBg from '../../../assets/home/shoes.jpg'
// import KidsBg from '../../../assets/home/kids.jpg'
// import BagsBg from '../../../assets/home/bags.jpg'
// import AcesoriesBg from '../../../assets/home/accesories.jpg'

const CategoriesCard = () => {
    return (

        <div className='pl-3 pr-3 font-lato pb-10 overflow-x-auto'>

            <div className='flex lg:justify-center items-center gap-x-4 overflow-x-auto'>

                <div data-aos='zoom-in' style={{ backgroundImage: `url(${ShirtBg})` }} className='w-[25rem] min-w-[25rem] bg-center h-[14.5rem] flex justify-end flex-col pl-5 pb-10 rounded-md'>
                    <h1 className='text-xl font-mont font-semibold'>T-Shirts</h1>
                    <p className='text-[#818183] cursor-pointer'>View all</p>
                </div>

                <div data-aos='flip-left' style={{ backgroundImage: `url(${MugBg})` }} className='w-[25rem] min-w-[25rem] bg-center h-[14.5rem] flex justify-end flex-col pl-5 pb-10 rounded-md'>
                    <h1 className='text-xl font-mont font-semibold'>Women</h1>
                    <p className='text-[#818183] cursor-pointer'>View all</p>
                </div>

                <div data-aos='flip-right' style={{ backgroundImage: `url(${ShoesBg})` }} className='w-[25rem] min-w-[25rem] bg-center h-[14.5rem] flex justify-end flex-col pl-5 pb-10 rounded-md'>
                    <h1 className='text-xl font-mont font-semibold'>Shoes</h1>
                    <p className='text-[#818183] cursor-pointer'>View all</p>
                </div>

            </div>



            <div className='flex lg:justify-center items-center gap-x-4 mt-3 overflow-x-auto'>

                <div data-aos='zoom-in' style={{ backgroundImage: `url(${KidsBg})` }} className='w-[25rem] min-w-[25rem] bg-center h-[14.5rem] flex justify-end flex-col pl-5 pb-10 rounded-md'>
                    <h1 className='text-xl font-mont font-semibold'>Kids</h1>
                    <p className='text-[#818183] cursor-pointer'>View all</p>
                </div>

                <div data-aos='flip-left' style={{ backgroundImage: `url(${BagsBg})` }} className='w-[25rem] min-w-[25rem] bg-center h-[14.5rem] flex justify-end flex-col pl-5 pb-10 rounded-md'>
                    <h1 className='text-xl font-mont font-semibold'>Bags</h1>
                    <p className='text-[#818183] cursor-pointer'>View all</p>
                </div>

                <div data-aos='flip-right' style={{ backgroundImage: `url(${AcesoriesBg})` }} className='w-[25rem] min-w-[25rem] bg-center h-[14.5rem] flex justify-end flex-col pl-5 pb-10 rounded-md'>
                    <h1 className='text-xl font-mont font-semibold'>Accesories</h1>
                    <p className='text-[#818183] cursor-pointer'>View all</p>
                </div>

            </div>


        </div>

    )
}

export default CategoriesCard
