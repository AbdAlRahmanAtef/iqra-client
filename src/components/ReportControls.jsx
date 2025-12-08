import React, { useState } from "react";
import api from "../api";

const ReportControls = () => {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    // Default to first day of current month
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-01`;
  });

  const downloadReport = async (type) => {
    setLoading(true);
    try {
      let url = `/report/${type}?t=${Date.now()}`;
      if (type === "month") {
        url = `/report/month?startDate=${startDate}&t=${Date.now()}`;
      }

      const response = await api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${type}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("فشل في إصدار التقرير");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-4xl mx-auto">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-center ">
        📊{" "}
        <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          التقارير
        </span>
      </h3>

      {/* Date Selector */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2 text-center">
          اختر تاريخ البداية (من هذا التاريخ إلى اليوم)
        </label>
        <div className="flex justify-center">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-center"
          />
        </div>
        <p className="text-center text-gray-500 text-sm mt-2">
          التقرير من: {formatDate(startDate)} إلى اليوم
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
        <button
          onClick={() => downloadReport("today")}
          disabled={loading}
          className="bg-linear-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "📄"
          )}
          إصدار التقرير اليومي
        </button>
        <button
          onClick={() => downloadReport("month")}
          disabled={loading}
          className="bg-linear-to-r from-purple-500 to-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "📊"
          )}
          إصدار التقرير الشهري
        </button>
      </div>
    </div>
  );
};

export default ReportControls;
