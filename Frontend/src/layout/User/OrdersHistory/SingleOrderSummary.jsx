/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const SingleOrderSummary = () => {
    const location = useLocation();
    const item = location.state;
    console.log(item);
    const nav = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className="px-6">
            <h1 className="text-2xl text-center font-bold mt-2 font-popins">
                ORDER SUMMARY
            </h1>

            <div className="flex justify-center md:justify-between items- w-[100%] gap-6 mt-5 md:flex-row flex-col">
                <div className="w-[100%] md:w-[40%]">
                    <div className="w-[100%] p-3 rounded-md shadow-otpShadow mb-4">
                        <h1 className=" font-bold"></h1>
                        <h1 className=" font-bold text-xl mb-6">Shipping Address</h1>
                        <p className="mt-2 font-bold">Street Address*</p>
                        <input
                            name="address"
                            required
                            value={item?.shippingDetails?.address}
                            type="text"
                            disabled
                            className="mt-2 outline-none border border-gray-200 px-3 rounded-md w-[100%] h-[2.2rem]"
                            placeholder="Shipping Address"
                        />
                        <p className="mt-2 font-bold">Country*</p>
                        <input
                            name="country"
                            required
                            value={item?.shippingDetails?.country}
                            type="text"
                            disabled
                            className="mt-2 outline-none border border-gray-200 px-3 rounded-md w-[100%] h-[2.2rem]"
                            placeholder="Shipping Country"
                        />
                        <p className="mt-2 font-bold">City*</p>
                        <input
                            name="city"
                            required
                            value={item?.shippingDetails?.city}
                            type="text"
                            disabled
                            className="mt-2 outline-none border border-gray-200 px-3 rounded-md w-[100%] h-[2.2rem]"
                            placeholder="Shipping City"
                        />

                        <hr className="my-6" />
                        <p className="mt-2 font-bold text-xl">Paymenth Method*</p>
                        <input
                            required
                            value={item?.paymentMode}
                            type="text"
                            disabled
                            className="mt-2 outline-none border border-gray-200 px-3 rounded-md w-[100%] h-[2.2rem]"
                            placeholder="Shipping City"
                        />
                        <hr className="my-6" />
                        <p className="mt-2 font-bold text-xl">Order Status*</p>
                        <input
                            required
                            value={item?.orderStatus}
                            type="text"
                            disabled
                            className="mt-2 outline-none border border-gray-200 px-3 rounded-md w-[100%] h-[2.2rem] mb-10"
                            placeholder="Shipping City"
                        />
                    </div>
                </div>

                <div className="w-[100%] md:w-[35%] md:mb-0 sm:mb-4 mb-[6rem] ">
                    <div className="w-[100%] border  border-gray-200 p-3 rounded-md shadow-otpShadow">
                        <h1 className="font-bold">Order Summary</h1>
                        <div>
                            {item?.items?.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className="mt-4 flex justify-between items-center">
                                            {/* IMAGE AND TITLE  */}
                                            <div className="flex sm:gap-x-3 gap-x-3 items-center w-[20rem] overflow-x-auto">
                                                <img
                                                    src={item?.item?.images[0].url}
                                                    alt=""
                                                    className="sm:w-[5rem] w-[2.5rem] sm:h-[5rem] h-[2.5rem] rounded-md"
                                                />
                                                <div className="flex flex-col w-[20rem]">
                                                    <p className="font-bold text-lg tracking-wide text-slate-600 text-nowrap truncate">
                                                        {item?.item?.title}
                                                    </p>
                                                    <p className="block sm:text-base text-xs tracking-wide text-slate-600 text-nowrap truncate">
                                                        {item?.item?.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* PRICE  */}
                                            <div>
                                                <p className="sm:text-base text-sm">
                                                    Rs {item?.price} × {item?.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-[100%] h-[1px] mt-2 mb-2 bg-gray-200 font-popins "></div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex justify-between items-center">
                            <h1 className="font-bold">Sub Total</h1>
                            <p className="sm:text-base text-sm">Rs {item?.totalAmount}</p>
                        </div>

                        <div className="w-[100%] h-[1px] mt-2 mb-2 bg-gray-200 font-popins "></div>

                        <div className="flex justify-between items-center">
                            <h1 className="font-bold">Total</h1>
                            <p className="sm:text-base text-sm">Rs {item?.totalAmount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOASTER  */}
            <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        </div>
    );
};

export default SingleOrderSummary;
