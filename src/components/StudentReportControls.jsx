import React, { useState, useEffect } from "react";
import api from "../api";

const StudentReportControls = () => {
  const [students, setStudents] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const downloadStudentReport = async (studentName) => {
    setLoadingStudent(studentName);
    try {
      const response = await api.get(
        `/report/student/${encodeURIComponent(studentName)}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `تقرير-${studentName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading student report:", error);
      alert("فشل في إصدار التقرير");
    } finally {
      setLoadingStudent(null);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-6xl mx-auto mt-8">
      <h3 className="text-xl md:text-2xl font-bold mb-6 text-center bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        📋 تقارير الطلاب الفردية
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => downloadStudentReport(student.name)}
            disabled={loadingStudent === student.name}
            className="bg-linear-to-r from-indigo-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loadingStudent === student.name ? (
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
            {student.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentReportControls;
