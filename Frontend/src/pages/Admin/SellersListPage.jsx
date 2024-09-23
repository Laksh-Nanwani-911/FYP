import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import Main from "../../layout/Admin/Sellers/Main";

const SellersListPage = () => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!localStorage.getItem("userId") || !localStorage.getItem("userToken")) {
  //     navigate("/");
  //   }
  // }, []);

  return (
    <div>
      <Main />
    </div>
  );
};

export default SellersListPage;
