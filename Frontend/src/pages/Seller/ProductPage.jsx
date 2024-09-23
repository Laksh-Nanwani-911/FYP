import React, { useEffect } from 'react'
import Main from '../../layout/Seller/Product/Main'
import { useNavigate } from 'react-router-dom'

const ProductPage = () => {

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

export default ProductPage
