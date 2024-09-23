import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";
import CreateProductRequestPopup from "./CreateProductRequestPopup";
import ViewOffersPopup from "./ViewOffersPopup";
import ViewProductRequestPopup from "./ViewProductRequestPopup";

const DataTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [viewOffersPopup, setViewOffersPopup] = useState(false);
  const [createProductPopup, setCreateProductPopup] = useState(false);
  const [productRequestsData, setProductRequestsData] = useState([]);
  const [productRequestId, setProductRequestId] = useState("");
  const [reFetch, setReFetch] = useState(false);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewProductRequestPopup, setViewProductRequestPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const FetchProductRequests = () => {
    axios
      .get(`${baseUrl}/product-request/get-all-requests`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("customerToken")}`,
        },
      })
      .then((res) => {
        setProductRequestsData(res?.data?.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setProductRequestsData([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    //  setLoading(false);
    FetchProductRequests();
  }, [reFetch]);

  return (
    <div className="w-[100%]">
      <div className="w-[100%] shadow-cardShadow p-3 rounded-md font-lato">
        {/* HEADING AND ADD BUTTON  */}
        <div className="flex justify-between items-center">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search product request"
            className="flex-1 w-[100%] h-[2.7rem] border-2 border-gray-200 pl-4 pr-4 rounded-md outline-none"
          />
          <button
            onClick={() => setCreateProductPopup(true)}
            className="ml-4 bg-[#3741d8] text-[#ffff] h-[2.5rem] text-xs sm:text-base w-[7rem] sm:min-w-[9rem] rounded-md"
          >
            Create Request
          </button>
        </div>

        {/* TABLE  */}

        {loading ? (
          <h1 className="text-xl font-mont text-center my-4">Loading...</h1>
        ) : productRequestsData && productRequestsData?.length > 0 ? (
          <div className="mt-3 w-full bg-white p-2  overflow-x-scroll overflow-y-auto md:overflow-x-auto font-mont rounded-md">
            <table className="w-full">
              <thead>
                <tr className="">
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Serial Number
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pr-4   text-center font-normal whitespace-nowrap"
                  >
                    ID
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Title
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Description
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
                    Approved Seller
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
                {productRequestsData
                  ?.filter((item) => {
                    return searchValue
                      ? item._id.includes(searchValue) ||
                      item.title.includes(searchValue)
                      : item;
                  })
                  .map((item, index) => {
                    return (
                      <tr key={item?._id}>
                        <td className="pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {index + 1}
                        </td>
                        <td className="pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?._id}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.title.slice(0, 22)}{" "}
                          {item?.title.length > 22 ? "..." : ""}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.description.slice(0, 22)}{" "}
                          {item?.description.length > 22 ? "..." : ""}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.isApproved ? "Approved" : "Not Approved"}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.approvedSeller !== null
                            ? item?.approvedSeller.firstName
                            : "N/A"}
                        </td>
                        <td className="pt-4 pb-4 pl-4 pr-4 text-center whitespace-nowrap flex items-center gap-x-2">
                          <button
                            onClick={() => {
                              setTitle(item?.title);
                              setDescription(item?.description);
                              setViewProductRequestPopup(true);
                            }}
                            className="ml-4 bg-[#3741d8] text-[#ffff] h-[2rem] text-xs sm:text-base w-[7rem]  rounded-md"
                            style={{ fontSize: "12px" }}
                          >
                            View Request
                          </button>

                          {item?.isApproved ? <button
                            disabled
                            className="ml-1 bg-[#3741d8] text-[#ffff] h-[2rem] text-xs sm:text-base w-[7rem] opacity-[0.5]  rounded-md"
                            style={{ fontSize: "12px" }}
                          >
                            Approved
                          </button> : <button
                            onClick={() => {
                              setProductRequestId(item._id);
                              setOffers(item?.offers);
                              setViewOffersPopup(true);
                            }}
                            className="ml-1 bg-[#3741d8] text-[#ffff] h-[2rem] text-xs sm:text-base w-[7rem]  rounded-md"
                            style={{ fontSize: "12px" }}
                          >
                            View Offers
                          </button>}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <h1 className="text-lg font-mont text-center my-4">
            No Product Requests Found
          </h1>
        )}
      </div>

      {/* CREATE PRODUCT POPUP  */}

      {createProductPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <CreateProductRequestPopup
              reFetch={reFetch}
              setReFetch={setReFetch}
              setCreateProductPopup={setCreateProductPopup}
            />
          </div>
        </div>
      )}

      {/* View OFFERS */}

      {viewOffersPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <ViewOffersPopup
              reFetch={reFetch}
              setReFetch={setReFetch}
              productRequestId={productRequestId}
              offers={offers}
              setViewOffersPopup={setViewOffersPopup}
            />
          </div>
        </div>
      )}

      {viewProductRequestPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <ViewProductRequestPopup
              title={title}
              description={description}
              setViewProductRequestPopup={setViewProductRequestPopup}
            />
          </div>
        </div>
      )}

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default DataTable;
