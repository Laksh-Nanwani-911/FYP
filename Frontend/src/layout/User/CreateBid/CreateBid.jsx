import React, { useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { baseUrl } from "../../../constants/baseUrl";
import { Toaster, toast } from "react-hot-toast";

const CreateBid = ({
    setCreateBidPopup,
    setReFetch,
    reFetch,
    productId
}) => {
    const [bidDetails, setbidDeatils] = useState({
        bidFare: "",
        description: "",
    });
    const [loader, setloader] = useState(false);

    const onChangeInput = (e) => {
        setbidDeatils({ ...bidDetails, [e.target.name]: e.target.value });
    };

    const submitData = async () => {
        setloader(true);
        if (!bidDetails.description || !bidDetails.bidFare) {
            setloader(false);
            toast.error("All Fields Are Required");
        } else {
            const bodyData = {
                bidFare: bidDetails.bidFare,
                notesOrInstruction: bidDetails.description
            };

            console.log(bodyData);
            axios
                .post(`${baseUrl}/product/bid/create-bid/${productId}`, bodyData, {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("customerToken")}`,
                    },
                })
                .then((res) => {
                    console.log(res);
                    setloader(false);
                    if (res.status === 201) {
                        toast.success("Offer Created");
                        setTimeout(() => {
                            setReFetch(!reFetch);
                            setCreateBidPopup(false);
                        }, 500);
                    }
                })
                .catch((e) => {
                    setloader(false);
                    console.log(e);
                    if (e.response.status === 400) {
                        toast.error(e.response.data.message);
                    }
                });
        }
    };

    return (
        <div className="bg-white p-2 sm:w-[50%] md:w-[60%] rounded-md font-mont sm:m-0 m-3">
            <div className="flex justify-between items-center">
                <h1 className="text-lg">Create Bid</h1>
                <ImCross
                    onClick={() => setCreateBidPopup(false)}
                    className="cursor-pointer"
                />
            </div>

            {/* MAIN INPUT FIELDS  */}
            <div className="mt-3">
                {/* PRODUCT NAME AND DESCRIPTION  */}
                <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-4">
                    <input
                        style={{ border: "1px solid lightgray" }}
                        onChange={onChangeInput}
                        className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                        type="text"
                        name="bidFare"
                        placeholder="Enter Bid Fare"
                    />
                </div>

                <div className="sm:mt-3 mt-7">
                    <textarea
                        style={{ border: "1px solid lightgray" }}
                        onChange={onChangeInput}
                        className="outline-none flex-none w-[100%] sm:mb-0  sm:flex-1 h-[13rem] overflow-y-scroll	 pt-2 pb-2 resize-none rounded-md pl-2 pr-2 placeholder:text-sm"
                        type="text"
                        name="description"
                        placeholder="Enter Notes Description"
                    />
                </div>
                {/* ADD PRODUCT  */}
                <div
                    style={{ border: "1px solid lightgray" }}
                    className="rounded-md flex justify-center items-center mt-3 shadow-otpShadow bg-[#4f619f]"
                    onClick={submitData}
                >
                    <div className="flex justify-center gap-x-3 items-center text-[#eff3fc] cursor-pointer  w-[8rem] sm:w-[10rem] h-[2.1rem] rounded-md">
                        <button className="text-sm cursor-pointer">
                            {loader ? "Loading ..." : "Create Bid"}
                        </button>
                    </div>
                </div>
            </div>

            {/* TOASTER  */}
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </div>
    );
};

export default CreateBid;
