import React, { useEffect, useState } from "react";
import Cards from "../Cards";
import { GiHamburgerMenu } from "react-icons/gi";
import DataTable from "./DataTable";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";

const Layout = ({ setShowSideNav, showSideNav }) => {
  const [analytics, setAnalytics] = useState(null);
  const [reFetch, setReFetch] = useState(false);
  const [updated, setUpdated] = useState(true);

  const FetchAnalytics = () => {
    axios
      .get(`${baseUrl}/admin/get-dashboard-statistics`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => {
        setAnalytics(res?.data?.data);
        // console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    FetchAnalytics();
  }, [updated]);
  return (
    <>
      {analytics !== null && <div className="bg-[#f1f2f5] w-[100%] pl-4 pr-4 pt-5 pb-10 h-screen font-mont overflow-x-hidden overflow-y-auto">
        {/* HEADING AND HAMBURGER MENU  */}
        <div className="flex justify-between items-center">
          <h1 className="text-lg sm:text-2xl font-semibold">ALL SELLERS </h1>
          <GiHamburgerMenu
            onClick={() => {
              setShowSideNav(!showSideNav);
            }}
            className="md:hidden block text-lg sm:text-2xl cursor-pointer text-[#3741d8]"
          />
        </div>

        {/* HERO CARDS  */}
        <div className="mt-8 flex gap-x-4 overflow-x-auto m-1">
          <Cards title="Total Sellers" amount={analytics?.totalSellers} />
          <Cards title="Approved Sellers" amount={analytics?.totalApprovedSellers} />
          <Cards title="Active Sellers" amount={analytics?.totalActiveSellers} />
          <Cards title="In Active Sellers" amount={analytics?.totalInActiveSellers} />
        </div>

        {/* PRODUCT DATA TABLE  */}
        <div className="mt-8">
        <DataTable updated={updated} setUpdated={setUpdated} />
        </div>
      </div>}
    </>
  );
};

export default Layout;
