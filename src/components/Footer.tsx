import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F9F6F1] py-10 mt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl mb-4">Artisan Auctions</h3>
            <p className="text-gray-600 mb-4">
              Connecting collectors with extraordinary artworks since 2023.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-3 font-extralight">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Home</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Auctions</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Artists</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-[#D6A85F] transition-colors">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-3">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Register</Link></li>
              <li><Link to="/login" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Login</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-[#D6A85F] transition-colors">My Bids</Link></li>
              <li><Link to="#" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Settings</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">contact@artisanauctions.com</li>
              <li className="text-gray-600">+1 (555) 123-4567</li>
              <li className="text-gray-600">123 Gallery Avenue, New York</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">&copy; {new Date().getFullYear()} Artisan Auctions. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Terms</Link>
            <Link to="#" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Privacy</Link>
            <Link to="#" className="text-gray-600 hover:text-[#D6A85F] transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
