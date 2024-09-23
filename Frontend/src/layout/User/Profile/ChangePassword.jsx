import { useState } from "react";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { baseUrl } from "../../../constants/baseUrl";

const ChangePassword = ({ setChangePasswordPopup, setReFetch, reFetch }) => {
  const [currentPassword, setCurrentPassword] = useState({
    currentPassword: "",
  });

  const [changePassword, setChangePassword] = useState({
    updatedPassword: "",
    updatedConfirmPassword: "",
  });
  const [loader, setloader] = useState(false);

  const onChangeInput = (e) => {
    setCurrentPassword({ ...currentPassword, [e.target.name]: e.target.value });
  };

  const onChangeInputForChangePassword = (e) => {
    setChangePassword({ ...changePassword, [e.target.name]: e.target.value });
  };
  const [isCurrentPasswordSuccess, setIsCurrentPasswordSuccess] =
    useState(false);

  const submitData = async () => {
    setloader(true);
    if (currentPassword.currentPassword == "") {
      setloader(false);
      toast.error("All Fields Are Required");
    } else {
      const bodyData = {
        currentPassword: currentPassword.currentPassword,
      };

      console.log(bodyData);
      axios
        .post(
          `${baseUrl}/user/reset-password/validate-current-password`,
          bodyData,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("customerToken")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          setCurrentPassword({
            currentPassword: "",
          });
          toast.success(res.data.message);
          setIsCurrentPasswordSuccess(true);

          setloader(false);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
          setloader(false);
        });
    }
  };

  const submitDataForChangePassword = async () => {
    setloader(true);
    if (
      changePassword.updatedPassword == "" ||
      changePassword.updatedConfirmPassword == ""
    ) {
      setloader(false);
      toast.error("All Fields Are Required");
    } else if (
      changePassword.updatedPassword !== changePassword.updatedConfirmPassword
    ) {
      setloader(false);
      toast.error("Password are not matched");
    } else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(changePassword.updatedPassword)){
      setloader(false);
      toast.error("Password must be at least 8 characters long including Uppercase, Lowercase, Digit, Specialcharacter");
    } else {
      const bodyData = {
        updatedPassword: changePassword.updatedPassword,
        updatedConfirmPassword: changePassword.updatedConfirmPassword,
      };

      console.log(bodyData);
      axios
        .patch(`${baseUrl}/user/reset-password/update-password`, bodyData, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("customerToken")}`,
          },
        })
        .then((res) => {
          console.log(res);
          toast.success(res.data.message);
          setChangePassword({
            updatedPassword: "",
            updatedConfirmPassword: "",
          });
          setIsCurrentPasswordSuccess(false);
          setloader(false);
          setChangePasswordPopup(false);
        })
        .catch((e) => {
          toast.error(e.response.data.message);
          setloader(false);
        });
    }
  };

  return (
    <div className="bg-white p-2 sm:w-[50%] md:w-[30%] rounded-md font-mont sm:m-0 m-3">
      <div className="flex justify-between items-center">
        <h1 className="text-lg">Validate Current Password</h1>
        <ImCross
          onClick={() => setChangePasswordPopup(false)}
          className="cursor-pointer"
        />
      </div>

      {/* MAIN INPUT FIELDS  */}

      {isCurrentPasswordSuccess ? (
        <div className="mt-3">
          {/* PRODUCT NAME AND DESCRIPTION  */}
          <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3">
            <input
              style={{ border: "1px solid lightgray" }}
              onChange={onChangeInputForChangePassword}
              className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
              type="text"
              name="updatedPassword"
              placeholder="Enter New Password"
              value={changePassword.updatedPassword}
            />
          </div>

          <div className="block sm:flex sm:justify-between sm:items-center mt-4 sm:gap-x-3">
            <input
              style={{ border: "1px solid lightgray" }}
              onChange={onChangeInputForChangePassword}
              className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
              type="text"
              name="updatedConfirmPassword"
              placeholder="Enter Confirm New Password"
              value={changePassword.updatedConfirmPassword}
            />
          </div>

          {/* ADD PRODUCT  */}
          <div
            style={{ border: "1px solid lightgray" }}
            className="rounded-md flex justify-center items-center mt-3 shadow-otpShadow bg-[#4f619f]"
            onClick={submitDataForChangePassword}
          >
            <div className="flex justify-center gap-x-3 items-center text-[#eff3fc] cursor-pointer  w-[8rem] sm:w-[10rem] h-[2.1rem] rounded-md">
              <button className="text-sm cursor-pointer">
                {loader ? "Loading ..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          {/* PRODUCT NAME AND DESCRIPTION  */}
          <div className="block sm:flex sm:justify-between sm:items-center sm:gap-x-3">
            <input
              style={{ border: "1px solid lightgray" }}
              onChange={onChangeInput}
              className="outline-none flex-none w-[100%] sm:mb-0 mb-2  sm:flex-1 h-[2.2rem] rounded-md pl-2 pr-2 placeholder:text-sm"
              type="text"
              name="currentPassword"
              placeholder="Enter Current Password"
              value={currentPassword.currentPassword}
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
                {loader ? "Loading ..." : "Check Password"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default ChangePassword;
