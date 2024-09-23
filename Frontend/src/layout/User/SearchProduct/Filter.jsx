import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineHeart } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import FiltersideBar from "./FiltersideBar";

const Filter = ({ productData }) => {
  // console.log("productData", productData);
  const [showFilter, setShowFilter] = useState(false);
  const [filterByPrice, setfilterByPrice] = useState("");
  const searchValue = useLocation()
    .search.split("=")[1]
    ?.replaceAll("%20", " ");
  const stars = [1, 2, 3, 4, 5];
  const [product, setProduct] = useState([]);

  const sortProductsByPrice = (sortOrder) => {
    if (filterByPrice !== "") {
      console.log("sortOrder: ", sortOrder);
      const sortedProducts = [...productData].sort((a, b) =>
        sortOrder === "high" ? b.price - a.price : a.price - b.price
      );
      setProduct(sortedProducts);
    } else {
      setProduct(productData);
    }
  };

  useEffect(() => {
    sortProductsByPrice(filterByPrice);
  }, [filterByPrice, showFilter]);

  console.log(product);

  return (
    <div className={`font-lato pl-3 pr-3 pt-5 relative`}>
      <div className="flex gap-x-4 items-center">
        <div
          onClick={() => setShowFilter(!showFilter)}
          className="w-[2rem] h-[2rem] rounded-sm flex justify-center items-center text-white bg-[#6616db] cursor-pointer"
        >
          <GiHamburgerMenu className="text-lg" />
        </div>

        <div>
          <h1 className="text-xl font-mont">
            {searchValue[0].toUpperCase() + searchValue.substring(1)}
          </h1>
        </div>
      </div>

      {/* LISTING  */}

      <div className="mt-6">
        {/* MAIN PRODUCT CARD  */}
        <div
          className={`flex justify-center items-center gap-x-5 flex-wrap mt-10`}
        >
          {product?.length > 0
            ? product
              ?.filter((item, index) => {
                return item.title
                  .toLowerCase()
                  .includes(searchValue.toLowerCase());
              })
              .map((item, index) => {
                return (
                  <Link
                    to={`/user/product/${item?._id}`}
                    key={item?._id + index}
                    className="w-[15rem] min-w-[15rem] h-fit mb-6 "
                  >
                    {/* IMAGE  */}
                    <div className="w-[100%] cursor-pointer h-[20rem] flex justify-center items-center bg-[#e1e1e1] relative">
                      <img
                        src={item?.images && item?.images[0]?.url}
                        alt=""
                        className="h-[fit] w-fit"
                      />
                      {/* <div className="absolute bottom-3 right-2 bg-white w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer">
                        <AiOutlineHeart />
                      </div> */}
                      <div className="absolute bottom-14 right-2 bg-white w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer">
                        <IoCartOutline />
                      </div>
                    </div>

                    {/* TITLE PRICE STARS */}
                    <div className="mt-2">
                      <h1 className="text-sm font-lato font-bold">
                        {item?.title}
                      </h1>
                      {/* <div className="flex items-start mt-1">
                        {stars.map((item) => {
                          return (
                            <FaStar
                              className={`${item <= 4
                                ? "text-[#ffe44a]"
                                : "text-[#737379]"
                                }`}
                              key={item}
                            />
                          );
                        })}
                      </div> */}
                      <h1 className="text-sm font-mont mt-1">
                        Rs: {item?.price}
                      </h1>
                    </div>
                  </Link>
                );
              })
            : <h1>No Search Product Found</h1>}
        </div>
      </div>

      {/* FILTER POPUP  */}

      {showFilter && (
        <div className="absolute top-0 left-0 bg-black bg-opacity-50 w-screen h-[100%] ">
          <div className="flex items-start h-[100%] ">
            <FiltersideBar
              setfilterByPrice={setfilterByPrice}
              closeFilter={setShowFilter}
            />
          </div>
        </div>
      )}
      <div></div>
    </div>
  );
};

export default Filter;
