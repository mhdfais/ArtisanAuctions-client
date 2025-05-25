import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, UserCircle, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store/store";
import { logout } from "@/redux/store/authSlice";
import useToast from "@/hooks/useToast";
import { logoutUser } from "@/services/userService";
import Swal from "sweetalert2";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { error } = useToast();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D6A85F",
      cancelButtonColor: "#EAD7D1",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      backdrop: true,
    });

    if (result.isConfirmed) {
      try {
        await logoutUser();
        dispatch(logout());
        setIsDropdownOpen(false);
      } catch (err) {
        error("Error", "Failed to logout");
      }
    }
  };

  useEffect(() => {
    // ------ close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-[#F9F6F1] py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center sticky top-0 z-50">
      <Link
        to="/"
        className="font-serif text-xl sm:text-2xl font-bold text-[#2E2E2E] z-10"
      >
        Artisan Auctions
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-[#2E2E2E] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] rounded z-10"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop Navigation */}
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

      {/* Desktop Auth/Profile Buttons */}
      <div
        className="hidden md:flex space-x-4 items-center relative"
        ref={dropdownRef}
      >
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
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-1 text-[#2E2E2E] hover:text-[#D6A85F] transition-colors focus:outline-none"
              aria-label="Profile dropdown"
            >
              <UserCircle size={28} />
              <span className="text-sm">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-[#2E2E2E] hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[#2E2E2E] hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } absolute top-0 left-0 w-full min-h-screen bg-[#F9F6F1] flex flex-col pt-20 px-6 md:hidden z-40 transition-all duration-300 ease-in-out`}
      >
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
          <div className="flex flex-col mt-6 space-y-4">
            <Link
              to="/profile"
              className="text-[#2E2E2E] hover:text-[#D6A85F] transition-colors py-4 border-b border-[#D6A85F]/20 text-lg flex items-center"
              onClick={toggleMenu}
            >
              <UserCircle size={25} className="mr-2" /> Profile
            </Link>
            <button
              onClick={() => {
                handleLogout();
                toggleMenu();
              }}
              className="w-full text-left px-4 py-3 text-[#2E2E2E] text-lg hover:bg-[#f1e9dc] rounded-md flex items-center"
            >
              <LogOut size={20} className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
