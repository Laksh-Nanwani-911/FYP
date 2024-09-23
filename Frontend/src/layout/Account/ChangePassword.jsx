import React, { useState } from 'react'
import './style.css'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { baseUrl } from '../../constants/baseUrl'

const ChangePassword = () => {

    const [newPassword, setnewPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const [showPasswords, setshowPasswords] = useState({ p1: false, p2: false })
    const [loading, setLoading] = useState(false)
    const nav = useNavigate();
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;


    const submitForm = (e) => {
        e.preventDefault()
        setLoading(true)
        if (!newPassword || !confirmPassword) {
            setLoading(false)
            toast.error("All Fields Are Required")
        }
        else if (newPassword !== confirmPassword) {
            setLoading(false)
            toast.error("Password Not Matched")
        }
        else if (!passwordPattern.test(newPassword)) {
            toast.error("Password Must Contain lowercase, uppercase letter , any digit and and any special char")
            setLoading(false)
        }
        else {

            axios.post(`${baseUrl}/auth/user/reset-password`, { userId: localStorage.getItem("id"), updatedPassword: newPassword, updatedConfirmPassword: confirmPassword })
                .then((res) => {
                    setLoading(false)
                    console.log(res)
                    if (res?.data?.statusCode === 200) {
                        toast.success("Password Reset Please Login Now")
                        localStorage.removeItem("emailAddress")
                        localStorage.removeItem("id")
                        localStorage.removeItem("forget")
                        setTimeout(() => {
                            nav("/")
                        }, 3000);
                    }
                })
                .catch((e) => {
                    setLoading(false)
                    console.log(e)
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
                        <h1 className='font-mont text-xl font-medium text-center'>Change Password</h1>
                        <p className='text-center mt-2 text-sm font-mont text-[#adb5bd]'>Last step to reset your password !</p>
                    </div>

                    {/* MAIN OTP FIELDS  */}

                    <div className='flex justify-center items-center flex-col mt-10'>

                        {/* PASSWORD  */}
                        <div className='mb-5 w-[16rem] relative'>
                            <input onChange={(e) => setnewPassword(e.target.value)} name="password" style={{ border: "1px solid #e9ecef" }} type={showPasswords.p1 ? "text" : "password"} placeholder='Enter Your Password' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-4 pr-4' />
                            {showPasswords.p1 ?
                                <AiFillEyeInvisible className='absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, p1: !showPasswords.p1 })} /> :
                                <AiFillEye className='absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, p1: !showPasswords.p1 })} />
                            }
                        </div>

                        {/* CONFIRM PASSWORD  */}
                        <div className='w-[16rem] relative'>
                            <input onChange={(e) => setconfirmPassword(e.target.value)} style={{ border: "1px solid #e9ecef" }} type={showPasswords.p2 ? "text" : "password"} placeholder='Confirm Your Password' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-4 pr-4' />
                            {showPasswords.p2 ?
                                <AiFillEyeInvisible className='absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, p2: !showPasswords.p2 })} /> :
                                <AiFillEye className='absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, p2: !showPasswords.p2 })} />
                            }
                        </div>


                        {/* Submit BUTTON  */}
                        <div className='mt-5' onClick={submitForm}>
                            <button className='outline-none w-[16rem] h-[2.4rem] font-mont rounded-md text-[#adb5bd] bg-[#003049]'>{loading ? "Loading ..." : "Submit"}</button>
                        </div>


                    </div>

                </div>


            </div>

            <Toaster position="top-right" toastOptions={{ duration: 3000, }} />

        </div>

    )
}

export default ChangePassword
