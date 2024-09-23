import React, { useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { baseUrl } from "../../../constants/baseUrl";
import { Toaster, toast } from "react-hot-toast";

const ViewSingleOfferPopup = ({
  setViewSingleOfferPopup,
  price,
  description,
}) => {
  return (
    <div className="bg-white p-2 sm:w-[50%] md:w-[60%] rounded-md font-mont sm:m-0 m-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">View Offer</h1>
        <ImCross
          onClick={() => setViewSingleOfferPopup(false)}
          className="cursor-pointer"
        />
      </div>

      {/* MAIN INPUT FIELDS  */}
      <div className="mt-3">
        {/* PRODUCT NAME AND DESCRIPTION  */}
        <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-4">
          <input
            style={{ border: "1px solid lightgray" }}
            value={price}
            disabled
            className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
            type="number"
            name="price"
            placeholder="Enter request price"
          />
        </div>

        <div className="sm:mt-3 mt-7">
          <textarea
            style={{ border: "1px solid lightgray" }}
            value={description}
            disabled
            className="outline-none flex-none w-[100%] sm:mb-0  sm:flex-1 h-[13rem] overflow-y-scrol pt-2 pb-2 resize-none rounded-md pl-2 pr-2 placeholder:text-sm"
            type="text"
            name="description"
            placeholder="Enter request description"
          />
        </div>
      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default ViewSingleOfferPopup;
