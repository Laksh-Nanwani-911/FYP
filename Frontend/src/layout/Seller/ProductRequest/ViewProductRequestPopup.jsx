import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { Toaster } from "react-hot-toast";

const ViewProductRequestPopup = ({
  setViewProductRequestPopup,
  productRequest
}) => {
  const [activeTab, setActiveTab] = useState("productRequest");

  return (
    <div className="bg-white p-2 sm:w-[50%] md:w-[60%] rounded-md font-mont sm:m-0 m-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">View Product Request</h1>
        <ImCross
          onClick={() => setViewProductRequestPopup(false)}
          className="cursor-pointer"
        />
      </div>

      {/* Tabs */}
      {productRequest?.customerContactDetails !== null && < div className="mt-4 flex border-b border-gray-200 w-full">
        <button
          className={`px-4 py-2 w-[50%] ${activeTab === "productRequest" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("productRequest")}
        >
          Product Request
        </button>
        <button
          className={`px-4 py-2 w-[50%] ${activeTab === "contactDetails" ? "border-b-2 border-blue-500" : ""}`}
          onClick={() => setActiveTab("contactDetails")}
        >
          Contact Details
        </button>
      </div>}

      {/* View Product Request and Contact Details CODE */}
      {
        activeTab === "productRequest" && (
          <div className="mt-3">
            {/* PRODUCT NAME AND DESCRIPTION */}
            <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-4">
              <input
                style={{ border: "1px solid lightgray" }}
                value={productRequest?.title}
                disabled
                className="outline-none flex-none w-[100%] sm:mb-0 mb-2 sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                type="text"
                name="title"
                placeholder="Enter request title"
              />
            </div>

            <div className="sm:mt-3 mt-7">
              <textarea
                style={{ border: "1px solid lightgray" }}
                value={productRequest?.description}
                disabled
                className="outline-none flex-none w-[100%] sm:mb-0 sm:flex-1 h-[13rem] overflow-y-scroll pt-2 pb-2 resize-none rounded-md pl-2 pr-2 placeholder:text-sm"
                type="text"
                name="description"
                placeholder="Enter request description"
              />
            </div>
          </div>
        )
      }

      {
        activeTab === "contactDetails" && (
          <div className="mt-3">
            {/* CONTACT DETAILS CODE */}
            <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3">
              <input
                style={{ border: "1px solid lightgray" }}
                // onChange={onChangeInput}
                value={productRequest?.customerContactDetails?.whatsApp}
                disabled
                className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                type="text"
                name="whatsApp"
                placeholder="Enter WhatsApp Number"
              />
            </div>

            <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-3">
              <input
                style={{ border: "1px solid lightgray" }}
                // onChange={onChangeInput}
                value={productRequest?.customerContactDetails?.phoneNo}
                disabled
                className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                type="text"
                name="phoneNo"
                placeholder="Enter Phone No"
              />
            </div>
            <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-3">
              <input
                style={{ border: "1px solid lightgray" }}
                // onChange={onChangeInput}
                value={productRequest?.customerContactDetails?.emailAddress}
                disabled
                className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                type="text"
                name="emailAddress"
                placeholder="Enter Email Address"
              />
            </div>
            <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-3">
              <input
                style={{ border: "1px solid lightgray" }}
                // onChange={onChangeInput}
                value={productRequest?.customerContactDetails?.emergencyContactNo}
                disabled
                className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                type="text"
                name="emergencyContactNo"
                placeholder="Enter Emergency Contact No"
              />
            </div>
          </div>
        )
      }

      {/* TOASTER */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div >
  );
};

export default ViewProductRequestPopup;
