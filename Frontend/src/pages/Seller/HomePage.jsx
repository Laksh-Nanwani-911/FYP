import  { useEffect } from 'react'
import Main from '../../layout/Seller/Home/Main'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

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

export default HomePage
