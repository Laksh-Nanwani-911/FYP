import React, { useEffect, useState } from 'react'
import './style.css'
import OTPInput from 'react-otp-input';
import axios from 'axios';
import { baseUrl } from '../../constants/baseUrl';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const OtpForm = () => {
  const [otpCode, setOtp] = useState('');
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submitForm = (e) => {
    e.preventDefault()
    setLoading(true)
    if (!otpCode) {
      setLoading(false)
      toast.error("Otp is required")
    }
    else {

      if (localStorage.getItem("forget")) {
        axios.post(`${baseUrl}/auth/user/verify-otp`, { emailAddress: localStorage.getItem("emailAddress"), otpCode: otpCode })
          .then((res) => {
            setLoading(false)
            console.log(res)
            if (res.data) {
              toast.success("Otp Verified Please Reset Your Password")
              localStorage.removeItem("froget")
              setTimeout(() => {
                navigate("/reset/password")
              }, 3000);
            }
          })
          .catch((e) => {
            setLoading(false)
            console.log(e)
            console.log(e.response?.data?.statusCode)
            if (e.response?.data?.statusCode === 400) {
              toast.error("Invalid Otp")
            }
            if (e.response?.data?.statusCode === 401) {
              toast.error("Otp Is Expired")
            }
          })
      }
      else {
        axios.post(`${baseUrl}/email/verify-registration-verification-otp`, { emailAddress: localStorage.getItem("emailAddress"), otpCode })
          .then((res) => {
            setLoading(false)
            console.log(res)
            if (res.data) {
              toast.success("Account Verified Please Login Now")
              localStorage.removeItem("emailAddress")
              setTimeout(() => {
                navigate("/")
              }, 3000);
            }
          })
          .catch((e) => {
            setLoading(false)
            console.log(e)
            console.log(e.response?.data?.statusCode)
            if (e.response?.data?.statusCode === 400) {
              toast.error("Invalid Otp")
            }
            if (e.response?.data?.statusCode === 401) {
              toast.error("Otp Is Expired")
            }
          })
      }
    }
  }



  const [timer, setTimer] = useState(120); // Initial timer value in seconds
  const [isActive, setIsActive] = useState(true);

  // Function to start the timer
  useEffect(() => {
    let interval;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((timer) => timer - 1);
      }, 1000);
    } else if (timer === 0) {
      // Here you can add actions to perform when the timer reaches zero
      // For example, disable submit button or show a message
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // Function to handle resend button click
  const handleResend = () => {
    setTimer(120); // Reset the timer
    setIsActive(true); // Start the timer again
  };

  const resendOtp = (e) => {
    e.preventDefault()
    setLoading(false)

    if (localStorage.getItem("forget")) {
      console.log(true)
      axios.post(`${baseUrl}/auth/user/send-otp-email`, { emailAddress: localStorage.getItem("emailAddress"), userId: localStorage.getItem("id") })
        .then((res) => {
          setLoading(false)
          if (res.data) {
            handleResend()
            toast.success("Otp sent Check Your Email")
            setLoading(false)
          }
        })
        .catch((e) => {
          setLoading(false)
          toast.error(e)
        })
    }
    else {
      console.log("this not else block")
      axios.post(`${baseUrl}/email/send-verification-email-otp`, { emailAddress: localStorage.getItem("emailAddress") })
        .then((res) => {
          setLoading(false)
          console.log(res)
          if (res.data) {
            toast.success("Otp sent Check Your Email")
            setLoading(false)
          }
        })
        .catch((e) => {
          setLoading(false)
          console.log(e)
        })
    }
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className='gradientBackground w-screen h-screen flex justify-center items-center overflow-y-auto'>

      <div className='bg-white rounded-md w-fit h-fit flex justify-between items-start'>

        {/* MAIN FORM & HEADINGS  */}
        <div className='w-[26.5rem] min-w-[26.5rem] p-4'>

          {/* HEADING  */}
          <div>
            <h1 className='font-mont text-xl font-medium text-center'>Verify OTP</h1>
            <p className='text-center mt-2 text-sm font-mont text-[#adb5bd]'>No worries you can reset it !</p>
          </div>

          {/* MAIN OTP FIELDS  */}

          <div className='flex justify-center items-center flex-col'>

            {/* OTP INPUT  */}
            <div className='mt-10'>
              <OTPInput value={otpCode} onChange={setOtp} numInputs={6} renderInput={(props) => <input {...props} />} inputStyle={{ width: "3.2rem", height: "3.2rem", backgroundColor: "#F0EFFF", marginRight: "10px", color: "#756dfd", outline: "none", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", fontWeight: "bolder", fontSize: "1.5rem" }} />
            </div>

            {/* RESEND OTP  */}
            {timer == 0 ? <div onClick={resendOtp} className='mt-5 flex justify-end items-end w-[20.5rem] cursor-pointer'>
              <p className='font-mont text-[#adb5bd]'>Resend Otp</p>
            </div> : <div className='mt-5 flex justify-end items-end w-[20.5rem] cursor-pointer'>
              <p className='font-mont text-[#adb5bd]'>This OTP will expire in {formatTime(timer)}</p>
            </div>}

            {/* Submit BUTTON  */}
            <div className='mt-5' onClick={submitForm}>
              <button className='outline-none w-[24.5rem] h-[2.4rem] font-mont rounded-md text-[#adb5bd] bg-[#003049]'>{loading ? "Loading ..." : "Verify"}</button>
            </div>


          </div>

        </div>


      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000, }} />

    </div>
  )
}

export default OtpForm
