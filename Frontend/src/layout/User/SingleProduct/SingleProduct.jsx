import { useEffect, useState } from "react";

import UserImage from "../../../assets/home/userImage.webp";
import { FaEdit, FaStar } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";
import { AiFillStar, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import { baseUrl } from "../../../constants/baseUrl";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import CreateBid from "../CreateBid/CreateBid";
import ViewProductBidsOfferPopup from "../../../components/ViewProductBidsOfferPopup";
import { useDispatch, useSelector } from "react-redux";
import { add, decrement, increment } from "../../../store/slices/cart";
import toast, { Toaster } from "react-hot-toast";

const SingleProduct = () => {
  const stars = [1, 2, 3, 4, 5];
  const [changeQuantity, setChangeQuantity] = useState(1);
  const [productData, setproductData] = useState([]);
  const productId = useLocation().pathname.split("/")[3];

  const [imageIndex, setImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reFetch, setReFetch] = useState(false);
  const [isCreateBidPopup, setCreateBidPopup] = useState(false);
  const [productIdd, setProductId] = useState("");
  const [viewProductBidOfferPopup, setViewProductBidOfferPopup] =
    useState(false);
  const dispatch = useDispatch();

  const products = useSelector((state) => state.cart);
  let singleProduct = products?.filter((i) => {
    return i._id === productId;
  });
  console.log(singleProduct);

  const addToCart = (product) => {
    console.log(products);
    console.log(product);
    const sellerId = products.find(
      (item) => item.seller_id?._id == product.seller_id?._id
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
      toast.success("Product Added ");
    }
  };
  const incrementQuantity = (product) => {
    singleProduct.length > 0
      ? dispatch(increment(product))
      : toast.error("Item Not Added In Cart");
  };

  const decrementQuantity = (product) => {
    singleProduct.length > 0
      ? dispatch(decrement(product))
      : toast.error("Item Not Added In Cart");
  };

  const getSingleProduct = () => {
    axios.get(`${baseUrl}/product/get-product/${productId}`).then((res) => {
      setproductData(res.data?.data);
      console.log("res.data?.data", res.data?.data);
    });
  };

  const getSingleProductReviews = () => {
    const token = localStorage.getItem("customerToken");

    axios
      .get(`${baseUrl}/product/get-all-reviews/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setReviews(res.data?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      });
  };

  const handleReviewSubmit = () => {
    const token = localStorage.getItem("customerToken");

    if (!newReview.trim()) {
      alert("Please enter a review");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmittingReview(true);

    axios
      .post(
        `${baseUrl}/product/create-product-review/${productId}`,
        { description: newReview, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // setReviews([...reviews, res.data?.data]);
        getSingleProductReviews();
        setNewReview("");
        setRating(0);
        setSubmittingReview(false);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        setSubmittingReview(false);
      });
  };

  const handleStarClick = (index) => {
    setRating(index);
  };

  const [update, setUpdate] = useState(false);
  const [reviewId, setReviewId] = useState(false);

  const handleUpdate = () => {
    const token = localStorage.getItem("customerToken");

    // if (!newReview.trim()) {
    //   alert("Please enter a review");
    //   return;
    // }

    // if (rating === 0) {
    //   alert("Please select a rating");
    //   return;
    // }

    setSubmittingReview(true);

    axios
      .put(
        `${baseUrl}/product/update-product-review/${reviewId}`,
        { description: newReview, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // setReviews([...reviews, res.data?.data]);
        getSingleProductReviews();
        setNewReview("");
        setReviewId("");
        setRating(0);
        setSubmittingReview(false);
        setUpdate(false);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        setSubmittingReview(false);
        setUpdate(false);
        setReviewId("");
      });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("customerToken");

    axios
      .delete(
        `${baseUrl}/product/delete-product-review/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        // setReviews([...reviews, res.data?.data]);
        getSingleProductReviews();
        getSingleProduct();
        setReviewId("");
      })
      .catch((error) => {
        console.error("Error submitting review:", error);

        setReviewId("");
      });
  };

  useEffect(() => {
    getSingleProduct();
    getSingleProductReviews();
  }, []);

  useEffect(() => {
    getSingleProduct();
    getSingleProductReviews();
  }, [reFetch]);

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
    <div className="p-3 font-lato bg-[#f4f3f4] overflow-y-hidden pb-[8rem]">
      {/* <h1 className="text-xl font-lato">{productData?.title}</h1> */}

      {/* MAIN PRODUCT DETAILS */}
      <div className="flex justify-center items-start gap-x-8 mt-20 lg:flex-row flex-col">
        {/* IMAGES */}
        <div className="flex justify-center w-[100%] lg:w-fit lg:justify-normal items-start gap-x-5 lg:mb-0 mb-10">
          {/* SMALL IMAGES */}
          <div>
            {productData?.images?.map((item, index) => (
              <div
                onClick={() => setImageIndex(index)}
                className="bg-[#e1e1e1] cursor-pointer sm:w-[5rem] sm:h-[4rem] w-[3rem] h-[3rem] flex justify-center items-center mb-4"
                key={index}
              >
                <img src={item?.url} alt="" className="sm:h-[2rem] h-[1rem]" />
              </div>
            ))}
          </div>

          {/* LARGE IMAGE */}
          <div className="bg-[#e1e1e1] flex justify-center items-center h-[20rem] p-3">
            <img
              src={productData?.images && productData?.images[imageIndex]?.url}
              alt=""
              className="h-[17rem] w-[20rem]"
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col justify-start items-start lg:block w-[100%] lg:w-fit">
          {/* TITLE */}
          <h1 className="font-mono text-2fxl">{productData?.title}</h1>
          {/* PRICE AND DISCOUNTED PRICED */}
          <div className="flex gap-x-4 items-start mt-2">
            <p className="font-lato text-xl font-medium">
              Rs{" "}
              {productData?.acceptedOffer !== null &&
                productData?.acceptedOffer?.user ==
                localStorage.getItem("customerId")
                ? productData?.acceptedOffer?.bidFare
                : productData?.price}
            </p>
          </div>
          {/* STARS AND RATING */}
          <div className="flex gap-x-4 items-start mt-2">
            {/* <div className="flex items-start mt-1">
              {stars.map((item) => (
                <FaStar
                  className={`${item <= 4 ? "text-[#ffe44a]" : "text-[#737379]"
                    }`}
                  key={item}
                />
              ))}
            </div> */}
            <div>
              <p className="text-[#7d7b7d]">( {reviews.length} reviews )</p>
            </div>
          </div>
          {/* DESCRIPTION */}
          <div className="mt-3">
            <p className="w-[100%] lg:w-[40rem] text-base text-[#7d7b7d]">
              {productData?.description}
            </p>
          </div>
          {/* BUTTONS */}

          {productData?.acceptedOffer === null && new Date(productData?.offersDeadline).getTime() > Date.now() &&
            productData?.isAvailbleForBidding &&
            !productData?.offers
              .find((offer) => offer.user == localStorage.getItem("customerId"))
            ? (
              <div className="flex gap-x-4 items-start mt-3 sm:w-fit w-[100%] justify-center">
                <button
                  className="w-[10rem] h-[2.5rem] rounded-3xl bg-[#6616db] text-white font-mont font-medium"
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent parent onClick

                    if (
                      productData?.acceptedOffer === null && new Date(productData?.offersDeadline).getTime() > Date.now() &&
                      productData?.isAvailbleForBidding &&
                      !productData?.offers
                        ?.find(
                          (offer) =>
                            offer.user == localStorage.getItem("customerId")
                        )

                    ) {
                      setProductId(productData?._id);
                      setCreateBidPopup(true);

                    }
                    console.log("abc");
                    console.log(isCreateBidPopup);
                  }}
                >
                  Create a Bid
                </button>
                <div>
                  <button
                    className="w-[10rem] h-[2.5rem] rounded-3xl bg-[#6616db] text-white font-mont font-medium"
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent parent onClick
                      if (productData?.isAvailbleForBidding) {
                        setViewProductBidOfferPopup(true);
                        setProductId(productData?._id);
                      }
                      console.log("abc");
                      console.log(viewProductBidOfferPopup);
                    }}
                  >
                    View Offers
                  </button>
                </div>
              </div>
            )
            : productData?.isAvailbleForBidding ? (
              <div className="flex gap-x-4 items-start mt-3 sm:w-fit w-[100%] justify-center">
                <button
                  className="w-[10rem] h-[2.5rem] rounded-3xl bg-[#6616db] text-white font-mont font-medium"
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent parent onClick
                    if (productData?.isAvailbleForBidding) {
                      setProductId(productData?._id);
                      setViewProductBidOfferPopup(true);

                    }
                    console.log("abc");
                    console.log(viewProductBidOfferPopup);
                  }}
                >
                  View Offers
                </button>
              </div>
            )
              : (
                <div className="flex gap-x-4 items-start mt-3 sm:w-fit w-[100%] justify-center">
                  <div className="flex justify-between items-center w-[10rem] h-[2.5rem] rounded-3xl bg-white p-3">
                    <FiMinus
                      onClick={() => decrementQuantity(productData)}
                      className="cursor-pointer"
                    />
                    <p>
                      {singleProduct.length > 0 ? singleProduct[0]?.quantity : 0}
                    </p>
                    <FiPlus
                      onClick={() => incrementQuantity(productData)}
                      className="cursor-pointer"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => addToCart(productData)}
                      className="w-[10rem] h-[2.5rem] rounded-3xl bg-[#6616db] text-white font-mont font-medium"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              )

          }

          {productData?.isAvailbleForBidding && productData?.acceptedOffer !== null &&
            productData?.acceptedOffer?.user ==
            localStorage.getItem("customerId") && (
              <div className="flex gap-x-4 items-start mt-3 sm:w-fit w-[100%] justify-center">
                <div className="flex justify-between items-center w-[10rem] h-[2.5rem] rounded-3xl bg-white p-3">
                  <FiMinus
                    onClick={() => decrementQuantity(productData)}
                    className="cursor-pointer"
                  />
                  <p>
                    {singleProduct.length > 0 ? singleProduct[0]?.quantity : 0}
                  </p>
                  <FiPlus
                    onClick={() => incrementQuantity(productData)}
                    className="cursor-pointer"
                  />
                </div>
                <div>
                  <button
                    onClick={() => addToCart(productData)}
                    className="w-[10rem] h-[2.5rem] rounded-3xl bg-[#6616db] text-white font-mont font-medium"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            )}

          {productData?.isAvailbleForBidding &&
            new Date(productData?.offersDeadline).getTime() > Date.now() && (
              <h1 className="text-sm font-bold mt-4">
                Time Remaining: &nbsp;
                <span className="text-sm font-normal text-blue-500">
                  {formatTimeRemaining(productData?.offersDeadline)}
                </span>
              </h1>
            )}

          {/* ADD TO WISHLIST */}
          {/* <div className="flex gap-x-3 items-center mt-4 cursor-pointer text-sm">
            <AiOutlineHeart />
            <p className="font-mont font-medium">Add To Wishlist</p>
          </div> */}
          {/* TAGS */}
          {/* <div className="flex gap-x-3 items-center mt-4 cursor-pointer text-sm">
            <div>
              <p>Tags: </p>
            </div>
            <div className="flex gap-x-3">
              <p>Fashion ,</p>
              <p>Jacket ,</p>
              <p>Man ,</p>
              <p>Summer</p>
            </div>
          </div> */}
        </div>
      </div>

      {/* RATINGS AND SELLER PROFILE */}
      <div className="flex gap-x-5 justify-center md:flex-row flex-col items-start pb-10 pl-5 pr-5 font-popins mt-5">
        {/* FIRST RATING CONTAINER */}
        <div className="flex-1 order-2 md:order-1 bg-slate-100 rounded-md p-5">
          {/* RATING HEADING AND LINE */}
          <div>
            <h1 className="font-semibold tracking-wider">
              Reviews ({reviews.length})
            </h1>

            <div className="w-[100%] h-[0.2px] bg-gray-200 mt-2 mb-2"></div>
          </div>
          <div
            className={`${reviews.length <= 1 || loading ? "h-[6rem]" : "h-[12rem]"
              } overflow-y-auto`}
          >
            {reviews.length === 0 ? (
              <div className="font-bold text-xl w-full flex justify-center">
                {loading ? "Loading..." : "No Reviews Available"}
              </div>
            ) : (
              reviews?.map((item, index) => (
                <div key={index}>
                  {/* USER IMAGE AND RATING STAR */}
                  <div className="flex gap-x-6 items-start">
                    {/* IMAGE AND NAME */}
                    <div className="w-[10rem]">
                      {/* <img
                        src={UserImage}
                        alt=""
                        className="w-[4rem] h-[4rem] rounded-full"
                      /> */}
                      <p className="mt-2">
                        {item.user.firstName} {item.user.lastName}
                      </p>
                    </div>
                    {/* COMMENT AND STAR */}
                    <div className="w-[100%] flex justify-between">
                      <div className="flex flex-col">
                        <div className="flex">
                          {stars.map((star, index) => (
                            <FaStar
                              key={index}
                              className={`cursor-pointer ${item.rating >= star
                                ? "text-yellow-500"
                                : "text-gray-300"
                                }`}
                              onClick={() => handleStarClick(star)}
                            />
                          ))}
                        </div>
                        <div className="mt-2">
                          <p className="w-[100%] text-sm">{item.description}</p>
                        </div>
                      </div>
                      {item?.user._id == localStorage.getItem("customerId") && (
                        <div className="flex gap-3">
                          <FaEdit
                            size={18}
                            key={index}
                            className={`cursor-pointer text-green-500`}
                            onClick={() => {
                              setReviewId(item?._id);
                              handleStarClick(item?.rating);
                              setNewReview(item?.description);
                              setUpdate(true);
                            }}
                          />
                          <MdDelete
                            size={18}
                            key={index}
                            className={`cursor-pointer text-red-500`}
                            onClick={() => {
                              handleDelete(item?._id);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-[0.1px] w-[100%] bg-gray-200 mt-4 mb-4"></div>
                </div>
              ))
            )}

            {isCreateBidPopup && (
              <div className="fixed w-screen h-screen left-0 top-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="w-[100%] h-[100%] flex justify-center items-center">
                  <CreateBid
                    setCreateBidPopup={setCreateBidPopup}
                    setReFetch={setReFetch}
                    reFetch={reFetch}
                    productId={productIdd}
                  />
                </div>
              </div>
            )}

            {viewProductBidOfferPopup && (
              <div className="fixed w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
                <div className="flex justify-center items-center w-[100%] h-[100%] ">
                  <ViewProductBidsOfferPopup
                    setViewProductBidOfferPopup={setViewProductBidOfferPopup}
                    setReFetch={setReFetch}
                    reFetch={reFetch}
                    productId={productIdd}
                    token="customerToken"
                  />
                </div>
              </div>
            )}
          </div>
          {/* ADD REVIEW */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex">
                {stars.map((star, index) => (
                  <FaStar
                    key={index}
                    className={`pl-2 w-6 cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-300"
                      }`}
                    onClick={() => handleStarClick(star)}
                  />
                ))}
              </div>
              <button
                onClick={update ? handleUpdate : handleReviewSubmit}
                className="w-40 h-10 bg-blue-500 text-white rounded-3xl"
                disabled={submittingReview}
              >
                {submittingReview
                  ? update
                    ? "Updating Review"
                    : "Giving review..."
                  : update
                    ? "Update Review"
                    : "Give a review"}
              </button>
            </div>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              className="w-full p-2 border rounded-3xl resize-none"
              rows={1}
              placeholder="       Write a review..."
            />
          </div>
        </div>
      </div>
      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div >
  );
};

export default SingleProduct;
