import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";

const DataTable = ({ updated, setUpdated }) => {
  const [searchValue, setSearchValue] = useState("");
  const [createProductPopup, setCreateProductPopup] = useState(false);
  const [updateProductPopup, setUpdateProductPopup] = useState(false);
  const [sellersData, setsellersData] = useState([]);
  const [reFetch, setReFetch] = useState(false);
  // const [proudctIds, setProductId] = useState("");
  // const [item, setItem] = useState("");
  const navigate = useNavigate();

  const sellerApproved = (id) => {
    axios
      .patch(
        `${baseUrl}/admin/change-seller-account-status/${id}`,
        {
          isApproved: true,
          isActive: true,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      )
      .then((res) => {
        // console.log(res);
        toast.success("Seller Approved");
        setUpdated((prev) => !prev); // Toggle the updated state
        setReFetch(!reFetch);
      })
      .catch((e) => {
        console.log(e);
        if (e) {
          toast.error("Something Went Wrong");
        }
      });
  };

  const activateOrDeactivate = (id, isActive) => {
    axios
      .patch(
        `${baseUrl}/admin/change-seller-account-status/${id}`,
        {
          isApproved: true,
          isActive: isActive,
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      )
      .then((res) => {
        // console.log(res);
        toast.success(!isActive ? "Seller Deactivated" : "Seller Activated");
        setUpdated((prev) => !prev); // Toggle the updated state
        setReFetch(!reFetch);
      })
      .catch((e) => {
        console.log(e);
        if (e) {
          toast.error("Something Went Wrong");
        }
      });
  };

  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeSellerId, setRemoveSellerId] = useState("");

  const removeSeller = (id) => {
    setRemoveLoading(true);
    axios
      .delete(`${baseUrl}/admin/delete-or-remove-seller/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => {
        // console.log(res);
        toast.success("Seller Removed");
        setUpdated((prev) => !prev); //   Toggle the updated state
        setReFetch(!reFetch);
        setRemoveSellerId("");
        setRemoveLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setRemoveLoading(false);
        setRemoveSellerId("");
        if (e) {
          toast.error("Something Went Wrong");
        }
      });
  };

  const FetchSellers = () => {
    axios
      .get(`${baseUrl}/admin/get-all-sellers`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => {
        setsellersData(res?.data?.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    FetchSellers();
  }, [reFetch]);

  return (
    <div className="w-[100%]">
      <div className="w-[100%] shadow-cardShadow p-3 rounded-md font-lato">
        {/* HEADING AND ADD BUTTON  */}
        <div className="flex justify-between items-center">
          {/* <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search Seller"
            className="flex-1 w-[100%] h-[2.7rem] border-2 border-gray-200 pl-4 pr-4 rounded-md outline-none"
          /> */}
          {/* <button onClick={() => setCreateProductPopup(true)} className='ml-4 bg-[#3741d8] text-[#ffff] h-[2.5rem] text-xs sm:text-base w-[7rem] sm:min-w-[9rem] rounded-md'>Add Product</button> */}
        </div>

        {/* TABLE  */}

        {sellersData && sellersData?.length > 0 ? (
          <div className="mt-3 w-full bg-white p-2  overflow-x-scroll overflow-y-auto md:overflow-x-auto font-mont rounded-md">
            <table className="w-full">
              <thead>
                <tr className="">
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    ID
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    First Name
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Last Name
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Email Address
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Phone No
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Store
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="text-center text-sm pl-2 pr-4 font-normal whitespace-nowrap"
                  >
                    Account Status
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
                {sellersData
                  // ?.filter((item) => {
                  //   return searchValue
                  //     ? item._id.includes(searchValue) ||
                  //     item.title.includes(searchValue) ||
                  //     item.quantity === Number(searchValue) ||
                  //     item.price === Number(searchValue)
                  //     : item;
                  // })
                  .map((item, index) => {
                    return (
                      <tr key={item?._id}>
                        <td className="pr-4 pt-3 pb-3 text-sm whitespace-nowrap">
                          {item?._id}
                        </td>
                        <td className="pr-4 pt-3 pb-3 text-sm whitespace-nowrap">
                          {item?.firstName}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap">
                          {item?.lastName}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap">
                          {item?.emailAddress}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap">
                          {item?.phoneNo}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap">
                          {item?.storeId?.name}
                        </td>
                        <td className="pt-4 pb-4 pl-4 pr-4 text-center ">
                          <button
                            onClick={() => {
                              sellerApproved(item?._id);
                            }}
                            disabled={item?.isApproved}
                            className={`px-1 py-2 ${
                              item?.isApproved
                                ? "bg-[lightGreen]"
                                : "bg-[green]"
                            } text-[#ffff] text-[13px] w-[85px] rounded-md`}
                          >
                            {item?.isApproved ? "Approved" : "Approve"}
                          </button>
                        </td>
                        <td className="pt-4 pb-4 flex text-center gap-x-1">
                          <button
                            onClick={() => {
                              activateOrDeactivate(
                                item?._id,
                                item?.isActive ? false : true
                              );
                            }}
                            // disabled={item?.isApproved}
                            className={`px-1 py-2 ${
                              item?.isActive ? "bg-[red]" : "bg-[green]"
                            } text-[#ffff] text-[13px] w-[80px]  rounded-md`}
                          >
                            {item?.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => {
                              setRemoveSellerId(item?._id);
                              removeSeller(item?._id);
                            }}
                            // disabled={item?.isApproved}
                            className={`px-2 py-2 bg-[red] text-[#ffff] text-[13px] w-[75px]  rounded-md`}
                          >
                            {removeLoading && removeSellerId == item?._id
                              ? "loading..."
                              : "Remove"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <h1 className="text-lg font-mont text-center">No Seller Found</h1>
        )}
      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default DataTable;
