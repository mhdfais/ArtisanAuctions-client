import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.isLoggedIn);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="w-full bg-[#F9F6F1] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="font-serif text-xl sm:text-2xl font-bold text-[#2E2E2E] z-10"
      >
        Artisan Auctions
      </Link>

      {/* Mobile menu button */}
      <button
        className="md:hidden text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] rounded z-10"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop navigation */}
      <div className="hidden md:flex space-x-4 lg:space-x-8 items-center">
        <Link
          to="/"
          className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors text-sm lg:text-base"
        >
          Home
        </Link>
        <Link
          to="/auctions"
          className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors text-sm lg:text-base"
        >
          Auctions
        </Link>
        <Link
          to="/artists"
          className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors text-sm lg:text-base"
        >
          Artists
        </Link>
        <Link
          to="/about"
          className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors text-sm lg:text-base"
        >
          About
        </Link>
      </div>

      {/* Desktop auth buttons */}
      <div className="hidden md:flex space-x-4 items-center">
        {!user ? (
          <>
            <Link
              to="/login"
              className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors text-sm lg:text-base"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#D6A85F] text-white px-4 lg:px-6 py-2 rounded-md hover:bg-[#de9f40] transition-all duration-200 text-sm lg:text-base"
            >
              Register
            </Link>
          </>
        ) : (
          <Link
            to="/profile"
            className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors"
          >
            <UserCircle size={28} />
          </Link>
        )}
      </div>

      {/* Mobile navigation menu */}
      <div
        className={`${
          isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } absolute top-0 left-0 w-full min-h-screen bg-[#F9F6F1] flex flex-col pt-20 px-6 md:hidden z-40 transition-all duration-300 ease-in-out`}
      >
        {/* Close button inside mobile menu */}
        <button
          className="self-end text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] rounded mb-4"
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <Link
          to="/"
          className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors py-4 border-b border-[#D6A85F]/20 text-lg"
          onClick={toggleMenu}
        >
          Home
        </Link>
        <Link
          to="/auctions"
          className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors py-4 border-b border-[#D6A85F]/20 text-lg"
          onClick={toggleMenu}
        >
          Auctions
        </Link>
        <Link
          to="/artists"
          className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors py-4 border-b border-[#D6A85F]/20 text-lg"
          onClick={toggleMenu}
        >
          Artists
        </Link>
        <Link
          to="/about"
          className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors py-4 border-b border-[#D6A85F]/20 text-lg"
          onClick={toggleMenu}
        >
          About
        </Link>
        {!user ? (
          <div className="flex flex-col space-y-4 mt-6">
            <Link
              to="/login"
              className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors py-4 border-b border-[#D6A85F]/20 text-lg text-center"
              onClick={toggleMenu}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#D6A85F] text-white px-6 py-3 rounded-md hover:bg-[#de9f40] transition-all duration-200 text-lg text-center"
              onClick={toggleMenu}
            >
              Register
            </Link>
          </div>
        ) : (
          <Link
            to="/profile"
            className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors py-4 border-b border-[#D6A85F]/20 text-lg flex items-center"
            onClick={toggleMenu}
          >
            <UserCircle size={25} className="mr-2" /> Profile
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;