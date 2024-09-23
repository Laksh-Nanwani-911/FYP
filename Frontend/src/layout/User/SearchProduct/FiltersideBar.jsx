import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const FiltersideBar = ({ closeFilter, setfilterByPrice }) => {
  const [filterTypes, setFilterTypes] = useState({
    showPrice: false,
    showBestSelling: false,
    showNewest: false,
    showBestRating: false,
  });

  return (
    <div className="bg-[#e6e4e4] p-3 w-[14rem] h-[33.4rem] mt-0 overflow-y-hidden">
      {/* HEADING AND CLOSE ICON  */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-mont font-semibold">Filter Product</h1>
        </div>

        <div
          onClick={() => closeFilter(false)}
          className="w-[1.5rem] h-[1.5rem] rounded-sm flex justify-center items-center text-white bg-[#6616db] cursor-pointer"
        >
          <ImCross className="text-base" />
        </div>
      </div>

      {/* MAIN FILTER  */}
      <div className="mt-10">
        {/* FILTER BY PRICE  */}
        <div className="mb-5">
          <div className="flex justify-between items-center">
            <h1 className="font-mont">Filter By Price</h1>
            <MdOutlineKeyboardArrowDown
              onClick={() => {
                setFilterTypes({
                  ...filterTypes,
                  showPrice: !filterTypes.showPrice,
                });
              }}
              className="text-2xl cursor-pointer"
            />
          </div>
          {filterTypes.showPrice && (
            <div className="w-[100%] h-[1px] bg-gray-300 mt-3 mb-3"></div>
          )}
          {filterTypes.showPrice && (
            <div>
              <h1
                className="font-mont mb-2 cursor-pointer"
                onClick={() => {
                  setfilterByPrice("low"), closeFilter(false);
                }}
              >
                Lowest Price
              </h1>
              <h1
                className="font-mont cursor-pointer"
                onClick={() => {
                  setfilterByPrice("high"), closeFilter(false);
                }}
              >
                Highest Price
              </h1>
            </div>
          )}
        </div>

        {/* FILTER BY SELLING  */}

        {/* <div className='mb-5'>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-mont'>Filter By Selling</h1>
                        <MdOutlineKeyboardArrowDown onClick={() => { setFilterTypes({ ...filterTypes, showBestSelling: !filterTypes.showBestSelling }) }} className='text-2xl cursor-pointer' />
                    </div>
                    {filterTypes.showBestSelling && (<div className='w-[100%] h-[1px] bg-gray-300 mt-3 mb-3'></div>)}
                    {
                        filterTypes.showBestSelling && (
                            <div>
                                <h1 className='font-mont mb-2 cursor-pointer'>Lowest Selling</h1>
                                <h1 className='font-mont cursor-pointer'>Highest Selling</h1>
                            </div>
                        )
                    }
                </div> */}

        {/* FILTER BY RATING  */}
        {/*                 
                <div className='mb-5'>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-mont'>Filter By Rating</h1>
                        <MdOutlineKeyboardArrowDown onClick={() => { setFilterTypes({ ...filterTypes, showBestRating: !filterTypes.showBestRating }) }} className='text-2xl cursor-pointer' />
                    </div>
                    {filterTypes.showBestRating && (<div className='w-[100%] h-[1px] bg-gray-300 mt-3 mb-3'></div>)}
                    {
                        filterTypes.showBestRating && (
                            <div>
                                <h1 className='font-mont mb-2 cursor-pointer'>Lowest Rating</h1>
                                <h1 className='font-mont cursor-pointer'>Highest Rating</h1>
                            </div>
                        )
                    }
                </div> */}

        {/* FILTER BY NEWEST  */}
        {/* <div className='mb-5'>
                    <div className='flex justify-between items-center'>
                        <h1 className='font-mont'>Filter By Rating</h1>
                        <MdOutlineKeyboardArrowDown onClick={() => { setFilterTypes({ ...filterTypes, showNewest: !filterTypes.showNewest }) }} className='text-2xl cursor-pointer' />
                    </div>
                    {filterTypes.showNewest && (<div className='w-[100%] h-[1px] bg-gray-300 mt-3 mb-3'></div>)}
                    {
                        filterTypes.showNewest && (
                            <div>
                                <h1 className='font-mont mb-2 cursor-pointer'>Newest Product</h1>
                                <h1 className='font-mont cursor-pointer'>Oldest Product</h1>
                            </div>
                        )
                    }
                </div> */}
      </div>
    </div>
  );
};

export default FiltersideBar;
