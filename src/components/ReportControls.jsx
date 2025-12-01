import React from "react";
import api from "../api";

const ReportControls = () => {
  const downloadReport = async (type) => {
    try {
      const response = await api.get(`/report/${type}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("فشل في إصدار التقرير");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
      <button
        onClick={() => downloadReport("today")}
        className="bg-green-600 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition duration-200 shadow-md"
      >
        إصدار التقرير اليومي
      </button>
      <button
        onClick={() => downloadReport("month")}
        className="bg-purple-600 text-white font-bold py-2 px-6 rounded hover:bg-purple-700 transition duration-200 shadow-md"
      >
        إصدار التقرير الشهري
      </button>
    </div>
  );
};

export default ReportControls;
