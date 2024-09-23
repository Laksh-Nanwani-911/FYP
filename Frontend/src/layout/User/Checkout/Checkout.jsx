/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";
import { clear } from "../../../store/slices/cart";

const Checkout = () => {
    const token = localStorage.getItem("customerToken");
    const customerId = localStorage.getItem("customerId")
    const products = useSelector((state) => state.cart);
    console.log("products", products);
    const [orderData, setOrderData] = useState({
        customer: customerId,
        address: "",
        country: "",
        city: "",
    });
    const nav = useNavigate();
    const dispatch = useDispatch();
    const onChangeInput = (e) => {
        setOrderData({ ...orderData, [e.target.name]: e.target.value });
    };

    var totalAmount = products.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
    );
    console.log("totalAmount", totalAmount);
    const onSubmit = (e, payment_method) => {
        e.preventDefault();
        setLoading(true)
        console.log("products", products);
        const items = products.map((product) => ({
            item: product._id,
            quantity: product.quantity,
            price: product.price * product.quantity,
        }));
        if (
            orderData.address !== "" &&
            orderData.city != "" &&
            orderData.country !== ""
        ) {
            let updatedBody = {

                shippingDetails: {
                    address: orderData.address,
                    country: orderData.country,
                    city: orderData.city,
                },
                items: items,
                seller: products[0].sellerId?._id,
                customer: orderData.customer,
                totalAmount: totalAmount,
            };
            axios
                .post(`${baseUrl}/order/create-new-order`, updatedBody, {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    console.log(res.data, "create order response");
                    toast.success("Order has been Placed");
                    dispatch(clear());

                });
            nav("/orders-history");
        } else {
            toast.error("Address , City , Country is Required");
        }
    };

    const [loading, setLoading] = useState(false);



    return (
        <div className="px-6">
            <h1 className="text-2xl text-center font-bold mt-2 font-popins">
                CHECKOUT
            </h1>

            <div className="flex justify-center md:justify-between items- w-[100%] gap-6 mt-5 md:flex-row flex-col">
                <div className="w-[100%] md:w-[40%]">
                    <div className="w-[100%] p-3 rounded-md shadow-otpShadow mb-4">
                        <h1 className=" font-bold">Shipping Address</h1>
                        <p className="mt-2">Street Address*</p>
                        <input
                            name="address"
                            required
                            onChange={(e) => {
                                onChangeInput(e);
                            }}
                            type="text"
                            className="mt-2 outline-none border border-gray-200 px-3 rounded-md w-[100%] h-[2.2rem]"
                            placeholder="Shipping Address"
                        />
                        <p className="mt-2">Country*</p>
                        <input
                            name="country"
                            required
                            onChange={(e) => {
                                onChangeInput(e);
                            }}
                            type="text"
                            className="mt-2 outline-none border border-gray-200 px-3 rounded-md w-[100%] h-[2.2rem]"
                            placeholder="Shipping Country"
                        />
                        <p className="mt-2">City*</p>
                        <input
                            name="city"
                            required
                            onChange={(e) => {
                                onChangeInput(e);
                            }}
                            type="text"
                            className="mt-2 outline-none border border-gray-200 px-3 rounded-md w-[100%] h-[2.2rem]"
                            placeholder="Shipping City"
                        />
                    </div>

                    <div className="w-[100%] p-3 rounded-md shadow-otpShadow mb-4">
                        <h1 className=" font-bold mt-2 mb-2">Payment Method</h1>
                        <div className="flex justify-between">
                            <button
                                onClick={(e) => onSubmit(e, "")}
                                className={`w-[48%] h-[2.2rem] bg-[#3b5877] shadow-otpShadow text-white rounded-md`}
                            >
                                Cash On Delivery
                            </button>
                        </div>

                    </div>
                </div>

                <div className="w-[100%] md:w-[35%] md:mb-0 sm:mb-4 mb-[6rem] ">
                    <div className="w-[100%] border  border-gray-200 p-3 rounded-md shadow-otpShadow">
                        <h1 className="font-bold">Order Summary</h1>
                        <div>
                            {products?.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <div className="mt-4 flex justify-between items-center">
                                            {/* IMAGE AND TITLE  */}
                                            <div className="flex sm:gap-x-3 gap-x-3 items-center w-[20rem] overflow-x-auto">
                                                <img
                                                    src={item?.images[0].url}
                                                    alt=""
                                                    className="sm:w-[5rem] w-[2.5rem] sm:h-[5rem] h-[2.5rem] rounded-md"
                                                />
                                                <div className="flex flex-col w-[20rem]">
                                                    <p className="font-bold text-lg tracking-wide text-slate-600 text-nowrap truncate">
                                                        {item?.title}
                                                    </p>
                                                    <p className="block sm:text-base text-xs tracking-wide text-slate-600 text-nowrap truncate">
                                                        {item?.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* PRICE  */}
                                            <div>
                                                <p className="sm:text-base text-sm">
                                                    Rs {item?.price * item?.quantity} × {item?.quantity}
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
                            <p className="sm:text-base text-sm">
                                Rs{" "}
                                {products?.reduce(
                                    (total, item) => total + item.price * item.quantity,
                                    0
                                )}
                            </p>
                        </div>

                        <div className="w-[100%] h-[1px] mt-2 mb-2 bg-gray-200 font-popins "></div>

                        <div className="flex justify-between items-center">
                            <h1 className="font-bold">Total</h1>
                            <p className="sm:text-base text-sm">
                                Rs{" "}
                                {products?.reduce(
                                    (total, item) => total + item.price * item.quantity,
                                    0
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TOASTER  */}
            <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        </div>
    );
};

export default Checkout;
