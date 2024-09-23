import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import CreatePopup from "./CreatePopup";
import UpdatePopup from "./UpdatePopup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";
import { Switch, Spin } from "antd";
import ViewProductBidsOfferPopup from "../../../components/ViewProductBidsOfferPopup";
import SelectOfferDeadline from "./SelectOfferDeadline";

const DataTable = () => {
  const [searchValue, setSearchValue] = useState("");
  const [createProductPopup, setCreateProductPopup] = useState(false);
  const [updateProductPopup, setUpdateProductPopup] = useState(false);
  const [id, setId] = useState("");
  const [viewProductBidOfferPopup, setViewProductBidOfferPopup] =
    useState(false);
  const [productData, setproductData] = useState([]);
  const [reFetch, setReFetch] = useState(false);
  const [proudctIds, setProductId] = useState("");
  const [item, setItem] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [productId, setProductIdd] = useState("");
  const [isOpenPopupForSelectDate, setOpenPopupForSelectDate] = useState(false);
  const [date, setDate] = useState("");

  const deleteProduct = (id) => {
    axios
      .delete(`${baseUrl}/seller/delete-product/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("Product Deleted");
        setReFetch(!reFetch);
      })
      .catch((e) => {
        console.log(e);
        if (e) {
          toast.error("Something Went Wrong");
        }
      });
  };

  const FetchProducts = () => {
    axios
      .get(`${baseUrl}/seller/get-products`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
        },
      })
      .then((res) => {
        setproductData(res?.data?.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        setproductData([]);
      });
  };

  useEffect(() => {
    FetchProducts();
  }, [reFetch]);

  const [productStatus, setProductStatus] = useState(false);

  const onChange = (bidStatus, productId) => {
    setStatusLoading(true);
    // console.log(`switch to ${checked}`);
    console.log("bidStatus", bidStatus);
    console.log("productId", productId);

    axios
      .patch(
        `${baseUrl}/product/enable-disable-product-offers/${productId}`,
        {
          isAvailbleForBidding: bidStatus,
          offersDeadline:
            bidStatus == false
              ? null
              : new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          toast.success("Status Changed");
          setReFetch(!reFetch);
          setTimeout(() => {
            setStatusLoading(false);
            setProductIdd("");
          }, 1500);
        }
      })
      .catch((e) => {
        console.log(e);
        setStatusLoading(false);
        setProductIdd("");
      });
  };

  return (
    <div className="w-[100%]">
      <div className="w-[100%] shadow-cardShadow p-3 rounded-md font-lato">
        {/* HEADING AND ADD BUTTON  */}
        <div className="flex justify-between items-center">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search Product"
            className="flex-1 w-[100%] h-[2.7rem] border-2 border-gray-200 pl-4 pr-4 rounded-md outline-none"
          />
          <button
            onClick={() => setCreateProductPopup(true)}
            className="ml-4 bg-[#3741d8] text-[#ffff] h-[2.5rem] text-xs sm:text-base w-[7rem] sm:min-w-[9rem] rounded-md"
          >
            Add Product
          </button>
        </div>

        {/* TABLE  */}

        {loading ? (
          <h1 className="text-xl font-mont text-center my-4">Loading...</h1>
        ) : productData && productData?.length > 0 ? (
          <div className="mt-3 w-full bg-white p-2  overflow-x-scroll overflow-y-auto md:overflow-x-auto font-mont rounded-md">
            <table className="w-full">
              <thead>
                <tr className="">
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Serial Number
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pr-4  text-center font-normal whitespace-nowrap"
                  >
                    Product Id
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Product Name
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Category Name
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Total Quanity
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Price
                  </th>
                  <th
                    style={{ borderBottom: "1px solid lightgray" }}
                    className="pb-1 pl-4 pr-4 text-center font-normal whitespace-nowrap"
                  >
                    Is available for bid
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
                {productData
                  ?.filter((item) => {
                    return searchValue
                      ? item._id.includes(searchValue) ||
                          item.title.includes(searchValue) ||
                          item.quantity === Number(searchValue) ||
                          item.price === Number(searchValue)
                      : item;
                  })
                  .map((item, index) => {
                    return (
                      <tr key={item?._id}>
                        <td className="pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {index + 1}
                        </td>
                        <td className="pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?._id}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.title}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.category?.name}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.quantity}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {item?.price}
                        </td>
                        <td className="pl-4 pr-4 pt-3 pb-3 text-sm whitespace-nowrap text-center">
                          {" "}
                          {statusLoading && productId == item?._id ? (
                            <Spin />
                          ) : (
                            <Switch
                              checked={item?.isAvailbleForBidding}
                              onChange={() => {
                                // if (item?.isAvailbleForBidding) {
                                //   setProductIdd(item?._id);
                                //   onChange(
                                //     !item?.isAvailbleForBidding,
                                //     item?._id
                                //   );
                                // } else {
                                //   setProductIdd(item?._id);
                                //   setProductStatus(!item?.isAvailbleForBidding);
                                //   setOpenPopupForSelectDate(true);
                                // }
                                setProductIdd(item?._id);
                                onChange(
                                  !item?.isAvailbleForBidding,
                                  item?._id
                                );
                              }}
                              style={{
                                backgroundColor: `${
                                  !item?.isAvailbleForBidding ? "gray" : "blue"
                                }`,
                              }}
                            />
                          )}{" "}
                        </td>
                        <td className="pt-4 pb-4 pl-4 pr-4 text-center whitespace-nowrap flex items-center gap-x-4 ">
                          {item?.isAvailbleForBidding && (
                            <button
                              onClick={() => {
                                setId(item?._id);
                                setViewProductBidOfferPopup(true);
                              }}
                              className="ml-4 bg-[#3741d8] text-[#ffff] h-[2rem] text-xs sm:text-base w-[6rem] sm:min-w-[5rem] rounded-md"
                              style={{
                                fontSize: "11px",
                              }}
                            >
                              View Offers
                            </button>
                          )}
                          <AiFillEye
                            onClick={() =>
                              navigate(`/seller/product/single/${item?._id}`)
                            }
                            className="text-[#4f619f] cursor-pointer"
                          />
                          <MdModeEditOutline
                            onClick={() => {
                              setProductId(item?._id),
                                setItem(item),
                                setUpdateProductPopup(true);
                            }}
                            className="text-[#4f619f] cursor-pointer"
                          />
                          <FaTrash
                            onClick={() => deleteProduct(item?._id)}
                            className="text-red-600 cursor-pointer text-sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <h1 className="text-lg font-mont text-center">No Product Found</h1>
        )}
      </div>

      {/* CREATE PRODUCT POPUP  */}

      {/* {isOpenPopupForSelectDate && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <SelectOfferDeadline
              setOpenPopupForSelectDate={setOpenPopupForSelectDate}
              isOpenPopupForSelectDate={isOpenPopupForSelectDate}
              onChange={onChange}
              date={date}
              setDate={setDate}
              productId={productId}
              productStatus={productStatus}
            />
          </div>
        </div>
      )} */}

      {/* CREATE PRODUCT POPUP  */}

      {createProductPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <CreatePopup
              setReFetch={setReFetch}
              reFetch={reFetch}
              setCreateProductPopup={setCreateProductPopup}
            />
          </div>
        </div>
      )}

      {/* UPDATE PRODUCT POPUP  */}

      {updateProductPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <UpdatePopup
              item={item}
              proudctId={proudctIds}
              setReFetch={setReFetch}
              reFetch={reFetch}
              setUpdateProductPopup={setUpdateProductPopup}
            />
          </div>
        </div>
      )}

      {viewProductBidOfferPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <ViewProductBidsOfferPopup
              setViewProductBidOfferPopup={setViewProductBidOfferPopup}
              setReFetch={setReFetch}
              reFetch={reFetch}
              productId={id}
              token="sellerToken"
            />
          </div>
        </div>
      )}

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default DataTable;
