import React, { useState, useEffect } from "react";
import api from "../api";

const StudentDetailsModal = ({ student, onClose }) => {
  const [sessions, setSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({
    new_lesson: "",
    review: "",
    level: "جيد",
    review_level: "جيد",
    date_gregorian: "",
  });

  useEffect(() => {
    if (student) {
      fetchStudentSessions();
    }
  }, [student]);

  const fetchStudentSessions = async () => {
    try {
      const response = await api.get(`/session/student/${student.name}`);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching student sessions:", error);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session.id);
    setEditForm({
      new_lesson: session.new_lesson,
      review: session.review,
      level: session.level,
      review_level: session.review_level || "جيد",
      date_gregorian: session.date_gregorian.split("T")[0],
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800">
            سجل الطالب: <span className="text-blue-600">{student.name}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="overflow-auto p-6 flex-1">
          <table className="w-full min-w-max">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b-2 border-gray-200">
                <th className="text-right p-3 font-bold text-gray-700 whitespace-nowrap">
                  التاريخ
                </th>
                <th className="text-right p-3 font-bold text-gray-700 whitespace-nowrap">
                  الحفظ الجديد
                </th>
                <th className="text-right p-3 font-bold text-gray-700 whitespace-nowrap">
                  المستوى
                </th>
                <th className="text-right p-3 font-bold text-gray-700 whitespace-nowrap">
                  مراجعة
                </th>
                <th className="text-right p-3 font-bold text-gray-700 whitespace-nowrap">
                  المستوى
                </th>
                <th className="text-right p-3 font-bold text-gray-700 whitespace-nowrap">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    لا توجد حصص مسجلة لهذا الطالب
                  </td>
                </tr>
              ) : (
                sessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition duration-200"
                  >
                    {editingSession === session.id ? (
                      <>
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
                              onClick={() => handleUpdate(session.id)}
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
                        <td className="p-3 text-gray-600">
                          {new Date(session.date_gregorian).toLocaleDateString(
                            "en-GB"
                          )}
                        </td>
                        <td className="p-3 text-gray-700">
                          {session.new_lesson}
                        </td>
                        <td className="p-3">
                          <span className="inline-block text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                            {session.level}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700">{session.review}</td>
                        <td className="p-3">
                          <span className="inline-block text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
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
                              onClick={() => handleDelete(session.id)}
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
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;
