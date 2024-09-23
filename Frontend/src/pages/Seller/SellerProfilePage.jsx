import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../../layout/Seller/Profile/Main";

const SellerProfilePage = () => {
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

export default SellerProfilePage;
