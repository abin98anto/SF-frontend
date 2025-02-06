import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./UserLayout.scss";
import NotificationBell from "../../notification/NotificationBell";

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Header />

      <NotificationBell />
      <main className="content" style={{ flex: "1" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
