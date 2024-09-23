import React, { useEffect } from 'react'
import Main from '../../layout/Seller/Product/single/Main'
import { useNavigate } from 'react-router-dom'
const SingleProductPage = () => {

  const navigate = useNavigate()
  useEffect(()=>{
    if(!localStorage.getItem("sellerId") || !localStorage.getItem("sellerToken")){
      navigate("/")
    }
  },[])

  return (
    <div>
      <Main/>
    </div>
  )
}

export default SingleProductPage
