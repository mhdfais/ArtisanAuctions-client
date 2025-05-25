import { Outlet } from "react-router-dom";
import Navbar from "@/components/user/Navbar";
import Footer from "../components/user/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F6F1]">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
