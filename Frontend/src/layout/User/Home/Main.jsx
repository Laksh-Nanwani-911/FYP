import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Hero from "./Hero";
import Services from "./Services";
import CategoriesCard from "./CategoriesCard";
import ProductListing from "../../../components/ProductListing";
import axios from "axios";
import { baseUrl } from "../../../constants/baseUrl";

const Main = () => {
  const [loading, setLoading] = useState(true);

  const [productData, setProductData] = useState([]);
  const [reFetch, setReFetch] = useState(false);
  const getAllProducts = () => {
    axios
      .get(`${baseUrl}/product/get-all-active-products`)
      .then((res) => {
        setProductData(res.data);
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    getAllProducts();
  }, [reFetch]);
  return (
    <div>
      <Navbar productData={productData} />
      <Hero />
      <Services />
      {/* <CategoriesCard/> */}
      {productData?.data?.some((item) => item.isAvailbleForBidding && item?.offersDeadline !== null &&
        new Date(item?.offersDeadline).getTime() > Date.now()) && (
          <ProductListing
            loading={loading}
            setReFetch={setReFetch}
            reFetch={reFetch}
            productData={productData}
            title={"Products Available For Bidding"}
            isVertical={true}
            // paragraph={
            //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, qui dolorem! Ducimus eius nemo voluptas, atque saepe veritatis fugit, voluptatibus iure et officiis enim non ex voluptates labore eum sint."
            // }
          />
        )}
      <ProductListing
        loading={loading}
        setReFetch={setReFetch}
        reFetch={reFetch}
        productData={productData}
        title={"Featured Products"}
        // paragraph={
        //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, qui dolorem! Ducimus eius nemo voluptas, atque saepe veritatis fugit, voluptatibus iure et officiis enim non ex voluptates labore eum sint."
        // }
      />
      <ProductListing
        loading={loading}
        setReFetch={setReFetch}
        reFetch={reFetch}
        productData={productData}
        title={"Best Selling"}
        isVertical={true}
        // paragraph={
        //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, qui dolorem! Ducimus eius nemo voluptas, atque saepe veritatis fugit, voluptatibus iure et officiis enim non ex voluptates labore eum sint."
        // }
      />
      <ProductListing
        loading={loading}
        setReFetch={setReFetch}
        reFetch={reFetch}
        productData={productData}
        title={"New Arrival"}
        // paragraph={
        //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste, qui dolorem! Ducimus eius nemo voluptas, atque saepe veritatis fugit, voluptatibus iure et officiis enim non ex voluptates labore eum sint."
        // }
      />
    </div>
  );
};

export default Main;
