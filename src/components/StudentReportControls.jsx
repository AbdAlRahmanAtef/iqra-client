import React, { useState, useEffect } from "react";
import api from "../api";

const StudentReportControls = () => {
  const [students, setStudents] = useState([]);

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
    try {
      const response = await api.get(
        `/report/student/${encodeURIComponent(studentName)}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `تقرير-${studentName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading student report:", error);
      alert("فشل في إصدار التقرير");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
        تقارير الطلاب الفردية
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {students.map((student) => (
          <button
            key={student.id}
            onClick={() => downloadStudentReport(student.name)}
            className="bg-indigo-600 text-white font-bold py-3 px-6 rounded hover:bg-indigo-700 transition duration-200 shadow-md"
          >
            تقرير {student.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentReportControls;
