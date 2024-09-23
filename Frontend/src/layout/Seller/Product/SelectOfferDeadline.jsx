import { ImCross } from "react-icons/im";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

const SelectOfferDeadline = ({
  setOpenPopupForSelectDate,
  isOpenPopupForSelectDate,
  onChange,
  date,
  setDate,
  productId,
  productStatus,
}) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleOkClick = () => {
    console.log("date", date);
    if (date !== "") {
      onChange(productStatus, productId);
    }
    setOpenPopupForSelectDate(false);
  };
  return (
    <div className="bg-white p-2 sm:w-[50%] md:w-[30%] rounded-md font-mont sm:m-0 m-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">Select Offer Deadline</h1>
        <ImCross
          onClick={() => setOpenPopupForSelectDate(false)}
          className="cursor-pointer"
        />
      </div>

      {/* MAIN INPUT FIELDS  */}
      <div className="mt-3">
        {/* PRODUCT NAME AND DESCRIPTION  */}
        <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3">
          <input
            style={{ border: "1px solid lightgray" }}
            onChange={(e) => setDate(e.target.value)}
            className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
            type="date"
            name="Date"
          />
        </div>

        {/* Select Date  */}
        <div
          style={{ border: "1px solid lightgray" }}
          className="rounded-md flex justify-center items-center mt-3 shadow-otpShadow bg-[#4f619f]"
          onClick={handleOkClick}
        >
          <div className="flex justify-center gap-x-3 items-center text-[#eff3fc] cursor-pointer  w-[8rem] sm:w-[10rem] h-[2.1rem] rounded-md">
            <button className="text-sm cursor-pointer">OK</button>
          </div>
        </div>
      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default SelectOfferDeadline;
