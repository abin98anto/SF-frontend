import { useSelector } from "react-redux";
import { AppRootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Ledger = () => {
  const { isAuthenticated } = useSelector(
    (state: AppRootState) => state.adminLogin
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated]);

  return <div>Ledger</div>;
};

export default Ledger;
