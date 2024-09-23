import { Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Account/LoginPage";
import RegisterPage from "../pages/Account/RegisterPage";
import OtpPage from "../pages/Account/OtpPage";
import SendOtp from "../pages/Account/SendOtp";
import ChangePasswordPage from "../pages/Account/ChangePasswordPage";
import UserHomePage from "../pages/User/HomePage";
import SingleProductPageUser from "../pages/User/SingleProductPage";
import SearchProductPage from "../pages/User/SearchProductPage";
import ProductComparison from "../pages/User/ProductComparison";

// SELLER DASHBOARD
import SellerHomePage from "../pages/Seller/HomePage";
import SellerProductPage from "../pages/Seller/ProductPage";
import SellerSingleProductPage from "../pages/Seller/SingleProductPage";
import SellersListPage from "../pages/Admin/SellersListPage";
import ProductRequestsPage from "../pages/Seller/ProductRequestsPage";
import ProductRequestsPagee from "../pages/User/ProductRequestsPage";
import CartScreen from "../pages/User/CartScreen";
import CheckoutScreen from "../pages/User/CheckoutScreen";
import OrdersHistroyScreen from "../pages/User/OrdersHistory";
import SingleOrderSummary from "../layout/User/OrdersHistory/SingleOrderSummary";
import OrdersPage from "../pages/Seller/OrdersPage";
import SellerProfilePage from "../pages/Seller/SellerProfilePage";
import UserProfilePage from "../pages/User/UserProfilePage";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/send/otp" element={<SendOtp />} />
      <Route path="/reset/password" element={<ChangePasswordPage />} />
      {/* USER PAGES  */}
      <Route path="/user/home" element={<UserHomePage />} />
      <Route path="/user/profile" element={<UserProfilePage />} />
      <Route path="/user/product-requests" element={<ProductRequestsPagee />} />
      <Route path="/user/product/:id" element={<SingleProductPageUser />} />
      <Route path="/user/product/search" element={<SearchProductPage />} />
      <Route
        path="/user/product/p1/:id1/p2/:id2"
        element={<ProductComparison />}
      />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/checkout" element={<CheckoutScreen />} />
      <Route path="/orders-history" element={<OrdersHistroyScreen />} />
      <Route path="/order-summary" element={<SingleOrderSummary />} />
      {/* SELLER PAGES  */}
      <Route path="/seller/home/" element={<SellerHomePage />} />
      <Route path="/seller/product" element={<SellerProductPage />} />
      <Route
        path="/seller/product-requests"
        element={<ProductRequestsPage />}
      />
      <Route path="/seller/orders" element={<OrdersPage />} />
      ProductRequestsPage
      <Route
        path="/seller/product/single/:id"
        element={<SellerSingleProductPage />}
      />
      <Route path="/seller/profile" element={<SellerProfilePage />} />
      {/* ADMIN PAGES  */}
      <Route path="/admin/sellers" element={<SellersListPage />} />
    </Routes>
  );
};

export default AllRoutes;
