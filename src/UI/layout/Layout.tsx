import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";

const Layout = () => {
  function clearStorage() {
    let session = sessionStorage.getItem("register");

    if (session == null) {
      localStorage.removeItem("x-auth-token");
    }

    sessionStorage.setItem("register", "1");
  }
  clearStorage();
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
