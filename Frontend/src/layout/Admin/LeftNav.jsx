import React from "react";
import { ImCross } from "react-icons/im";
import { MdDashboardCustomize } from "react-icons/md";
import { BsBarChartFill, BsPersonFill } from "react-icons/bs";
import { TbDiscount, TbReportAnalytics } from "react-icons/tb";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { IoMail } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const LeftNav = ({ setShowSideNav, showSideNav }) => {
  const navigate = useNavigate();

  const LogoutFunc = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    toast.success("Logout Succesfull");
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="h-[100%]">
      {/* WITHOUT RESPONSIVE  */}

      <div className="w-[13rem] h-[100%] hidden md:block font-lato bg-[#3741d8] pt-5 pb-10 relative overflow-y-auto">
        {/* HEADING / LOGO  */}
        <div className=" text-[#ffff] ml-0 mr-4 flex justify-center items-center">
          <h1 className="text-2xl font-bold font-mono">TechIt</h1>
        </div>

        {/* MAIN LINKS  */}

        <div className="mt-6 ml-4 mr-4">
          <div className="mt-4">
            <h1 className="text-[#ffff] font-bold tracking-wider mb-2">
              Management
            </h1>
            <div
              onClick={() => navigate("/admin/sellers")}
              className="hover:bg-[#6970e2] hover:text-white text-[#ffff] h-[2rem] mb-2 rounded-sm cursor-pointer flex justify-start gap-3 pl-2 items-center"
            >
              <BsPersonFill className="" />
              <p className="text-sm cursor-pointer tracking-wide">Sellers</p>
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-[#ffff] text-base font-bold tracking-wider mb-2">
              Account
            </h1>
            {/* <div className="hover:bg-[#6970e2] hover:text-white text-[#ffff] h-[2rem] mb-2 rounded-sm cursor-pointer flex justify-start gap-3 pl-2 items-center">
              <BsPersonFill className="" />
              <p className="text-sm cursor-pointer tracking-wide">Profile</p>
            </div> */}

            <div
              onClick={LogoutFunc}
              className="hover:bg-[#6970e2] hover:text-white text-[#ffff] h-[2rem] mb-2 rounded-sm cursor-pointer flex justify-start gap-3 pl-2 items-center"
            >
              <IoMail className="" />
              <p className="text-sm cursor-pointer tracking-wide">Logout</p>
            </div>
          </div>
        </div>
      </div>

      {/* WITH RESPONSIVE  */}

      <div className="h-[100%] block md:hidden">
        {showSideNav && (
          <div className="w-[13rem] h-[100%] overflow-y-auto block md:hidden font-lato bg-[#3741d8] pt-5 pb-10 absolute top-0 left-0 z-50">
            {/* HEADING / LOGO  */}
            <div className=" text-[#ffff] ml-4 mr-4 flex justify-between items-center">
              <h1 className="text-xl font-bold font-mono">TechIt</h1>
              <ImCross
                className="cursor-pointer"
                onClick={() => setShowSideNav(false)}
              />
            </div>

            <div className="mt-6 ml-4 mr-4">
              <div className="mt-4">
                <h1 className="text-[#ffff] font-bold tracking-wider mb-2">
                  Management
                </h1>
                <div
                  onClick={() => navigate("/admin/sellers")}
                  className="hover:bg-[#6970e2] hover:text-white text-[#ffff] h-[2rem] mb-2 rounded-sm cursor-pointer flex justify-start gap-3 pl-2 items-center"
                >
                  <BsPersonFill className="" />
                  <p className="text-sm cursor-pointer tracking-wide">
                    Sellers
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h1 className="text-[#ffff] text-base font-bold tracking-wider mb-2">
                  Account
                </h1>
                <div className="hover:bg-[#6970e2] hover:text-white text-[#ffff] h-[2rem] mb-2 rounded-sm cursor-pointer flex justify-start gap-3 pl-2 items-center">
                  <BsPersonFill className="" />
                  <p className="text-sm cursor-pointer tracking-wide">
                    Profile
                  </p>
                </div>

                <div
                  onClick={LogoutFunc}
                  className="hover:bg-[#6970e2] hover:text-white text-[#ffff] h-[2rem] mb-2 rounded-sm cursor-pointer flex justify-start gap-3 pl-2 items-center"
                >
                  <IoMail className="" />
                  <p className="text-sm cursor-pointer tracking-wide">Logout</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default LeftNav;
