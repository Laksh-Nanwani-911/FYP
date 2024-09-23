import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";
import profileImage from "../../../assets/home/userProfile.png";
import ChangePassword from "./ChangePassword";

const SellerProfile = () => {
  const [changePasswordPopup, setChangePasswordPopup] = useState(false);
  const [reFetch, setReFetch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [profileDetails, setProfileDetails] = useState({
    emailAddress: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
  });
  const [userImage, setUserImage] = useState("");

  const onChangeInput = (e) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const fetchProfile = () => {
    axios
      .get(`${baseUrl}/user/get-profile`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
        },
      })
      .then((res) => {
        setProfileDetails({
          emailAddress: res?.data?.data.emailAddress,
          firstName: res?.data?.data.firstName,
          lastName: res?.data?.data.lastName,
          phoneNo: res?.data?.data.phoneNo,
        });
        setSelectedImage(null);
        setUserImage(res?.data?.data?.profileImage?.url);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };

  const editUserProfile = async () => {
    setLoader(true);
    if (selectedImage !== null) {
      editUserProfilePhoto();
    }
    axios
      .put(`${baseUrl}/user/update-profile`, profileDetails, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
        },
      })
      .then((res) => {
        setLoader(false);
        if (selectedImage == null) {
          fetchProfile();
        }
        // setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoader(false);
      });
  };

  const editUserProfilePhoto = () => {
    setLoader(true);
    const formData = {
      imageBase64: selectedImage,
    };
    axios
      .patch(`${baseUrl}/user/update-profile-image`, formData, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("sellerToken")}`,
        },
      })
      .then((res) => {
        fetchProfile();
      })
      .catch((e) => {});
  };

  useEffect(() => {
    // setLoading(true);
    fetchProfile();
  }, [reFetch]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="w-[100%]">
      <div className="w-[100%] shadow-cardShadow p-3 rounded-md font-lato">
        {loading ? (
          <h1 className="text-xl font-mont text-center my-4">Loading...</h1>
        ) : (
          <div>
            <div className="w-[100%] flex justify-center relative">
              <img
                className="rounded-full"
                style={{
                  border: "1px solid gray",
                  height: "90px",
                  width: "90px",
                }}
                src={
                  selectedImage !== null
                    ? selectedImage
                    : userImage !== ""
                    ? userImage
                    : profileImage
                }
              />
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label
                htmlFor="imageUpload"
                style={{
                  position: "relative",
                  bottom: -60,
                  right: 20,
                  backgroundColor: "blue",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <span style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
              </label>
            </div>
            <div className="mt-3 w-[100%] flex">
              <div className="sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-4 mr-4 min-w-[49%]">
                <input
                  style={{ border: "1px solid lightgray" }}
                  onChange={onChangeInput}
                  className="outline-none flex-none  sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                  type="text"
                  name="firstName"
                  placeholder="Enter First Name"
                  value={profileDetails.firstName}
                />
              </div>
              <div className="sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-4 mr-4 min-w-[49%]">
                <input
                  style={{ border: "1px solid lightgray" }}
                  onChange={onChangeInput}
                  className="outline-none flex-none  sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                  type="text"
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={profileDetails.lastName}
                />
              </div>
            </div>
            <div className="mt-3 w-[100%] flex">
              <div className="sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-4 mr-4 min-w-[49%]">
                <input
                  style={{ border: "1px solid lightgray" }}
                  onChange={onChangeInput}
                  className="outline-none flex-none  sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                  type="text"
                  name="emailAddress"
                  placeholder="Enter Email Address"
                  value={profileDetails.emailAddress}
                />
              </div>
              <div className="sm:flex sm:justify-between sm:items-center sm:gap-x-3 mt-4 mr-4 min-w-[49%]">
                <input
                  style={{ border: "1px solid lightgray" }}
                  onChange={onChangeInput}
                  className="outline-none flex-none  sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
                  type="text"
                  name="phoneNo"
                  placeholder="Enter Phone No"
                  value={profileDetails.phoneNo}
                />
              </div>
            </div>
            <div
              style={{ border: "1px solid lightgray" }}
              className="rounded-md flex justify-center items-center mt-3 shadow-otpShadow bg-[#4f619f]"
              onClick={editUserProfile}
            >
              <div className="flex justify-center gap-x-3 items-center text-[#eff3fc] cursor-pointer  w-[8rem] sm:w-[10rem] h-[2.1rem] rounded-md">
                <button className="text-sm cursor-pointer">
                  {loader ? "Loading ..." : "Update Profile"}
                </button>
              </div>
            </div>
            <div
              style={{ border: "1px solid lightgray" }}
              className="rounded-md flex justify-center items-center mt-3 shadow-otpShadow bg-[#4f619f]"
              onClick={() => {
                setChangePasswordPopup(true);
              }}
            >
              <div className="flex justify-center gap-x-3 items-center text-[#eff3fc] cursor-pointer  w-[8rem] sm:w-[10rem] h-[2.1rem] rounded-md">
                <button className="text-sm cursor-pointer">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {changePasswordPopup && (
        <div className="absolute w-screen h-screen left-0 top-0  bg-black bg-opacity-50">
          <div className="flex justify-center items-center w-[100%] h-[100%] ">
            <ChangePassword
              setReFetch={setReFetch}
              reFetch={reFetch}
              setChangePasswordPopup={setChangePasswordPopup}
            />
          </div>
        </div>
      )}

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default SellerProfile;
