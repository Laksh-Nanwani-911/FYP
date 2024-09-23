import React, { useEffect, useRef, useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { baseUrl } from "../../../constants/baseUrl";
import { Toaster, toast } from "react-hot-toast";

const SendOfferPopup = ({
  setSendOfferPopup,
  setReFetch,
  reFetch,
  productRequestId,
}) => {
  const [productDeatls, setProductDeatils] = useState({
    description: "",
    price: "",
  });
  const [loader, setloader] = useState(false);

  const onChangeInput = (e) => {
    setProductDeatils({ ...productDeatls, [e.target.name]: e.target.value });
  };

  const submitData = async () => {
    setloader(true);
    if (!productDeatls.description || !productDeatls.price) {
      setloader(false);
      toast.error("All Fields Are Required");
    } else {
      const bodyData = {
        price: productDeatls.price,
        description: productDeatls.description,
      };

      console.log(bodyData);
      axios
        .post(
          `${baseUrl}/product-request/send-offer/${productRequestId}`,
          bodyData,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setloader(false);
          if (res.data.success) {
            toast.success(res.data.message);
            setTimeout(() => {
              setReFetch(!reFetch);
              setSendOfferPopup(false);
            }, 1500);
          }
          if (!res.data.success) {
            toast.error(res.data.message);
            setTimeout(() => {
              setReFetch(!reFetch);
              setSendOfferPopup(false);
            }, 1500);
          }
        })
        .catch((e) => {
          setloader(false);
          console.log(e);
          toast.error(e.response.data.message);
          setTimeout(() => {
            setReFetch(!reFetch);
            setSendOfferPopup(false);
          }, 1500);
        });
    }
  };

  return (
    <div className="bg-white p-2 sm:w-[50%] md:w-[60%] rounded-md font-mont sm:m-0 m-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">Send Offer</h1>
        <ImCross
          onClick={() => setSendOfferPopup(false)}
          className="cursor-pointer"
        />
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
            name="price"
            placeholder="Enter Price"
          />
        </div>

        <div className="sm:mt-3">
          <textarea
            style={{ border: "1px solid lightgray" }}
            onChange={onChangeInput}
            className="outline-none flex-none w-[100%] sm:mb-0  sm:flex-1 h-[13rem] pt-2 pb-2 resize-none rounded-md pl-2 pr-2 placeholder:text-sm"
            type="text"
            name="description"
            placeholder="Enter Product Description"
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
              {loader ? "Loading ..." : "Send Offer"}
            </button>
          </div>
        </div>
      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default SendOfferPopup;
