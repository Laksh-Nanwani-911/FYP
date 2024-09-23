import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../../layout/Seller/ProductRequest/Main";

const ProductRequestsPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (
      !localStorage.getItem("sellerId") ||
      !localStorage.getItem("sellerToken")
    ) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <Main />
    </div>
  );
};

export default ProductRequestsPage;
