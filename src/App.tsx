// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Layout from "./components/layout/Layout";
// import LandingPage from "./pages/user/LandingPage";

import Footer from "./components/layout/Footer/Footer";
import Header from "./components/layout/Header/Header";

const App = () => {
  return (
    <div className="container">
      <Header/>
      <h1 className="header">Hello, Tailwind CSS!</h1>
      <ul>
        <li>hhh</li>
        <li>hhh</li>
        <li>hhh</li>
        <li>hhh</li>
      </ul>
      <Footer />
    </div>
  );
};

export default App;
