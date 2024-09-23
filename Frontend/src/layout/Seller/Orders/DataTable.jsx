import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";
import { Dropdown, Menu } from "antd";

const DataTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [ordersData, setOrdersData] = useState([]);
  const [reFetch, setReFetch] = useState(false);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  const FetchOrders = () => {
    
    axios
      .get(`${baseUrl}/order/get-all-orders`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
        },
      })
      .then((res) => {
        setOrdersData(res?.data?.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const changeOrderStatus = (id, status) => {

    axios
      .patch(`${baseUrl}/order/update-order-status/${id}`, {
        status: status
      }, { headers: { authorization: `Bearer ${localStorage.getItem("sellerToken")}` } })
      .then((res) => {
        setLoading(true);
        FetchOrders();
        // setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };



  useEffect(() => {
    // setLoading(true);
    FetchOrders();
  }, [reFetch]);

  function formatDate(dateString) {
    // Create a new Date object from the provided date string
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }
  const [selectedTypes, setSelectedTypes] = useState({});
  function handleMenuClick(e, type, index, orderId) {
    // message.info("Click on menu item.");
    setSelectedTypes((prevSelectedTypes) => ({
      ...prevSelectedTypes,
      [index]: type,
    }));
    changeOrderStatus(orderId, type)
    console.log("click", e);
  }


  function formatUnderscoredString(inputString) {
    if (inputString.includes("_")) {
      return inputString
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
    } else {
      return (
        inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
      );
    }
  }
  return (
    <div className="w-[100%]">
      <div className="w-[100%] shadow-cardShadow p-3 rounded-md font-lato">
        {/* HEADING AND ADD BUTTON  */}
        <div className="flex justify-between items-center">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search Product"
            className="flex-1 w-[100%] h-[2.7rem] border-2 border-gray-200 pl-4 pr-4 rounded-md outline-none"
          />
        </div>

        {/* TABLE  */}

        {loading ? (
          <h1 className="text-xl font-mont text-center my-4">Loading...</h1>
        ) : ordersData && ordersData?.length > 0 ? (
          <div className="mt-3 w-full bg-white p-2  overflow-x-scroll overflow-y-auto md:overflow-x-auto font-mont rounded-md">
            <table className="w-full">
              <thead>
                <tr className="">
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pr-4   text-center font-normal whitespace-nowrap"
                  >
                    Order Id
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Total Items
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Order Date
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Order Amount
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Status
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Payment Method
                  </th>

                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="text-center text-sm pl-4 pr-4 font-normal whitespace-nowrap"
                  >
                    Actions
                  </th>


                </tr>
              </thead>

              <tbody>
                {ordersData
                  ?.filter((item) => {
                    return searchValue
                      ? item._id.includes(searchValue) 
                      : item;
                  })
                  .map((item, index) => {
                    return (
                      <tr key={index}
                        onClick={() => {
                          nav("/order-summary", { state: item });
                        }}
                        className="cursor-pointer">
                        <td className="pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?._id}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.items?.length}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {formatDate(item?.createdAt)}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.totalAmount}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {formatUnderscoredString(item?.orderStatus)}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.paymentMode}
                        </td>
                        <td onClick={(e) => e.stopPropagation()} className="pt-4 pb-4 pl-4 pr-4 text-center whitespace-nowrap flex items-center justify-center gap-x-1">
                          <Dropdown.Button



                            overlay={
                              <Menu >
                                <Menu.Item
                                  key="1"
                                  onClick={(e) => {
                                    handleMenuClick(e, "IN PROGRESS", index, item?._id);
                                    // console.log(e);
                                  }}
                                >
                                  In Progress
                                </Menu.Item>
                                <Menu.Item
                                  key="2"

                                  onClick={(e) => {
                                    handleMenuClick(e, "PENDING", index, item?._id);
                                    // console.log(e);
                                  }}
                                >
                                  Pending
                                </Menu.Item>
                                <Menu.Item
                                  key="2"

                                  onClick={(e) => {
                                    handleMenuClick(e, "DELIVERED", index, item?._id);
                                    // console.log(e);
                                  }}
                                >
                                  Delivered
                                </Menu.Item>
                              </Menu>

                            }
                          >
                            {formatUnderscoredString(selectedTypes[index] || item?.orderStatus)}
                          </Dropdown.Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <h1 className="text-xl font-mont text-center my-4">
            No Orders Found
          </h1>
        )}
      </div>


      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default DataTable;
