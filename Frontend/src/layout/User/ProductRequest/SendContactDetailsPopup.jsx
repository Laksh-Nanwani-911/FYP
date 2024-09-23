import React, { useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { baseUrl } from "../../../constants/baseUrl";
import { Toaster, toast } from "react-hot-toast";

const SendContactDetailsPopup = ({
  setContactDetailsPopup,
  productRequestId,
  reFetch,
  setReFetch,
  setViewOffersPopup,
}) => {
  const [contactDetails, setContactDetails] = useState({
    whatsApp: "",
    phoneNo: "",
    emailAddress: "",
    emergencyContactNo: "",
  });
  const [loader, setloader] = useState(false);

  const onChangeInput = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

  const submitData = async () => {
    setloader(true);
    if (
      contactDetails.whatsApp == "" ||
      contactDetails.phoneNo == "" ||
      contactDetails.emailAddress == "" ||
      contactDetails.emergencyContactNo == ""
    ) {
      setloader(false);
      toast.error("All Fields Are Required");
    } else {
      const bodyData = {
        whatsApp: contactDetails.whatsApp,
        phoneNo: contactDetails.phoneNo,
        emailAddress: contactDetails.emailAddress,
        emergencyContactNo: contactDetails.emergencyContactNo,
      };

      console.log(bodyData);
      axios
        .patch(
          `${baseUrl}/product-request/send-customer-contact-details/${productRequestId}`,
          { customerContactDetails: bodyData },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("customerToken")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setloader(false);
          if (res.data.success) {
            toast.success("Customer Contact Details has been sent");
            setReFetch(!reFetch);
            setContactDetailsPopup(false);
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
    }
  };

  return (
    <div className="bg-white p-2 sm:w-[50%] md:w-[30%] rounded-md font-mont sm:m-0 m-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">Send Contact Details</h1>
        {/* <ImCross
                    onClick={() => setContactDetailsPopup(false)}
                    className="cursor-pointer"
                /> */}
      </div>

      {/* MAIN INPUT FIELDS  */}
      <div className="mt-3">
        {/* PRODUCT NAME AND DESCRIPTION  */}
        <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3">
          <input
            style={{ border: "1px solid lightgray" }}
            onChange={onChangeInput}
            className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
            type="text"
            name="whatsApp"
            placeholder="Enter WhatsApp Number"
          />
        </div>

        <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-3">
          <input
            style={{ border: "1px solid lightgray" }}
            onChange={onChangeInput}
            className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
            type="text"
            name="phoneNo"
            placeholder="Enter Phone No"
          />
        </div>
        <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-3">
          <input
            style={{ border: "1px solid lightgray" }}
            onChange={onChangeInput}
            className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
            type="text"
            name="emailAddress"
            placeholder="Enter Email Address"
          />
        </div>
        <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-3">
          <input
            style={{ border: "1px solid lightgray" }}
            onChange={onChangeInput}
            className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
            type="text"
            name="emergencyContactNo"
            placeholder="Enter Emergency Contact No"
          />
        </div>
        {/* SEND DETAILS  */}
        <div
          style={{ border: "1px solid lightgray" }}
          className="rounded-md flex justify-center items-center mt-3 shadow-otpShadow bg-[#4f619f]"
          onClick={submitData}
        >
          <div className="flex justify-center gap-x-3 items-center text-[#eff3fc] cursor-pointer  w-[8rem] sm:w-[10rem] h-[2.1rem] rounded-md">
            <button className="text-sm cursor-pointer">
              {loader ? "Loading ..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default SendContactDetailsPopup;
