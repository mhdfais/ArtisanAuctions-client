import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-bold text-indigo-600 opacity-20">404</h1>
      <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mt-4">
        Oops! This Doesn't Exist
      </h2>
      <p className="text-lg text-gray-600 mt-2 max-w-md">
        It seems you've wandered into an empty canvas. Let's get you back to the
        home!
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-[#D6A85F] text-white rounded-full font-semibold hover:bg-[#de9f40] transition-colors duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
