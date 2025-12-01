import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-lg mb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center py-4 gap-4">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-3xl">📖</span>
            <h1 className="text-lg md:text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              نظام متابعة حلقات القرآن
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <Link
              to="/"
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                isActive("/")
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              🏠 الرئيسية
            </Link>
            <Link
              to="/students"
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                isActive("/students")
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              👥 الطلاب
            </Link>
            <Link
              to="/sessions"
              className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                isActive("/sessions")
                  ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              📚 الحصص
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-linear-to-r from-red-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              🚪 تسجيل خروج
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
