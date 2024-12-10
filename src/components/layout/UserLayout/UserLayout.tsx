import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
