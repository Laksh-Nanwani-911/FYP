import React, { useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { baseUrl } from "../constants/baseUrl";

const ViewProductBidsOfferPopup = ({
  reFetch,
  setReFetch,
  setViewProductBidOfferPopup,
  productId,
  token,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [contactDetailsPopup, setContactDetailsPopup] = useState(false);
  const [rejectLoader, setRejectLoader] = useState(false);
  const [acceptLoader, setAcceptLoader] = useState(false);
  const [viewSingleOfferPopup, setViewSingleOfferPopup] = useState(false);
  const [bidData, setBidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidId, setBidId] = useState("");

  const getAllBidOffers = () => {
    axios
      .get(`${baseUrl}/product/bid/get-all-bids/${productId}`, {
        headers: { authorization: `Bearer ${localStorage.getItem(token)}` },
      })
      .then((res) => {
        setBidData(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllBidOffers();
  }, []);

  return (
    <div className="bg-white p-2 sm:w-[80%] md:w-[80%] rounded-md h-[70vh] font-mont sm:m-0 m-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">View All Offers</h1>
        <ImCross
          onClick={() => setViewProductBidOfferPopup(false)}
          className="cursor-pointer"
        />
      </div>

      {/* MAIN INPUT FIELDS  */}
      <div className="mt-3">
        <div className="flex justify-between items-center">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search Product"
            className="flex-1 w-[100%] h-[2.7rem] border-2 border-gray-200 pl-4 pr-4 rounded-md outline-none"
          />
        </div>
        {/* PRODUCT NAME AND DESCRIPTION  */}
        {loading ? (
          <h1 className="text-xl font-mont text-center my-4">Loading...</h1>
        ) : bidData && bidData?.length > 0 ? (
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
                    BidFare
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Notes Description
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

                  {token !== "customerToken" && (
                    <th
                      style={{ borderBottom: "1px solid lightgray" }}
                      className="text-center text-sm pl-4 pr-4 font-normal whitespace-nowrap"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {bidData
                  ?.filter((item) => {
                    return searchValue
                      ? item._id.includes(searchValue) ||
                      item.description.includes(searchValue)
                      : item;
                  })
                  .map((item, index) => {
                    return (
                      <tr key={item?._id}>
                        <td className="pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?._id}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.bidFare}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.notesOrInstruction.slice(0, 25)}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.status}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.user?.firstName} {item?.user?.lastName}
                        </td>
                        {token !== "customerToken" && (
                          <td className="pt-4 pb-4 pl-4 pr-4 text-center whitespace-nowrap flex items-center justify-center gap-x-2">
                            {item?.status == "PLACED" && bidData.some((bid, index) => bid?.status !== "ACCEPTED") && (
                              <>
                                <button
                                  onClick={() => {
                                    setBidId(item?._id);
                                    setRejectLoader(true);
                                    const bodyData = {
                                      productId: productId,
                                      bidId: item?._id,
                                      status: "REJECTED",
                                    };

                                    axios
                                      .post(
                                        `${baseUrl}/product/bid/accept-or-reject-bid`,
                                        bodyData,
                                        {
                                          headers: {
                                            authorization: `Bearer ${localStorage.getItem(
                                              token
                                            )}`,
                                          },
                                        }
                                      )
                                      .then((res) => {
                                        setBidId("");
                                        console.log(res);
                                        setRejectLoader(false);
                                        if (res.data.success) {
                                          toast.success("Offer Rejected");
                                          setReFetch(!reFetch);
                                          setViewProductBidOfferPopup(false);
                                        }
                                      })
                                      .catch((e) => {
                                        setBidId("");
                                        setRejectLoader(false);
                                        console.log(e);
                                        if (!e.response.data.success) {
                                          toast.error(e.response.data.message);
                                        }
                                      });
                                  }}
                                  className="ml-1 bg-[#3741d8] text-[#ffff] h-[1.8rem] sm:text-base w-[5rem] rounded-md"
                                  style={{ fontSize: "11px" }}
                                >
                                  {rejectLoader && bidId == item?._id
                                    ? "Loading..."
                                    : "Reject"}
                                </button>
                                <button
                                  onClick={() => {
                                    setBidId(item?._id);
                                    setAcceptLoader(true);
                                    const bodyData = {
                                      productId: productId,
                                      bidId: item?._id,
                                      status: "ACCEPTED",
                                    };
                                    console.log(localStorage.getItem(token));
                                    axios
                                      .post(
                                        `${baseUrl}/product/bid/accept-or-reject-bid`,
                                        bodyData,
                                        {
                                          headers: {
                                            authorization: `Bearer ${localStorage.getItem(
                                              token
                                            )}`,
                                          },
                                        }
                                      )
                                      .then((res) => {
                                        console.log(res);
                                        setBidId("");
                                        setAcceptLoader(false);
                                        if (res.data.success) {
                                          toast.success("Offer Accepted");
                                          setReFetch(!reFetch);
                                          setViewProductBidOfferPopup(false);
                                        }
                                      })
                                      .catch((e) => {
                                        setBidId("");
                                        setAcceptLoader(false);
                                        console.log(e);
                                        if (!e.response.data.success) {
                                          toast.error(e.response.data.message);
                                        }
                                      });
                                  }}
                                  className="ml-1 bg-[#3741d8] text-[#ffff] h-[1.8rem] sm:text-base w-[5rem] text-xs rounded-md"
                                  style={{ fontSize: "11px" }}
                                >
                                  {acceptLoader && bidId == item?._id
                                    ? "Loading..."
                                    : "Accept"}
                                </button>
                              </>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <h1 className="text-lg font-mont text-center my-4">
            No Offers Found
          </h1>
        )}
      </div>

      {/* SEND CONTACT DETAILS POPUP  */}

      {/* {viewSingleOfferPopup && (
                <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
                    <div className="flex justify-center items-center w-[100%] h-[100%] ">
                        <ViewSingleOfferPopup
                            price={price}
                            description={description}
                            setViewSingleOfferPopup={setViewSingleOfferPopup}
                        />
                    </div>
                </div>
            )} */}

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default ViewProductBidsOfferPopup;
