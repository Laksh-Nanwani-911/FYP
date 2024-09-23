import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Filter from './Filter'
import { baseUrl } from '../../../constants/baseUrl'
import axios from 'axios'


const Main = () => {

  const [productData, setProductData] = useState([]);
  const [loading, setloading] = useState(true);
  const getAllProducts = () => {
    // setloading(!loading);
    axios.get(`${baseUrl}/product/get-all-active-products`)
      .then((res) => { setProductData(res.data.data); setloading(!loading) })
      .catch((e) => console.log(e))
  }

  console.log(productData)
  useEffect(() => {
    getAllProducts()
  }, [])

  return (
    <div>
      {loading == false && <>
        <Navbar />
        <Filter productData={productData} />
      </>}
    </div>
  )
}

export default Main

