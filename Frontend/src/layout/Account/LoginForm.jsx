import { useState } from "react";
import "./style.css";
import BgImage from "../../assets/T-2.jpg";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../constants/baseUrl";

const LoginForm = () => {
  // const history = useHistory();
  const [userData, setuserData] = useState({ emailAddress: "", password: "" });
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showPasswords, setshowPasswords] = useState({ p1: false, p2: false });
  const [loading, setLoading] = useState(false);
  // const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
  const nav = useNavigate();

  const onChangeInput = (e) => {
    setuserData({ ...userData, [e.target.name]: e.target.value });
  };

  // const submitForm = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   if (!userData.emailAddress || !userData.password) {
  //     toast.error("All Fields Is Required");
  //     setLoading(false);
  //   } else if (userData.password !== confirmPassword) {
  //     toast.error("Password Not Match");
  //     setLoading(false);
  //   } else if (!emailPattern.test(userData.emailAddress)) {
  //     toast.error("Invalid Email Format");
  //     setLoading(false);
  //   }
  //   else if (!passwordPattern.test(userData.password)) {
  //     toast.error("Password Must Contain lowercase, uppercase letter , any digit and and any special char")
  //     setLoading(false)
  //   }
  //   else {
  //     axios
  //       .post(`${baseUrl}/auth/user/login`, userData)
  //       .then((res) => {
  //         setLoading(false);
  //         console.log(res);
  //         if (res?.data?.data?.authToken) {
  //           toast.success("Account Login");
  //           if (res?.data?.data?.user?.role === "SELLER") {
  //             localStorage.setItem("sellerToken", res?.data?.data?.authToken);
  //             localStorage.setItem("sellerId", res?.data?.data?.user?._id);
  //             setTimeout(() => {
  //               // history.replace('/seller/product'); // Replace the current page with the new page
  //               nav("/seller/product", { replace: true });
  //               window.history.pushState(null, '', '/seller/product'); // Adds a new entry to the history
  //             }, 2000);
  //           } else if (res?.data?.data?.user?.role === "SUPER_ADMIN") {
  //             localStorage.setItem("userToken", res?.data?.data?.authToken);
  //             localStorage.setItem("userId", res?.data?.data?.user?._id);
  //             setTimeout(() => {
  //               // history.replace('/admin/sellers'); // Replace the current page with the new page
  //               nav("/admin/sellers", { replace: true });
  //               window.history.pushState(null, '', '/admin/sellers'); // Adds a new entry to the history
  //             }, 2000);
  //           } else {
  //             localStorage.setItem("customerToken", res?.data?.data?.authToken);
  //             localStorage.setItem("customerId", res?.data?.data?.user?._id);
  //             setTimeout(() => {
  //               // history.replace('/user/home'); // Replace the current page with the new page
  //               nav("/user/home", { replace: true });
  //               window.history.pushState(null, '', '/user/home'); // Adds a new entry to the history
  //             }, 2000);
  //           }
  //         }
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //         setLoading(false);
  //         if (e?.response?.status == 409) {
  //           toast.error("User Already Exits");
  //         } else if (
  //           e?.response?.data?.message == "Email or Password is Incorrect"
  //         ) {
  //           toast.error("Email Or Password Is Invalid");
  //         } else if (
  //           e?.response?.data?.message ===
  //           "Your account is NOT approved yet by admin, please contact admin."
  //         ) {
  //           toast.error("Please Wait For Admin Approval");
  //         } else if (e?.response?.data?.statusCode == 401) {
  //           toast.error("Your Account Is Not Authorized");
  //         } else if (e?.response?.data?.statusCode === 404) {
  //           toast.error("User Not Found");
  //         }
  //       });
  //   }
  // };




  const submitForm = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form fields
    if (!userData.emailAddress || !userData.password) {
      toast.error("All Fields Are Required");
      setLoading(false);
    } 
    // else if (userData.password !== confirmPassword) {
    //   toast.error("Passwords Do Not Match");
    //   setLoading(false);
    // }
     else if (!emailPattern.test(userData.emailAddress)) {
      toast.error("Invalid Email Format");
      setLoading(false);
    } else if (!passwordPattern.test(userData.password)) {
      toast.error("Password Must Contain lowercase, uppercase letter, digit, and special character");
      setLoading(false);
    } else {
      // Perform login
      axios.post(`${baseUrl}/auth/user/login`, userData)
        .then((res) => {
          setLoading(false);
          if (res?.data?.data?.authToken) {
            toast.success("Login Successful");
            const role = res?.data?.data?.user?.role;
            let redirectTo = '';

            if (role === "SELLER") {
              localStorage.setItem("sellerToken", res?.data?.data?.authToken);
              localStorage.setItem("sellerId", res?.data?.data?.user?._id);
              redirectTo = '/seller/product';
            } else if (role === "SUPER_ADMIN") {
              localStorage.setItem("userToken", res?.data?.data?.authToken);
              localStorage.setItem("userId", res?.data?.data?.user?._id);
              redirectTo = '/admin/sellers';
            } else {
              localStorage.setItem("customerToken", res?.data?.data?.authToken);
              localStorage.setItem("customerId", res?.data?.data?.user?._id);
              redirectTo = '/user/home';
            }

            // Use navigate to handle redirection
            setTimeout(() => {
              nav(redirectTo, { replace: true }); // Replaces the current entry in the history stack
              // Push a new state to prevent back navigation
              window.history.pushState(null, '', redirectTo);
            }, 2000);
          }
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          if (e?.response?.status === 409) {
            toast.error("User Already Exists");
          } else if (e?.response?.data?.message === "Email or Password is Incorrect") {
            toast.error("Invalid Email or Password");
          } else if (e?.response?.data?.message === "Your account is NOT approved yet by admin, please contact admin.") {
            toast.error("Awaiting Admin Approval");
          } else if (e?.response?.data?.statusCode === 401) {
            toast.error("Unauthorized");
          } else if (e?.response?.data?.statusCode === 404) {
            toast.error("User Not Found");
          }
        });
    }
  };


  return (
    <div className="gradientBackground w-screen h-screen flex justify-center items-center overflow-y-auto">
      <div className="bg-white rounded-md w-fit h-[25rem] flex justify-between items-start">
        {/* MAIN FORM & HEADINGS  */}
        <div className="w-[19.5rem] min-w-[19.5rem] p-4">
          {/* HEADING  */}
          <div>
            <h1 className="font-mont text-xl font-medium text-center">
              Sign In
            </h1>
            <p className="text-center mt-2 text-sm font-mont text-[#adb5bd]">
              Login and enjoy the platform !
            </p>
          </div>

          {/* MAIN INPUT FORMS FIELDS  */}

          <div className="flex justify-center items-center flex-col">
            {/* EMAIL  */}
            <div className="mt-12 mb-8">
              <input
                onChange={onChangeInput}
                style={{ border: "1px solid black" }}
                name="emailAddress"
                type="text"
                placeholder="Enter Your Email"
                className="outline-none w-[16rem] h-[2.2rem] rounded-md pl-2 pr-4"
              />
            </div>

            {/* PASSWORD  */}
            <div className="mb-5 w-[16rem] relative">
              <input
                onChange={onChangeInput}
                name="password"
                style={{ border: "1px solid black" }}
                type={showPasswords.p1 ? "text" : "password"}
                placeholder="Enter Your Password"
                className="outline-none w-[16rem] h-[2.2rem] rounded-md pl-2 pr-4"
              />
              {showPasswords.p1 ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer"
                  onClick={() =>
                    setshowPasswords({
                      ...showPasswords,
                      p1: !showPasswords.p1,
                    })
                  }
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer"
                  onClick={() =>
                    setshowPasswords({
                      ...showPasswords,
                      p1: !showPasswords.p1,
                    })
                  }
                />
              )}
            </div>

            {/* CONFIRM PASSWORD  */}
            {/* <div className="w-[16rem] relative">
              <input
                onChange={(e) => setconfirmPassword(e.target.value)}
                style={{ border: "1px solid black" }}
                type={showPasswords.p2 ? "text" : "password"}
                placeholder="Confirm Your Password"
                className="outline-none w-[16rem] h-[2.2rem] rounded-md pl-2 pr-4"
              />
              {showPasswords.p2 ? (
                <AiFillEyeInvisible
                  className="absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer"
                  onClick={() =>
                    setshowPasswords({
                      ...showPasswords,
                      p2: !showPasswords.p2,
                    })
                  }
                />
              ) : (
                <AiFillEye
                  className="absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer"
                  onClick={() =>
                    setshowPasswords({
                      ...showPasswords,
                      p2: !showPasswords.p2,
                    })
                  }
                />
              )}
            </div> */}

            {/* FORGET PASSWORD  */}
            <div
              className="w-[16rem] flex justify-end mt-1"
              onClick={() => nav("/send/otp")}
            >
              <p className="text-[#adb5bd] cursor-pointer">Forget Password ?</p>
            </div>

            {/* LOGIN BUTTON  */}
            <div className="mt-2" onClick={submitForm}>
              <button className="outline-none w-[16rem] h-[2.4rem] font-mont rounded-md text-[#adb5bd] bg-[#003049]">
                {loading ? "Loading ..." : "Login"}
              </button>
            </div>

            {/* DONOT HAVE AN ACCOUNT S */}
            <div className="w-[16rem] flex justify-end mt-2">
              <p className="text-[#adb5bd]">
                Dont have an account ?
                <span
                  className="text-slate-700 font-lato cursor-pointer"
                  onClick={() => nav("/register")}
                >
                  Register
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* IMAGE  */}
        <div className="hidden sm:block w-[20rem] min-w-[20rem]flex justify-end items-end rounded-tr-md rounded-br-md">
          <img
            src={BgImage}
            alt="Background"
            className="bg-center w-[20rem] min-w-[20rem] h-[25rem] rounded-tr-md rounded-br-md"
          />
        </div>
      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
};

export default LoginForm;
