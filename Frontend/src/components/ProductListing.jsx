import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiFillCompass, AiOutlineHeart } from "react-icons/ai";
import { IoCartOutline } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { MdOutlineLocalOffer, MdOutlineRemoveRedEye } from "react-icons/md";
import CreateBid from "../layout/User/CreateBid/CreateBid";
import ViewProductBidsOfferPopup from "./ViewProductBidsOfferPopup";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { add } from "../store/slices/cart";


const ProductListing = ({
  loading,
  setReFetch,
  reFetch,
  title,
  paragraph,
  productData,
  isVertical,
}) => {
  const products = useSelector((state) => state.cart);
  const stars = [1, 2, 3, 4, 5];
  const [productIds, setProductIds] = useState([]);
  const nav = useNavigate();
  const [isCreateBidPopup, setCreateBidPopup] = useState(false);
  const [productId, setProductId] = useState("");
  const [viewProductBidOfferPopup, setViewProductBidOfferPopup] =
    useState(false);

  const saveCompareId = (id) => {
    if (productIds.includes(id)) {
      setProductIds(productIds.filter((productId) => productId !== id));
    } else {
      setProductIds([...productIds, id]);
    }
  };

  useEffect(() => {
    productIds.length === 2 &&
      nav(`/user/product/p1/${productIds[0]}/p2/${productIds[1]}`);
  }, [productIds]);

  console.log(productIds);

  const dispatch = useDispatch();
  const addToCart = (product) => {
    console.log(products);
    console.log(product);
    const sellerId = products.find(
      (item) => item?.sellerId?._id == product.sellerId?._id
    );
    // console.log(sellerId);
    if (sellerId == undefined && products.length > 0) {
      toast.error("This product is not of the same seller that you selected");
    } else {
      const updatedData = {
        ...product,
        price:
          product.acceptedOffer !== null
            ? product.acceptedOffer.bidFare
            : product.price,
        quantity: 1,
      };
      dispatch(add(updatedData));
      toast.success("Product Added");
    }
  };

  function formatTimeRemaining(deadline) {
    const total = Date.parse(deadline) - Date.now();
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return `${days} d, ${hours} hr, and ${minutes} mins`;
    } else if (hours > 0) {
      return `${hours} hr, and ${minutes} mins`;
    } else {
      return `${minutes} mins`;
    }
  }

  return (
    <div className="pl-3 pr-3 font-lato pb-10">
      {/* TITLE AND DESCRIPTION  */}
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center font-mont font-bold text-[#ff496c] mb-2">
          {title}
        </h1>
        <p className=" w-[100%] sm:w-[60%] text-center text-[#818183]">
          {paragraph}
        </p>
      </div>

      {/* MAIN PRODUCT CARD  */}

      {productData && productData?.data?.length > 0 ? (
        <div
          className={`w-[100%] flex ${isVertical ? "justify-center" : "justify-center"
            }  items-center gap-x-5 ${isVertical ? "overflow-x-scroll" : "flex-wrap"
            } mt-10`}
        >
          {title === "Products Available For Bidding"
            ? productData?.data
              ?.filter(
                (item) =>
                  item.isAvailbleForBidding && item?.offersDeadline !== null &&
                  new Date(item?.offersDeadline).getTime() > Date.now()
              )
              .map((item, index) => (
                <div
                  key={item._id + index}
                  className="w-[15rem] min-w-[15rem] h-fit mb-6"
                  onClick={(event) => {
                    event.preventDefault();
                    nav(`/user/product/${item?._id}`);
                  }}
                >
                  {/* IMAGE */}
                  <div className="w-[100%] cursor-pointer h-[20rem] flex justify-center items-center bg-[#ecf0f1] relative border border-gray-400 shadow-lg">
                    <img
                      src={item?.images && item?.images[0]?.url}
                      alt=""
                      className="h-[fit] w-fit"
                    />
                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                        // if (
                        //   new Date(item?.offersDeadline).getTime() >
                        //     Date.now() &&
                        //   item?.isAvailbleForBidding &&
                        //   item?.offers.every(
                        //     (offer) =>
                        //       offer.user ==
                        //         localStorage.getItem("customerId") &&
                        //       (offer.status == "REJECTED" ||
                        //         offer.status == "ACCEPTED")
                        //   )
                        // ) {
                        //   setCreateBidPopup(true);
                        //   setProductId(item?._id);
                        // }

                        if (
                          item?.acceptedOffer === null && new Date(item?.offersDeadline).getTime() >
                          Date.now() &&
                          item?.isAvailbleForBidding &&
                          !item?.offers
                            .find(
                              (offer) =>
                                offer.user == localStorage.getItem("customerId")
                            )
                        ) {
                          setCreateBidPopup(true);
                          setProductId(item?._id);
                        }
                      }}
                      className="absolute bottom-14 right-2 bg-white w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer"
                    >
                      {/* {new Date(item?.offersDeadline).getTime() >
                          Date.now() &&
                        item?.isAvailbleForBidding &&
                        item?.offers.every(
                          (offer) =>
                            offer.user == localStorage.getItem("customerId") &&
                            offer.status == "REJECTED"
                        ) ? (
                          <MdOutlineLocalOffer color="blue" />
                        ) : (
                          item?.acceptedOffer !== null &&
                          item?.acceptedOffer?.user ==
                            localStorage.getItem("customerId") && (
                            <IoCartOutline onClick={() => addToCart(item)} />
                          )
                        )} */}
                      {item?.acceptedOffer === null && new Date(item?.offersDeadline).getTime() >
                        Date.now() &&
                        item?.isAvailbleForBidding &&
                        !item?.offers
                          .find(
                            (offer) =>
                              offer.user == localStorage.getItem("customerId")
                          )
                        ? (
                          <MdOutlineLocalOffer color="blue" />
                        ) : (
                          item?.acceptedOffer !== null &&
                            item?.acceptedOffer?.user ==
                            localStorage.getItem("customerId") ? (
                            <IoCartOutline
                             onClick={() => addToCart(item)}
                              />
                          ) : null
                        )}
                    </div>

                    {item?.isAvailbleForBidding && (
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          if (item?.isAvailbleForBidding) {
                            setViewProductBidOfferPopup(true);
                            setProductId(item?._id);
                          }
                        }}
                        className="absolute bottom-14 left-2 bg-white w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer"
                      >
                        <MdOutlineRemoveRedEye color="blue" />
                      </div>
                    )}
                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                        saveCompareId(item?._id);
                      }}
                      className={`${productIds.includes(item?._id)
                        ? "bg-blue-300"
                        : "bg-white"
                        } absolute top-4 right-2 w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer`}
                    >
                      <AiFillCompass />
                    </div>
                  </div>

                  {/* TITLE PRICE STARS */}
                  <div className="mt-2">
                    <h1 className="text-sm font-lato font-bold">
                      {item?.title}
                    </h1>
                    {/* <div className="flex items-start mt-1">
                      {stars.map((starItem) => (
                        <FaStar
                          className={`${starItem <= 4
                            ? "text-[#ffe44a]"
                            : "text-[#737379]"
                            }`}
                          key={starItem}
                        />
                      ))}
                    </div> */}
                    <h1 className="text-sm font-mont mt-1">
                      Rs:{" "}
                      {item?.acceptedOffer !== null &&
                        item?.acceptedOffer.user ==
                        localStorage.getItem("customerId")
                        ? item?.acceptedOffer.bidFare
                        : item?.price}
                    </h1>
                    <h1 className="text-sm font-bold mt-1">
                      Time Remaining: &nbsp;
                      <span className="text-sm font-normal text-blue-500">
                        {formatTimeRemaining(item?.offersDeadline)}
                      </span>
                    </h1>
                  </div>
                </div>
              ))
            : productData?.data
              ?.filter((item) => !item.isAvailbleForBidding)
              .map((item, index) => (
                <div
                  key={item._id + index}
                  className="w-[15rem] min-w-[15rem] h-fit mb-6"
                  onClick={(event) => {
                    event.preventDefault();
                    nav(`/user/product/${item?._id}`);
                  }}
                >
                  {/* IMAGE */}
                  <div className="w-[100%] cursor-pointer h-[20rem] flex justify-center items-center bg-[#ecf0f1] relative border border-gray-400 shadow-lg">
                    <img
                      src={item?.images && item?.images[0]?.url}
                      alt=""
                      className="h-[fit] w-fit"
                    />
                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                        if (
                          new Date(item?.offersDeadline).getTime() >
                          Date.now() &&
                          item?.isAvailbleForBidding &&
                          item?.offers.every(
                            (offer) =>
                              offer.user ==
                              localStorage.getItem("customerId") &&
                              (offer.status == "REJECTED" ||
                                offer.status == "ACCEPTED")
                          )
                        ) {
                          setCreateBidPopup(true);
                          setProductId(item?._id);
                        }
                      }}
                      className="absolute bottom-14 right-2 bg-white w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer"
                    >
                      {new Date(item?.offersDeadline).getTime() >
                        Date.now() &&
                        item?.isAvailbleForBidding &&
                        item?.offers.every(
                          (offer) =>
                            offer.user == localStorage.getItem("customerId") &&
                            (offer.status == "REJECTED" ||
                              offer.status == "ACCEPTED")
                        ) ? (
                        <MdOutlineLocalOffer color="blue" />
                      ) : (
                        <IoCartOutline onClick={() => addToCart(item)} />
                      )}
                    </div>

                    {item?.isAvailbleForBidding && (
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          if (item?.isAvailbleForBidding) {
                            setViewProductBidOfferPopup(true);
                            setProductId(item?._id);
                          }
                        }}
                        className="absolute bottom-14 left-2 bg-white w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer"
                      >
                        <MdOutlineRemoveRedEye color="blue" />
                      </div>
                    )}
                    <div
                      onClick={(event) => {
                        event.stopPropagation();
                        saveCompareId(item?._id);
                      }}
                      className={`${productIds.includes(item?._id)
                        ? "bg-blue-300"
                        : "bg-white"
                        } absolute top-4 right-2 w-[2rem] h-[2rem] rounded-full flex justify-center items-center cursor-pointer`}
                    >
                      <AiFillCompass />
                    </div>
                  </div>

                  {/* TITLE PRICE STARS */}
                  <div className="mt-2">
                    <h1 className="text-sm font-lato font-bold">
                      {item?.title}
                    </h1>
                    {/* <div className="flex items-start mt-1">
                      {stars.map((starItem) => (
                        <FaStar
                          className={`${starItem <= 4
                            ? "text-[#ffe44a]"
                            : "text-[#737379]"
                            }`}
                          key={starItem}
                        />
                      ))}
                    </div> */}
                    <h1 className="text-sm font-mont mt-1">
                      Rs:{" "}
                      {item?.acceptedOffer !== null &&
                        item?.acceptedOffer.user ==
                        localStorage.getItem("customerId")
                        ? item?.acceptedOffer.bidFare
                        : item?.price}
                    </h1>
                  </div>
                </div>
              ))}
        </div>
      ) : (
        <p className="text-xxl mt-8 text-center font-mont text-[30px]">
          {loading ? "Loading..." : "No Data Found"}
        </p>
      )}

      {isCreateBidPopup && (
        <div className="fixed w-screen h-screen left-0 top-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-[100%] h-[100%] flex justify-center items-center">
            <CreateBid
              setCreateBidPopup={setCreateBidPopup}
              setReFetch={setReFetch}
              reFetch={reFetch}
              productId={productId}
            />
          </div>
        </div>
      )}

      {viewProductBidOfferPopup && (
        <div className="fixed w-screen h-screen left-0 top-0 bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%]">
            <ViewProductBidsOfferPopup
              setViewProductBidOfferPopup={setViewProductBidOfferPopup}
              setReFetch={setReFetch}
              reFetch={reFetch}
              productId={productId}
              token="customerToken"
            />
          </div>
        </div>
      )}

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
    </div>
  );
};

export default ProductListing;
