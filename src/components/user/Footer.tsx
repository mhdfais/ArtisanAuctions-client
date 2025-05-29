import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gradient-to-r from-[#2E2E2E] to-[#4A4A4A] py-12 mt-16 border-t-4 border-[#D6A85F]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl mb-4 text-white font-bold">Artisan Auctions</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-[#D6A85F] to-[#E8B866] rounded-full mb-4"></div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Connecting collectors with extraordinary artworks since 2023. Your gateway to the world's finest art.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-4 font-semibold text-white">Navigation</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-[#D6A85F] transition-colors duration-200 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-[#D6A85F] transition-colors duration-200 relative group">
                Auctions
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-[#D6A85F] transition-colors duration-200 relative group">
                Artists
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-[#D6A85F] transition-colors duration-200 relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-4 font-semibold text-white">Account</h4>
            <ul className="space-y-3">
              <li><Link to="/register" className="text-gray-300 hover:text-[#D6A85F] transition-colors duration-200 relative group">
                Register
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-[#D6A85F] transition-colors duration-200 relative group">
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-[#D6A85F] transition-colors duration-200 relative group">
                My Bids
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-[#D6A85F] transition-colors duration-200 relative group">
                Settings
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D6A85F] transition-all duration-300 group-hover:w-full"></span>
              </Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-4 font-semibold text-white">Contact</h4>
            <div className="space-y-3">
              <div className="text-gray-300">
                <span className="text-[#D6A85F] font-medium">Email:</span><br />
                contact@artisanauctions.com
              </div>
              <div className="text-gray-300">
                <span className="text-[#D6A85F] font-medium">Phone:</span><br />
                +1 (555) 123-4567
              </div>
              <div className="text-gray-300">
                <span className="text-[#D6A85F] font-medium">Address:</span><br />
                123 Gallery Avenue, New York
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-600 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Artisan Auctions. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-gray-400 hover:text-[#D6A85F] transition-colors duration-200 text-sm">Terms</Link>
            <Link to="#" className="text-gray-400 hover:text-[#D6A85F] transition-colors duration-200 text-sm">Privacy</Link>
            <Link to="#" className="text-gray-400 hover:text-[#D6A85F] transition-colors duration-200 text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
