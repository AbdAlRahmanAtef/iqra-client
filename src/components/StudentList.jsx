import React, { useState, useEffect } from "react";
import api from "../api";
import StudentDetailsModal from "./StudentDetailsModal";
import LoadingSpinner from "./LoadingSpinner";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", age: "" });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportLoadingId, setReportLoadingId] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student._id);
    setEditForm({ name: student.name, age: student.age || "" });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/students/${id}`, editForm);
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("خطأ في تحديث الطالب");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع الحصص المرتبطة به."
      )
    ) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("خطأ في حذف الطالب");
      }
    }
  };

  const handleDownloadUnpaidReport = async (student) => {
    setReportLoadingId(student._id);
    try {
      const response = await api.get(`/report/unpaid/${student.name}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `unpaid-lessons-${student.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading unpaid report:", error);
      alert("خطأ في تحميل التقرير");
    } finally {
      setReportLoadingId(null);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center ">
        👥{" "}
        <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {" "}
          قائمة الطلاب
        </span>{" "}
      </h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-max">
          <thead className="bg-linear-to-r from-blue-50 to-indigo-50">
            <tr className="border-b-2 border-blue-200">
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                الاسم
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                العمر
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                عدد الحصص
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                حصص غير مدفوعة
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan="5">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-100 hover:bg-blue-50 transition duration-200"
                >
                  {editingStudent === student._id ? (
                    <>
                      <td className="p-3 md:p-4">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                      </td>
                      <td className="p-3 md:p-4">
                        <input
                          type="number"
                          value={editForm.age}
                          onChange={(e) =>
                            setEditForm({ ...editForm, age: e.target.value })
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                      </td>
                      <td className="p-3 md:p-4">
                        <span className="inline-block text-indigo-800 px-3 py-1 text-sm font-medium">
                          {student.session_count}
                        </span>
                      </td>
                      <td className="p-3 md:p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            student.unpaid_session_count > 0
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {student.unpaid_session_count || 0}
                        </span>
                      </td>
                      <td className="p-3 md:p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(student._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                          >
                            ✅ حفظ
                          </button>
                          <button
                            onClick={() => setEditingStudent(null)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                          >
                            ❌ إلغاء
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 md:p-4 font-semibold text-blue-700 text-lg">
                        {student.name}
                      </td>
                      <td className="p-3 md:p-4 text-gray-600">
                        {student.age || "-"}
                      </td>
                      <td className="p-3 md:p-4">
                        <span className="inline-block text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                          {student.session_count}
                        </span>
                      </td>
                      <td className="p-3 md:p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            student.unpaid_session_count > 0
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {student.unpaid_session_count || 0}
                        </span>
                      </td>
                      <td className="p-3 md:p-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                          >
                            📋 التفاصيل
                          </button>
                          {student.unpaid_session_count > 0 && (
                            <button
                              onClick={() =>
                                handleDownloadUnpaidReport(student)
                              }
                              disabled={reportLoadingId === student._id}
                              className={`px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md flex items-center gap-2 ${
                                reportLoadingId === student._id
                                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-600 text-white"
                              }`}
                            >
                              {reportLoadingId === student._id ? (
                                <>
                                  <svg
                                    className="animate-spin h-4 w-4 text-white"
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
                                  جاري...
                                </>
                              ) : (
                                <>💰 تقرير</>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(student)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default StudentList;
