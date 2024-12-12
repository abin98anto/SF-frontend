import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./UserLayout.scss"

const UserLayout = () => {
  return (
    <div
      className="user-layout">
      <Header />
      <main className="content" style={{ flex: "1" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
