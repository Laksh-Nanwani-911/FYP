import React, { useEffect, useState } from "react";
import ProductImage from "../../../assets/home/product.jpg";
import ProductImage2 from "../../../assets/home/product2.jpg";
import { AiOutlineHeart } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { MdDoubleArrow, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { baseUrl } from "../../../constants/baseUrl";
import axios from "axios";

const Comaprison = () => {
  const productCount = [1, 2];
  const stars = [1, 2, 3, 4, 5];
  const [productOneData, setproductOneData] = useState([]);
  const [productTwoData, setproductTwoData] = useState([]);

  const p1Id = useLocation().pathname.split("/")[4];
  const p2Id = useLocation().pathname.split("/")[6];

  const getSingleProduct = () => {
    axios.get(`${baseUrl}/product/get-product/${p1Id}`).then((res) => {
      console.log(res.data.data, "p1");
      setproductOneData(res.data?.data);
    });

    axios.get(`${baseUrl}/product/get-product/${p2Id}`).then((res) => {
      console.log(res.data.data, "p2");
      setproductTwoData(res.data?.data);
    });
  };
  useEffect(() => {
    getSingleProduct();
  }, []);

  return (
    <div className={`font-lato pl-3 pr-3 pt-5 relative`}>
      <div className="">
        <h1 className="text-xl font-mont">Compare Product</h1>
      </div>

      {/* LISTING  */}

      <div className="mt-[10rem] sm:mt-5 flex justify-center ">
        {/* MAIN PRODUCT CARD  */}
        <div className={`flex justify-center items-center flex-wrap mt-10`}>
          <Link
            to={`/user/product/${productOneData?._id}`}
            className="sm:w-[15rem] sm:min-w-[15rem]  w-[8rem] min-w-[8rem] h-fit mb-6 "
          >
            {/* IMAGE  */}
            <div className="sm:w-[100%]  sm:h-[15rem] h-[10rem] w-[8rem] bg-[#e1e1e1]  cursor-pointer flex justify-center items-center relative">
              <img
                src={productOneData?.images && productOneData?.images[0]?.url}
                alt=""
                className="h-[100%] sm:h-[90%]"
              />
              <div className="absolute bottom-3 right-1 sm:right-3 bg-white w-[1.5rem] sm:w-[2rem] h-[1.5rem] sm:h-[2rem] rounded-full flex justify-center items-center cursor-pointer">
                <AiOutlineHeart />
              </div>
              <div className="absolute bottom-14 right-1 sm:right-3 bg-white w-[1.5rem] sm:w-[2rem] h-[1.5rem] sm:h-[2rem] rounded-full flex justify-center items-center cursor-pointer">
                <IoCartOutline />
              </div>
            </div>

            {/* TITLE PRICE STARS */}
            <div className="mt-2">
              <h1 className="text-sm font-lato font-bold mb-5">
                {productOneData?.title}
              </h1>

              <h1 className="text-sm font-lato font-normal mb-6">
                {productOneData?.description === ""
                  ? "Description not availanble"
                  : productOneData?.description}
              </h1>

              {/* <div className="flex items-start mt-2">
                {stars.map((item) => {
                  return (
                    <FaStar
                      className={`${
                        item <= 4 ? "text-[#ffe44a]" : "text-[#737379]"
                      }`}
                      key={item}
                    />
                  );
                })}
              </div> */}
              <h1 className="text-sm font-mont mt-2">
                Rs: {productOneData?.price}
              </h1>
            </div>
          </Link>

          {/* ARROW ICON  */}
          <div className="mt-[-7rem] ml-4 mr-4">
            <MdDoubleArrow className="text-3xl" />
          </div>

          <Link
            to={`/user/product/${productTwoData?._id}`}
            className="sm:w-[15rem] sm:min-w-[15rem] w-[8rem] min-w-[8rem] h-fit mb-6 "
          >
            {/* IMAGE  */}
            <div className="sm:w-[100%]  sm:h-[15rem] h-[10rem] w-[8rem] bg-[#e1e1e1]  cursor-pointer flex justify-center items-center relative">
              <img
                src={productTwoData?.images && productTwoData?.images[0]?.url}
                alt=""
                className="h-[100%] sm:h-[90%]"
              />
              <div className="absolute bottom-3 right-1 sm:right-3 bg-white w-[1.5rem] sm:w-[2rem] h-[1.5rem] sm:h-[2rem] rounded-full flex justify-center items-center cursor-pointer">
                <AiOutlineHeart />
              </div>
              <div className="absolute bottom-14 right-1 sm:right-3 bg-white w-[1.5rem] sm:w-[2rem] h-[1.5rem] sm:h-[2rem] rounded-full flex justify-center items-center cursor-pointer">
                <IoCartOutline />
              </div>
            </div>

            {/* TITLE PRICE STARS */}
            <div className="mt-2">
              <h1 className="text-sm font-lato font-bold mb-5">
                {productTwoData?.title}
              </h1>
              <h1 className="text-sm font-lato font-normal mb-6">
                {productTwoData?.description === ""
                  ? "Description not availanble"
                  : productTwoData?.description}
              </h1>

              {/* <div className="flex items-start mt-2">
                {stars.map((item) => {
                  return (
                    <FaStar
                      className={`${
                        item <= 4 ? "text-[#ffe44a]" : "text-[#737379]"
                      }`}
                      key={item}
                    />
                  );
                })}
              </div> */}
              <h1 className="text-sm font-mont mt-2">
                Rs: {productTwoData?.price}
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Comaprison;
