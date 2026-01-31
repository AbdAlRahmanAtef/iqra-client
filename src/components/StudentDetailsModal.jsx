import React, { useState, useEffect } from "react";
import api from "../api";
import LoadingSpinner from "./LoadingSpinner";

const StudentDetailsModal = ({ student, onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({
    new_lesson: "",
    review: "",
    level: "جيد",
    review_level: "جيد",
    date_gregorian: "",
    is_paid: false,
  });

  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    new_lesson: "",
    review: "",
    level: "جيد",
    review_level: "جيد",
    is_paid: false,
  });

  useEffect(() => {
    if (student) {
      fetchStudentSessions();
      setShowAddForm(false); // Reset form visibility when student changes
    }
  }, [student]);

  const fetchStudentSessions = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/session/student/${student.name}`);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching student sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    try {
      await api.post("/session", {
        ...addForm,
        student_name: student.name,
      });
      setAddForm({
        new_lesson: "",
        review: "",
        level: "جيد",
        review_level: "جيد",
        is_paid: false,
      });
      setShowAddForm(false);
      fetchStudentSessions();
      alert("تم إضافة الحصة بنجاح");
    } catch (error) {
      console.error("Error adding session:", error);
      alert("خطأ في إضافة الحصة");
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session._id);
    setEditForm({
      new_lesson: session.new_lesson,
      review: session.review,
      level: session.level,
      review_level: session.review_level || "جيد",
      date_gregorian: session.date_gregorian.split("T")[0],
      is_paid: session.is_paid || false,
    });
  };

  const handleUpdate = async (id) => {
    try {
      // We need to send student_name as well because the backend requires it
      await api.put(`/session/${id}`, {
        ...editForm,
        student_name: student.name,
      });
      setEditingSession(null);
      fetchStudentSessions();
    } catch (error) {
      console.error("Error updating session:", error);
      alert("خطأ في تحديث الجلسة");
    }
  };

  const handleTogglePaid = async (session) => {
    try {
      await api.put(`/session/${session._id}`, {
        student_name: session.student_name || student.name,
        new_lesson: session.new_lesson,
        review: session.review,
        level: session.level,
        review_level: session.review_level,
        is_paid: !session.is_paid,
      });
      fetchStudentSessions();
    } catch (error) {
      console.error("Error toggling paid status:", error);
      alert("خطأ في تحديث حالة الدفع");
    }
  };

  const handleDownloadUnpaidReport = async () => {
    setReportLoading(true);
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
      setReportLoading(false);
    }
  };

  const handleDownloadLastSevenReport = async () => {
    setReportLoading(true);
    try {
      const response = await api.get(`/report/last7/${student.name}`, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `last-7-lessons-${student.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading last 7 report:", error);
      alert("خطأ في تحميل التقرير");
    } finally {
      setReportLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الجلسة؟")) {
      try {
        await api.delete(`/session/${id}`);
        fetchStudentSessions();
      } catch (error) {
        console.error("Error deleting session:", error);
        alert("خطأ في حذف الجلسة");
      }
    }
  };

  if (!student) return null;

  const unpaidCount = sessions.filter((s) => !s.is_paid).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-[100px]">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col"
        style={{ maxHeight: "calc(100vh - 100px)" }}
      >
        {/* Header - Fixed at top */}
        <div
          className="p-6 border-b border-gray-200 flex justify-between items-center bg-blue-600 rounded-t-2xl"
          style={{ flexShrink: 0 }}
        >
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold" style={{ color: "white" }}>
              سجل الطالب:{" "}
              <span style={{ color: "#bfdbfe" }}>{student.name}</span>
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm flex items-center gap-2"
            >
              {showAddForm ? "❌ إلغاء" : "➕ إضافة حصة جديدة"}
            </button>
            {unpaidCount > 0 && (
              <button
                onClick={handleDownloadUnpaidReport}
                disabled={reportLoading}
                className={`px-4 py-2 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-2 ${
                  reportLoading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {reportLoading ? (
                  <>
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
                    جاري التحميل...
                  </>
                ) : (
                  <>💰 تحميل تقرير غير المدفوعة ({unpaidCount})</>
                )}
              </button>
            )}
            {sessions.length > 0 && (
              <button
                onClick={handleDownloadLastSevenReport}
                disabled={reportLoading}
                className={`px-4 py-2 rounded-lg font-bold transition-colors shadow-sm flex items-center gap-2 ${
                  reportLoading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-purple-500 text-white hover:bg-purple-600"
                }`}
              >
                {reportLoading ? "..." : "📄 آخر 7 حصص"}
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 transition-all rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Add Session Form */}
        {showAddForm && (
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <form
              onSubmit={handleAddSession}
              className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  الدرس الجديد
                </label>
                <input
                  type="text"
                  value={addForm.new_lesson}
                  onChange={(e) =>
                    setAddForm({ ...addForm, new_lesson: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="مثال: القلم 1:42"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  المستوى
                </label>
                <select
                  value={addForm.level}
                  onChange={(e) =>
                    setAddForm({ ...addForm, level: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                >
                  <option value="إعادة">إعادة</option>
                  <option value="⏳ انتظار">⏳ انتظار</option>
                  <option value="ممتاز">ممتاز</option>
                  <option value="جيد جدا">جيد جدا</option>
                  <option value="جيد">جيد</option>
                  <option value="مقبول">مقبول</option>
                  <option value="ضعيف">ضعيف</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  المراجعة
                </label>
                <input
                  type="text"
                  value={addForm.review}
                  onChange={(e) =>
                    setAddForm({ ...addForm, review: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                  placeholder="مثال: الملك"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  المستوى
                </label>
                <select
                  value={addForm.review_level}
                  onChange={(e) =>
                    setAddForm({ ...addForm, review_level: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 outline-none"
                >
                  <option value="إعادة">إعادة</option>
                  <option value="⏳ انتظار">⏳ انتظار</option>
                  <option value="ممتاز">ممتاز</option>
                  <option value="جيد جدا">جيد جدا</option>
                  <option value="جيد">جيد</option>
                  <option value="مقبول">مقبول</option>
                  <option value="ضعيف">ضعيف</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_paid_add"
                  checked={addForm.is_paid}
                  onChange={(e) =>
                    setAddForm({ ...addForm, is_paid: e.target.checked })
                  }
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <label
                  htmlFor="is_paid_add"
                  className="text-sm font-semibold text-gray-700"
                >
                  مدفوعة
                </label>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md h-[42px]"
              >
                حفظ
              </button>
            </form>
          </div>
        )}

        {/* Table Container - Scrollable */}
        <div className="p-6" style={{ overflowY: "auto", flex: 1 }}>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full min-w-max">
              <thead
                className="bg-blue-50"
                style={{ position: "sticky", top: 0 }}
              >
                <tr className="border-b-2 border-blue-200">
                  <th className="text-right p-4 font-bold text-gray-700 whitespace-nowrap">
                    الحالة
                  </th>
                  <th className="text-right p-4 font-bold text-gray-700 whitespace-nowrap">
                    التاريخ
                  </th>
                  <th className="text-right p-4 font-bold text-gray-700 whitespace-nowrap">
                    الحفظ الجديد
                  </th>
                  <th className="text-right p-4 font-bold text-gray-700 whitespace-nowrap">
                    المستوى
                  </th>
                  <th className="text-right p-4 font-bold text-gray-700 whitespace-nowrap">
                    مراجعة
                  </th>
                  <th className="text-right p-4 font-bold text-gray-700 whitespace-nowrap">
                    المستوى
                  </th>
                  <th className="text-right p-4 font-bold text-gray-700 whitespace-nowrap">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="7">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">
                      لا توجد حصص مسجلة لهذا الطالب
                    </td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr
                      key={session._id}
                      className={`border-b border-gray-100 hover:bg-blue-50 transition duration-200 ${
                        session.is_paid ? "bg-green-50" : ""
                      }`}
                    >
                      {editingSession === session._id ? (
                        <>
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={editForm.is_paid}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  is_paid: e.target.checked,
                                })
                              }
                              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="date"
                              value={editForm.date_gregorian}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  date_gregorian: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editForm.new_lesson}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  new_lesson: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={editForm.level}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  level: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            >
                              <option value="إعادة">إعادة</option>
                              <option value="⏳ انتظار">⏳ انتظار</option>
                              <option value="ممتاز">ممتاز</option>
                              <option value="جيد جدا">جيد جدا</option>
                              <option value="جيد">جيد</option>
                              <option value="مقبول">مقبول</option>
                              <option value="ضعيف">ضعيف</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={editForm.review}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  review: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="p-3">
                            <select
                              value={editForm.review_level}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  review_level: e.target.value,
                                })
                              }
                              className="border border-gray-300 rounded px-2 py-1 w-full"
                            >
                              <option value="إعادة">إعادة</option>
                              <option value="⏳ انتظار">⏳ انتظار</option>
                              <option value="ممتاز">ممتاز</option>
                              <option value="جيد جدا">جيد جدا</option>
                              <option value="جيد">جيد</option>
                              <option value="مقبول">مقبول</option>
                              <option value="ضعيف">ضعيف</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(session._id)}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                              >
                                حفظ
                              </button>
                              <button
                                onClick={() => setEditingSession(null)}
                                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                              >
                                إلغاء
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3">
                            <button
                              onClick={() => handleTogglePaid(session)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                session.is_paid
                                  ? "bg-green-500 text-white hover:bg-green-600"
                                  : "bg-gray-200 text-gray-500 hover:bg-gray-300"
                              }`}
                              title={
                                session.is_paid
                                  ? "مدفوعة - اضغط للإلغاء"
                                  : "غير مدفوعة - اضغط للتأكيد"
                              }
                            >
                              {session.is_paid ? "✓" : "○"}
                            </button>
                          </td>
                          <td
                            className={`p-3 text-gray-600 ${
                              session.is_paid ? "line-through opacity-60" : ""
                            }`}
                          >
                            {new Date(
                              session.date_gregorian
                            ).toLocaleDateString("en-GB")}
                          </td>
                          <td
                            className={`p-3 text-gray-700 ${
                              session.is_paid ? "line-through opacity-60" : ""
                            }`}
                          >
                            {session.new_lesson}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-block text-blue-800 px-2 py-1 rounded-full text-sm font-medium ${
                                session.is_paid ? "opacity-60" : ""
                              }`}
                            >
                              {session.level}
                            </span>
                          </td>
                          <td
                            className={`p-3 text-gray-700 ${
                              session.is_paid ? "line-through opacity-60" : ""
                            }`}
                          >
                            {session.review}
                          </td>
                          <td className="p-3">
                            <span
                              className={`inline-block text-purple-800 px-2 py-1 rounded-full text-sm font-medium ${
                                session.is_paid ? "opacity-60" : ""
                              }`}
                            >
                              {session.review_level || "-"}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(session)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                              >
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDelete(session._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
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
        </div>
        <div className="p-4 border-t border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2.5 rounded-xl font-semibold transition duration-200 shadow-md hover:shadow-lg"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
