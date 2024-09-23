import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";
import SendOfferPopup from "./SendOfferPopup";
import ViewMyOfferPopup from "./ViewMyOfferPopup";
import ViewProductRequestPopup from "./ViewProductRequestPopup";

const DataTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [sendOfferPopup, setSendOfferPopup] = useState(false);
  const [viewMyOfferPopup, setViewMyOfferPopup] = useState(false);
  const [productRequestsData, setProductRequestsData] = useState([]);
  const [reFetch, setReFetch] = useState(false);
  const [productRequestId, setProductRequestId] = useState("");
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewProductRequestPopup, setViewProductRequestPopup] = useState(false);
  const [productRequest, setProductRequest] = useState(null);
  const navigate = useNavigate();

  const FetchProductRequests = () => {
    axios
      .get(`${baseUrl}/product-request/get-all-requests`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
        },
      })
      .then((res) => {
        setProductRequestsData(res?.data?.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    // setLoading(true);
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
            placeholder="Search Product"
            className="flex-1 w-[100%] h-[2.7rem] border-2 border-gray-200 pl-4 pr-4 rounded-md outline-none"
          />
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
                    Customer
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
                          {item?._id}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.title.slice(0, 20)}{" "}
                          {item?.title.length > 20 ? "..." : ""}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.description.slice(0, 22)}{" "}
                          {item?.description.length > 22 ? "..." : ""}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.isApproved ? "Approved" : "Not Approved"}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.user.firstName} {item?.user.lastName}
                        </td>
                        <td className="pt-4 pb-4 pl-4 pr-4 text-center whitespace-nowrap flex items-center justify-center gap-x-1">
                          <button
                            onClick={() => {
                              setProductRequest(item);
                              setViewProductRequestPopup(true);
                            }}
                            className="ml-1 bg-[#3741d8] text-[#ffff] h-[1.8rem] sm:text-base w-[5rem] text-xs rounded-md"
                            style={{ fontSize: "10px" }}
                          >
                            View Request
                          </button>
                          {item?.offers.length > 0 &&
                            item?.offers.some(
                              (offer) =>
                                offer.user._id ==
                                localStorage.getItem("sellerId")
                            ) && (
                              <button
                                onClick={() => {
                                  setOffers(item.offers);
                                  setViewMyOfferPopup(true);
                                }}
                                className="ml-1 bg-[#3741d8] text-[#ffff] h-[1.8rem] sm:text-base w-[5.5rem] rounded-md"
                                style={{ fontSize: "10px" }}
                              >
                                View My Offers
                              </button>
                            )}
                          {(item?.offers.some(
                            (offer) =>
                              offer.user._id !==
                              localStorage.getItem("sellerId")
                          ) ||
                            item?.offers.every(
                              (offer) =>
                                offer.user._id ==
                                localStorage.getItem("sellerId") &&
                                offer.status === "REJECTED"
                            )) && !item?.isApproved && (
                              <button
                                onClick={() => {
                                  setProductRequestId(item?._id);
                                  setSendOfferPopup(true);
                                }}
                                className="ml-1 bg-[#3741d8] text-[#ffff] h-[1.8rem] sm:text-base w-[5rem] text-xs rounded-md"
                                style={{ fontSize: "10px" }}
                              >
                                Send Offer
                              </button>
                            )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <h1 className="text-xl font-mont text-center my-4">
            No Product Requests Found
          </h1>
        )}
      </div>

      {/* CREATE PRODUCT POPUP  */}

      {sendOfferPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <SendOfferPopup
              setReFetch={setReFetch}
              reFetch={reFetch}
              setSendOfferPopup={setSendOfferPopup}
              productRequestId={productRequestId}
            />
          </div>
        </div>
      )}

      {viewMyOfferPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <ViewMyOfferPopup
              offers={offers}
              setViewMyOfferPopup={setViewMyOfferPopup}
            />
          </div>
        </div>
      )}

      {viewProductRequestPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <ViewProductRequestPopup
              productRequest={productRequest}
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
