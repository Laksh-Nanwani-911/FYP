import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsCart2, BsHeart } from "react-icons/bs";
import { FaHome, FaProductHunt, FaUser } from "react-icons/fa";
import { HiLogin, HiLogout } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { isUserlogin } from "../../helper/isLogin";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { FaCartFlatbedSuitcase } from "react-icons/fa6";

const Navbar = ({ productData }) => {
  const [searchValue, setSearchValue] = useState("");
  const [showHamburger, setShowHamburger] = useState(false);
  const navigate = useNavigate();
  // CODE FOR CHECKING USER IS LOGIN OR NOT
  const [isLogin, setIsLogin] = useState(true);
  useEffect(() => {
    setIsLogin(isUserlogin());
  }, []);

  const LogoutFunc = () => {
    localStorage.removeItem("customerId");
    localStorage.removeItem("customerToken");
    toast.success("Logout Succesfull");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="p-3 h-[4rem] flex justify-between items-center gap-x-2 shadow-navShadow relative">
      {/* TECH IT LOGO  */}
      <Link to={"/user/home"} className="w-fit">
        <h1 className="text-2xl font-lato pl-5">TechIt</h1>
      </Link>

      {/* SEARCH BAR AND SUGGESTION  */}
      <div className="flex-1 w-[100%] sm:w-[25rem] flex justify-center items-center relative">
        {/* SEARCH BAR AND SEARCH ICON  */}
        <div className="w-[90%] sm:w-[25rem]  relative">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ border: "0.1px solid lightgray" }}
            type="text"
            placeholder="Search Products"
            className="w-[100%] h-[2.3rem] rounded-md pl-3 pr-3 outline-none"
          />
          <AiOutlineSearch className="absolute top-[0.7rem] right-4 cursor-pointer text-gray-600" />
        </div>

        {/* SUGGESTION  */}

        {/* {searchValue.length > 0 && productData?.data?.length !== 0
          ? productData?.data
              ?.filter((item) => {
                console.log(item);
                return (
                  item?.title
                    ?.toLowerCase()
                    .includes(searchValue?.toLowerCase()) ||
                  item?.description
                    ?.toLowerCase()
                    .includes(searchValue?.toLowerCase())
                );
              })
              ?.map((item, index) => {
                return (
                  <div
                    style={{ border: "0.1px solid lightgray" }}
                    className="absolute top-[2.5rem] w-[90%] sm:w-[18rem] pt-1 pb-1 pl-3 pr-3 rounded-md h-[5rem] overflow-y-auto bg-white"
                  >
                    <p
                      onClick={() => {
                        navigate(`/user/product/search?name=${item?.title}`),
                          setSearchValue("");
                      }}
                      className="mb-1 block text-gray-600 text-sm text-ellipsis cursor-pointer "
                    >
                      {item?.title}
                    </p>
                  </div>
                );
              })
          : null} */}

        {searchValue.length > 0 && productData?.data?.length > 0 && (
          <div className="absolute top-[2.5rem] w-[90%] sm:w-[18rem] rounded-md bg-white h-[10rem] overflow-y-auto z-50">
            {productData.data
              .filter((item) => {
                const searchValueLower = searchValue.toLowerCase();
                return (
                  item?.title?.toLowerCase().includes(searchValueLower) ||
                  item?.description?.toLowerCase().includes(searchValueLower)
                );
              })
              .map((item, index) => (
                <div
                  key={index}
                  // style={{ border: "0.1px solid lightgray" }}
                  className="pt-1 pb-1 pl-3 pr-3 h-[2rem] overflow-y-auto"
                >
                  <p
                    onClick={() => {
                      navigate(`/user/product/search?name=${item?.title}`);
                      setSearchValue("");
                    }}
                    className="mb-1 block text-gray-600 text-sm text-ellipsis cursor-pointer p-2"
                  >
                    {item?.title}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ICONS  */}
      <div className="w-fit flex justify-end items-center gap-x-5">
      <div className="cursor-pointer hidden sm:block">
          <FaHome
            className="cursor-pointer text-xl"
            onClick={() => navigate("/user/home")}
          />
        </div>
        <div className="cursor-pointer hidden sm:block">
          <FaCartFlatbedSuitcase
            className="cursor-pointer text-xl"
            onClick={() => navigate("/orders-history")}
          />
        </div>
        <div className="cursor-pointer hidden sm:block">
          <FaProductHunt
            className="cursor-pointer text-xl"
            onClick={() => navigate("/user/product-requests")}
          />
        </div>

        <div className="cursor-pointer hidden sm:block">
          <BsCart2
            onClick={() => navigate("/cart")}
            className="cursor-pointer text-xl"
          />
        </div>

        {/* <div className="cursor-pointer hidden sm:block">
          <BsHeart className="text-lg cursor-pointer" />
        </div> */}

        <div className="cursor-pointer hidden sm:block">
          {isLogin ? (
            <HiLogout className="text-xl cursor-pointer" onClick={LogoutFunc} />
          ) : (
            <HiLogin
              className="text-xl cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}
        </div>

        <div className="cursor-pointer hidden sm:block">
          {isLogin && (
            <FaUser
              onClick={() => navigate("/user/profile")}
              className="text-xl cursor-pointer"
            />
          )}
        </div>

        <div
          className="cursor-pointer sm:hidden block"
          onClick={() => setShowHamburger(!showHamburger)}
        >
          <GiHamburgerMenu className="text-xl cursor-pointer" />
        </div>
      </div>

      {/* RESPONSIVE NAV LINKS  */}

      {showHamburger && (
        <div className="absolute top-[4rem] right-0 shadow-navShadow w-[100%] p-3 block sm:hidden bg-white z-50">
           <div className="cursor-pointer sm:hidden mb-4 flex gap-x-4 items-start">
            <p className=" font-mono font-medium">Home</p>
            <FaHome
              onClick={() => navigate("/user/home")}
              className="cursor-pointer text-xl"
            />
          </div>
          <div className="cursor-pointer sm:hidden mb-4 flex gap-x-4 items-start">
            <p className=" font-mono font-medium">Product Requests</p>
            <FaCartFlatbedSuitcase
              onClick={() => navigate("/orders-history")}
              className="cursor-pointer text-xl"
            />
          </div>

          <div className="cursor-pointer sm:hidden mb-4 flex gap-x-4 items-start">
            <p className=" font-mono font-medium">Product Requests</p>
            <FaProductHunt
              onClick={() => navigate("/user/product-requests")}
              className="cursor-pointer text-xl"
            />
          </div>

          <div className="cursor-pointer sm:hidden mb-4 flex gap-x-4 items-start">
            <p className=" font-mono font-medium">Cart</p>
            <BsCart2
              onClick={() => navigate("/cart")}
              className="cursor-pointer text-xl"
            />
          </div>

          {/* <div className="cursor-pointer sm:hidden mb-4 flex gap-x-4 items-start">
            <p className=" font-mono font-medium">Favourite</p>
            <BsHeart className="cursor-pointer text-xl" />
          </div> */}

          <div className="cursor-pointer sm:hidden block mb-4">
            {isLogin ? (
              <div className="flex gap-x-4 items-start">
                <p className=" font-mono font-medium">Logout</p>
                <HiLogout
                  onClick={LogoutFunc}
                  className="text-xl cursor-pointer"
                />
              </div>
            ) : (
              <div className="flex gap-x-4 items-start">
                <p className=" font-mono font-medium">Login</p>
                <HiLogin
                  onClick={() => navigate("/")}
                  className="text-xl cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="cursor-pointer sm:hidden mb-4">
            {isLogin && (
              <div className="flex gap-x-4 items-start">
                <p className=" font-mono font-medium">Profile</p>
                <FaUser
                  onClick={() => navigate("/user/profile")}
                  className="text-xl cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default Navbar;
