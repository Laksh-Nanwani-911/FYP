import { useEffect, useState } from "react";

import UserImage from "../../../assets/home/userImage.webp";
import { FaStar } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";
import { AiFillStar, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import { baseUrl } from "../../../constants/baseUrl";
import { useLocation } from "react-router-dom";
import DataTable from "./DataTable";

const ProductRequest = () => {
  return (
    <div className="p-3 ">
      <h1 className="text-xl font-lato">Product Requests</h1>
      {/* PRODUCT DATA TABLE  */}
      <div className="mt-8">
        <DataTable />
      </div>
    </div>
  );
};

export default ProductRequest;
