import React, { useState } from 'react'
import './style.css'
import OTPInput from 'react-otp-input';
import axios from 'axios';
import { baseUrl } from '../../constants/baseUrl';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const SendOtp = () => {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const sendOtp = (e) => {
    e.preventDefault()
    setLoading(true)
    if (!email) {
      setLoading(false)
      toast.error("Email Is Required")
    }

    else {
      axios.post(`${baseUrl}/auth/user/check-user-email`, { emailAddress: email })
        .then((res) => {
          setLoading(false)
          if (res?.data?.data?.emailAddress) {
            toast.success("Otp Send")
            localStorage.setItem("emailAddress", res?.data?.data?.emailAddress)
            localStorage.setItem("id", res?.data?.data?._id)
            localStorage.setItem("forget", true)
            axios.post(`${baseUrl}/auth/user/send-otp-email`, { emailAddress: localStorage.getItem("emailAddress"), userId: localStorage.getItem("id") })
              .then((res) => {
                setLoading(false)
                if (res.data) {
                  toast.success("Otp sent Check Your Email");
                  setTimeout(() => {
                    nav("/otp")
                  }, 1500);
                }
              })
              .catch((e) => {
                setLoading(false)
                toast.error(e)
              })

          }
        })
        .catch((e) => {
          setLoading(false)
          console.log(e)
          if (e.response.status === 404) {
            toast.error("Email Not Found")
          }

        })

    }

  }

  return (
    <div className='gradientBackground w-screen h-screen flex justify-center items-center overflow-y-auto'>

      <div className='bg-white rounded-md w-fit h-fit flex justify-between items-start'>

        {/* MAIN FORM & HEADINGS  */}
        <div className='w-[19.5rem] min-w-[19.5rem] p-4'>

          {/* HEADING  */}
          <div>
            <h1 className='font-mont text-xl font-medium text-center'>Send OTP</h1>
            <p className='text-center mt-2 text-sm font-mont text-[#adb5bd]'>No worries you can reset it !</p>
          </div>

          {/* MAIN OTP FIELDS  */}

          <div className='flex justify-center items-center flex-col'>

            {/* OTP INPUT  */}
            <div className='mt-5'>
              <input type="text" name='email' placeholder='Ennter Email Address' onChange={(e) => setEmail(e.target.value)} style={{ border: "1px solid #e9ecef" }} className='outline-none w-[18rem] h-[2.5rem] rounded-md pl-4 pr-4' />
            </div>

            {/* Submit BUTTON  */}
            <div className='mt-5' onClick={sendOtp}>
              <button className='outline-none w-[18rem] h-[2.5rem] font-mont rounded-md text-[#adb5bd] bg-[#003049]'>{loading ? "Loading ..." : "Send Otp"}</button>
            </div>

          </div>

        </div>


      </div>

      {/* TOASTER  */}
      <Toaster position="top-right" toastOptions={{ duration: 3000, }} />

    </div>
  )
}

export default SendOtp