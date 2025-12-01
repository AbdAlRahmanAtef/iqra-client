import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md mb-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-reverse space-x-8 py-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded transition ${
              isActive("/")
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            الرئيسية
          </Link>
          <Link
            to="/students"
            className={`px-4 py-2 rounded transition ${
              isActive("/students")
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            الطلاب
          </Link>
          <Link
            to="/sessions"
            className={`px-4 py-2 rounded transition ${
              isActive("/sessions")
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            الجلسات
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
