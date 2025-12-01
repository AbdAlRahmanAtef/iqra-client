import React, { useState, useEffect } from "react";
import api from "../api";

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [editForm, setEditForm] = useState({
    student_name: "",
    new_lesson: "",
    review: "",
    level: "جيد",
    review_level: "جيد",
    date_gregorian: "",
  });

  useEffect(() => {
    fetchSessions();
    fetchStudents();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get("/session");
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session.id);
    setEditForm({
      student_name: session.student_name,
      new_lesson: session.new_lesson,
      review: session.review,
      level: session.level,
      review_level: session.review_level || "جيد",
      date_gregorian: session.date_gregorian.split("T")[0],
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/session/${id}`, editForm);
      setEditingSession(null);
      fetchSessions();
    } catch (error) {
      console.error("Error updating session:", error);
      alert("خطأ في تحديث الجلسة");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الجلسة؟")) {
      try {
        await api.delete(`/session/${id}`);
        fetchSessions();
      } catch (error) {
        console.error("Error deleting session:", error);
        alert("خطأ في حذف الجلسة");
      }
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        📋 إدارة الحصص
      </h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-max">
          <thead className="bg-linear-to-r from-blue-50 to-indigo-50">
            <tr className="border-b-2 border-blue-200">
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                التاريخ الهجري
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                التاريخ الميلادي
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                الطالب
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                الحفظ الجديد
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                المستوى
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                مراجعة
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                المستوى
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="border-b border-gray-100 hover:bg-blue-50 transition duration-200"
              >
                {editingSession === session.id ? (
                  <>
                    <td className="p-3 md:p-4">
                      <input
                        type="date"
                        value={editForm.date_gregorian}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            date_gregorian: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                    </td>
                    <td className="p-3 md:p-4">
                      {new Date(editForm.date_gregorian).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="p-3 md:p-4">
                      <select
                        value={editForm.student_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            student_name: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      >
                        {students.map((student) => (
                          <option key={student.id} value={student.name}>
                            {student.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 md:p-4">
                      <input
                        type="text"
                        value={editForm.new_lesson}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            new_lesson: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                    </td>
                    <td className="p-3 md:p-4">
                      <select
                        value={editForm.level}
                        onChange={(e) =>
                          setEditForm({ ...editForm, level: e.target.value })
                        }
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
                    <td className="p-3 md:p-4">
                      <input
                        type="text"
                        value={editForm.review}
                        onChange={(e) =>
                          setEditForm({ ...editForm, review: e.target.value })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                      />
                    </td>
                    <td className="p-3 md:p-4">
                      <select
                        value={editForm.review_level}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            review_level: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
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
                    <td className="p-3 md:p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(session.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                        >
                          ✅ حفظ
                        </button>
                        <button
                          onClick={() => setEditingSession(null)}
                          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                        >
                          ❌ إلغاء
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3 md:p-4 font-medium text-gray-700">
                      {session.date_hijri}
                    </td>
                    <td className="p-3 md:p-4 text-gray-600">
                      {new Date(session.date_gregorian).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="p-3 md:p-4 font-semibold text-blue-700">
                      {session.student_name}
                    </td>
                    <td className="p-3 md:p-4 text-gray-700">
                      {session.new_lesson}
                    </td>
                    <td className="p-3 md:p-4">
                      <span className="inline-block text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                        {session.level}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-gray-700">
                      {session.review}
                    </td>
                    <td className="p-3 md:p-4">
                      <span className="inline-block text-purple-800 px-2 py-1 rounded-full text-sm font-medium">
                        {session.review_level || "-"}
                      </span>
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(session)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionsPage;
