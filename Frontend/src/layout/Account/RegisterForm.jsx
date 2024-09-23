import React, { useState } from 'react'
import './style.css'
import BgImage from '../../assets/T-2.jpg'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { BiDownArrow } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { baseUrl } from '../../constants/baseUrl'

const RegisterForm = () => {

    const [userData, setuserData] = useState({ emailAddress: "", password: "", firstName: "", lastName: "", phoneNo: "", role: "Select Your Role", name: "", storePhoneNo: "", streetAddress: "", area: "", city: "", zipCode: "", })
    const [confirmPassword, setconfirmPassword] = useState("")
    const [showPasswords, setshowPasswords] = useState({ p1: false, p2: false, role: false })
    const [userRole, setUserRole] = useState({ role: "customer", nextStep: false })
    const [loading, setLoading] = useState(false)
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nav = useNavigate()

    const onChangeInput = (e) => { setuserData({ ...userData, [e.target.name]: e.target.value }) }

    const submitForm = (e) => {
        e.preventDefault()
        setLoading(true)
        console.log(userData)
        if (!userData.emailAddress || !userData.firstName || !userData.lastName || !userData.password || !userData.role || !userData.phoneNo) {
            toast.error("All Fields Is Required")
            setLoading(false)
        }
        else if (userData.role === "Select Your Role") {
            toast.error("Please Select A Role")
            setLoading(false)
        }
        else if (userData.password !== confirmPassword) {
            toast.error("Password Not Match")
            setLoading(false)
        }
        else if (!emailPattern.test(userData.emailAddress)) {
            toast.error("Invalid Email Format")
            setLoading(false)
        }
        // else if (!passwordPattern.test(userData.password)) {
        //     toast.error("Password Must Contain Aa@1")
        //     setLoading(false)
        // }
        else if (!passwordPattern.test(userData.password)) {
            toast.error("Password Must Contain 1: lowercase, uppercase, digit, special character & 8 should be minimum length ")
            setLoading(false)
        }
        else {
            axios.post(`${baseUrl}/auth/user/register-user`, userData)
                .then((res) => {
                    setLoading(false)
                    if (res?.data?.data?._id) {
                        toast.success("Account Created Verify Your Account")
                        localStorage.setItem("customerId", res?.data?.data?._id)
                        localStorage.setItem("emailAddress", userData.emailAddress)
                        setTimeout(() => {
                            nav("/otp")
                        }, 3000);
                    }
                })
                .catch((e) => {
                    setLoading(false)
                    if (e?.response?.status == 409) {
                        toast.error("User Already Exits")
                    }
                })
        }
    }
    const nextStep = () => {
        if (!userData.emailAddress  || !userData.firstName || !userData.lastName || !userData.password || !userData.role || !userData.phoneNo) {
            toast.error("All Fields Is Required")
            setLoading(false)
        }
        else if (userData.password !== confirmPassword) {
            toast.error("Password Not Match")
            setLoading(false)
        }
        else if (!emailPattern.test(userData.emailAddress)) {
            toast.error("Invalid Email Format")
            setLoading(false)
        }
        else if (!passwordPattern.test(userData.password)) {
            toast.error("Password Must Contain Aa@1")
            setLoading(false)
        }
        else {
            setUserRole({ ...userRole, role: "SELLER", nextStep: true })
        }
    }
    const submitRegisterForm = (e) => {
        console.log(userData)
        setLoading(true)
        if (!userData.area || !userData.city || !userData.storePhoneNo || !userData.streetAddress || !userData.zipCode || !userData.name) {
            toast.error("All Store Details Is Required")
            setLoading(false)
        }
        else {
            axios.post(`${baseUrl}/auth/user/register-user`, userData)
                .then((res) => {
                    setLoading(false)
                    if (res?.data?.data?._id) {
                        toast.success("Account Created Verify Your Account")
                        localStorage.setItem("sellerId", res?.data?.data?._id)
                        localStorage.setItem("emailAddress", userData.emailAddress)
                        setTimeout(() => {
                            nav("/otp")
                        }, 3000);
                    }
                })
                .catch((e) => {
                    console.log(e)
                    setLoading(false)
                    if (e?.response?.status == 409) {
                        toast.error("User Already Exits")
                    }
                })
        }
    }

    return (

        <div className='gradientBackground w-screen h-screen flex justify-center items-center overflow-y-auto'>

            <div className='bg-white rounded-md w-fit h-[33rem] flex justify-between items-start'>

                {/* MAIN FORM & HEADINGS  */}
                <div className='w-[19.5rem] min-w-[19.5rem] p-4'>

                    {/* HEADING  */}
                    <div>
                        <h1 className='font-mont text-xl font-medium text-center'>Sign Up</h1>
                        <p className='text-center mt-2 text-sm font-mont text-[#adb5bd]'>Register and enjoy the platform !</p>
                    </div>

                    {/* MAIN INPUT FORMS FIELDS  */}

                    <div className='flex justify-center items-center flex-col mt-3'>

                        {

                            !userRole.nextStep ?

                                <div>
                                    {/* Name  */}
                                    <div className='mb-3'>
                                        <input onChange={onChangeInput} style={{ border: "1px solid black" }} name='firstName' type="text" placeholder='First Name' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.firstName} />
                                    </div>

                                    {/* LAST Name  */}
                                    <div className='mb-3'>
                                        <input onChange={onChangeInput} style={{ border: "1px solid black" }} name='lastName' type="text" placeholder='Last Name' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.lastName} />
                                    </div>

                                    {/* EMAIL  */}
                                    <div className='mb-3'>
                                        <input onChange={onChangeInput} style={{ border: "1px solid black" }} name='emailAddress' type="text" placeholder='Enter Your Email' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.emailAddress} />
                                    </div>

                                    {/* PHONE  */}
                                    <div className='mb-3'>
                                        <input onChange={onChangeInput} style={{ border: "1px solid black" }} name='phoneNo' type="text" placeholder='Enter Your Phone' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.phoneNo} />
                                    </div>

                                    {/* SELECT ROLE  */}

                                    <div className='relative mb-3'>

                                        <div style={{ border: "1px solid black" }} className="relative flex justify-between items-center  outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4">
                                            <p className='font-mont text-[#adb5bd]'>{userData.role}</p>
                                            <BiDownArrow className='text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, role: !showPasswords.role })} />
                                        </div>

                                        {
                                            showPasswords.role ? (
                                                <div className='bg-[#F0EFFF] mb-3 absolute top-[2.3rem] w-[16rem] h-[5rem] rounded-[8px]  pr-3 pl-3 z-50'>
                                                    <p className='mb-3 mt-3 cursor-pointer text-[#A7A3FF]' onClick={() => { setuserData({ ...userData, role: "CUSTOMER" }); setshowPasswords({ ...showPasswords, role: false }) }}>
                                                        Customer
                                                    </p>
                                                    <p className='cursor-pointer text-[#A7A3FF]' onClick={() => { setuserData({ ...userData, role: "SELLER" }); setshowPasswords({ ...showPasswords, role: false }) }}>
                                                        Seller
                                                    </p>
                                                </div>
                                            ) : null}

                                    </div>

                                    {/* PASSWORD  */}
                                    <div className='mb-3 w-[16rem] relative'>
                                        <input onChange={onChangeInput} name="password" style={{ border: "1px solid black" }} type={showPasswords.p1 ? "text" : "password"} placeholder='Enter Your Password' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.password} />
                                        {showPasswords.p1 ?
                                            <AiFillEyeInvisible className='absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, p1: !showPasswords.p1 })} /> :
                                            <AiFillEye className='absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, p1: !showPasswords.p1 })} />
                                        }
                                    </div>

                                    {/* CONFIRM PASSWORD  */}
                                    <div className='w-[16rem] relative mb-3'>
                                        <input onChange={(e) => setconfirmPassword(e.target.value)} style={{ border: "1px solid black" }} type={showPasswords.p2 ? "text" : "password"} placeholder='Confirm Your Password' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={confirmPassword} />
                                        {showPasswords.p2 ?
                                            <AiFillEyeInvisible className='absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, p2: !showPasswords.p2 })} /> :
                                            <AiFillEye className='absolute right-3 top-[0.65rem] text-[#adb5bd] cursor-pointer' onClick={() => setshowPasswords({ ...showPasswords, p2: !showPasswords.p2 })} />
                                        }
                                    </div>
                                    

                                    {/* Register BUTTON  */}

                                    <div>
                                        {
                                            userData?.role === "SELLER" && !userRole.nextStep ?
                                                (
                                                    <div onClick={nextStep} className='mb-3'>
                                                        <button className='outline-none w-[16rem] h-[2.4rem] font-mont rounded-md text-[#adb5bd] bg-[#003049]'>Next</button>
                                                    </div>
                                                ) : (
                                                    <div className='mb-3' onClick={submitForm}>
                                                        <button className='outline-none w-[16rem] h-[2.4rem] font-mont rounded-md text-[#adb5bd] bg-[#003049]'>{!loading ? "Register" : "Loading ..."}</button>
                                                    </div>
                                                )
                                        }
                                    </div>

                                    {/* Already HAVE AN ACCOUNT */}
                                    <div className='w-[16rem] flex justify-end'>
                                        <p className='text-[#adb5bd]'>Already have an account ? <span className='text-slate-700 font-lato cursor-pointer' onClick={() => nav("/")}>Login</span></p>
                                    </div>


                                </div>
                                :

                                <div>
                                    {/* Shop Name  */}
                                    <div className='mb-3'>
                                        <input aria-autocomplete='false' autoComplete='false' onChange={onChangeInput} style={{ border: "1px solid black" }} name='name' type="text" placeholder='Shop Name' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.name} />
                                    </div>

                                    {/* Shop Phone Number  */}
                                    <div className='mb-3'>
                                        <input aria-autocomplete='false' autoComplete='false' onChange={onChangeInput} style={{ border: "1px solid black" }} name='storePhoneNo' type="number" placeholder='Shop Phone Number' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.storePhoneNo} />
                                    </div>

                                    {/* streetAddress  */}
                                    <div className='mb-3'>
                                        <input aria-autocomplete='false' autoComplete='false' onChange={onChangeInput} style={{ border: "1px solid black" }} name='streetAddress' type="text" placeholder='Enter Shop Address' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.streetAddress} />
                                    </div>

                                    {/* Area  */}
                                    <div className='mb-3'>
                                        <input aria-autocomplete='false' autoComplete='false' onChange={onChangeInput} style={{ border: "1px solid black" }} name='area' type="text" placeholder='Enter Your Area' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.area} />
                                    </div>

                                    {/* city  */}
                                    <div className='mb-3'>
                                        <input aria-autocomplete='false' autoComplete='false' onChange={onChangeInput} style={{ border: "1px solid black" }} name='city' type="text" placeholder='Enter City' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.city} />
                                    </div>

                                    {/* zipCode  */}
                                    <div className='mb-3'>
                                        <input aria-autocomplete='false' autoComplete='false' onChange={onChangeInput} style={{ border: "1px solid black" }} name='zipCode' type="text" placeholder='Enter Your Zip Code' className='outline-none w-[16rem] h-[2.2rem] rounded-md pl-3 pr-4' value={userData.zipCode} />
                                    </div>

                                    {/* BACK BUTTON  */}
                                    <div className='mb-3' onClick={() => { setUserRole({ ...userRole, role: "customer", nextStep: false }) }}>
                                        <button className='outline-none w-[16rem] h-[2.4rem] font-mont rounded-md text-[#adb5bd] bg-[#003049]'>Go Back</button>
                                    </div>

                                    {/* Register BUTTON  */}
                                    <div className='mb-3' onClick={submitRegisterForm}>
                                        <button className='outline-none w-[16rem] h-[2.4rem] font-mont rounded-md text-[#adb5bd] bg-[#003049]'>{!loading ? "Register Shop" : "Loading ..."}</button>
                                    </div>

                                    {/* Already HAVE AN ACCOUNT */}
                                    <div className='w-[16rem] flex justify-end'>
                                        <p className='text-[#adb5bd]'>Already have an account ? <span className='text-slate-700 font-lato cursor-pointer' onClick={() => nav("/")}>Login</span></p>
                                    </div>
                                </div>

                        }



                    </div>

                </div>

                {/* IMAGE  */}
                <div className='hidden sm:block w-[20rem] min-w-[20rem]flex justify-end items-end rounded-tr-md rounded-br-md'>
                    <img src={BgImage} alt="Background" className='bg-center w-[20rem] min-w-[20rem] h-[33rem] rounded-tr-md rounded-br-md' />
                </div>

            </div>

            {/* TOASTER  */}
            <Toaster position="top-right" toastOptions={{ duration: 3000, }} />

        </div >
    )
}

export default RegisterForm
