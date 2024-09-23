import React, { useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { baseUrl } from "../../../constants/baseUrl";
import { Toaster, toast } from "react-hot-toast";
import SendContactDetailsPopup from "./SendContactDetailsPopup";
import ViewSingleOfferPopup from "./ViewSingleOfferPopup";

const ViewOffersPopup = ({
  reFetch,
  setReFetch,
  setViewOffersPopup,
  offers,
  productRequestId,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [contactDetailsPopup, setContactDetailsPopup] = useState(false);
  const [offer, setOffer] = useState(null);
  const [loader, setloader] = useState(false);
  const [viewSingleOfferPopup, setViewSingleOfferPopup] = useState(false);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="bg-white p-2 sm:w-[80%] md:w-[80%] rounded-md h-[70vh] font-mont sm:m-0 m-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">View All Offers</h1>
        <ImCross
          onClick={() => setViewOffersPopup(false)}
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
        {offers && offers?.length > 0 ? (
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
                    Price
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
                    Seller
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
                {offers
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
                          {item?.price}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.description.slice(0, 25)}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.status}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.user?.firstName} {item?.user?.lastName}
                        </td>

                        <td className="pt-4 pb-4 pl-4 pr-4 text-center whitespace-nowrap flex items-center justify-center gap-x-2">
                          <button
                            onClick={() => {
                              setPrice(item?.price);
                              setDescription(item?.description);
                              setViewSingleOfferPopup(true);
                            }}
                            className="ml-2 bg-[#3741d8] text-[#ffff] h-[2rem] text-xs sm:text-base w-[5rem]  rounded-md"
                            style={{ fontSize: "10px" }}
                          >
                            View Offer
                          </button>

                          {item?.status !== "REJECTED" && (
                            <>
                              <button
                                onClick={() => {
                                  const bodyData = {
                                    productRequestId: productRequestId,
                                    productRequestOfferId: item._id,
                                    isApproved: false,
                                    status: "REJECTED",
                                    sellerId: null,
                                  };

                                  axios
                                    .patch(
                                      `${baseUrl}/product-request/accept-or-reject-offer`,
                                      bodyData,
                                      {
                                        headers: {
                                          authorization: `Bearer ${localStorage.getItem(
                                            "customerToken"
                                          )}`,
                                        },
                                      }
                                    )
                                    .then((res) => {
                                      console.log(res);
                                      setloader(false);
                                      if (res.data.success) {
                                        toast.success("Offer Rejected");
                                        setReFetch(!reFetch);
                                        setViewOffersPopup(false);
                                      }
                                    })
                                    .catch((e) => {
                                      setloader(false);
                                      console.log(e);
                                      if (!e.response.data.success) {
                                        toast.error(e.response.data.message);
                                      }
                                    });
                                }}
                                className="ml-1 bg-[#3741d8] text-[#ffff] h-[1.8rem] sm:text-base w-[5rem] rounded-md"
                                style={{ fontSize: "11px" }}
                              >
                                {loader ? "Loading..." : "Reject"}
                              </button>
                              <button
                                onClick={() => {
                                  const bodyData = {
                                    productRequestId: productRequestId,
                                    productRequestOfferId: item._id,
                                    isApproved: true,
                                    status: "ACCEPTED",
                                    sellerId: item.user._id,
                                  };

                                  axios
                                    .patch(
                                      `${baseUrl}/product-request/accept-or-reject-offer`,
                                      bodyData,
                                      {
                                        headers: {
                                          authorization: `Bearer ${localStorage.getItem(
                                            "customerToken"
                                          )}`,
                                        },
                                      }
                                    )
                                    .then((res) => {
                                      console.log(res);
                                      setloader(false);
                                      if (res.data.success) {
                                        toast.success("Offer Accepted");
                                        setOffer(item);
                                        setContactDetailsPopup(true);
                                      }
                                    })
                                    .catch((e) => {
                                      setloader(false);
                                      console.log(e);
                                      if (!e.response.data.success) {
                                        toast.error(e.response.data.message);
                                      }
                                    });
                                }}
                                className="ml-1 bg-[#3741d8] text-[#ffff] h-[1.8rem] sm:text-base w-[5rem] text-xs rounded-md"
                                style={{ fontSize: "11px" }}
                              >
                                {loader ? "Loading..." : "Accept"}
                              </button>
                            </>
                          )}
                        </td>
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

      {contactDetailsPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <SendContactDetailsPopup
              reFetch={reFetch}
              setReFetch={setReFetch}
              productRequestId={productRequestId}
              setContactDetailsPopup={setContactDetailsPopup}
              setViewOffersPopup={setViewOffersPopup}
            />
          </div>
        </div>
      )}

      {viewSingleOfferPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <ViewSingleOfferPopup
              price={price}
              description={description}
              setViewSingleOfferPopup={setViewSingleOfferPopup}
            />
          </div>
        </div>
      )}

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default ViewOffersPopup;
