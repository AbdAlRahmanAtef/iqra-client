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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        إدارة الجلسات
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-right p-3">التاريخ الهجري</th>
              <th className="text-right p-3">التاريخ الميلادي</th>
              <th className="text-right p-3">الطالب</th>
              <th className="text-right p-3">درس جديد</th>
              <th className="text-right p-3">المستوى</th>
              <th className="text-right p-3">مراجعة</th>
              <th className="text-right p-3">المستوى</th>
              <th className="text-right p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="border-b border-gray-200 hover:bg-gray-50"
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
                      {new Date(editForm.date_gregorian).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="p-3">
                      <select
                        value={editForm.student_name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            student_name: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      >
                        {students.map((student) => (
                          <option key={student.id} value={student.name}>
                            {student.name}
                          </option>
                        ))}
                      </select>
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
                          setEditForm({ ...editForm, level: e.target.value })
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
                          setEditForm({ ...editForm, review: e.target.value })
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
                      <button
                        onClick={() => handleUpdate(session.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded ml-2 hover:bg-green-700"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingSession(null)}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                      >
                        إلغاء
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{session.date_hijri}</td>
                    <td className="p-3">
                      {new Date(session.date_gregorian).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="p-3">{session.student_name}</td>
                    <td className="p-3">{session.new_lesson}</td>
                    <td className="p-3">{session.level}</td>
                    <td className="p-3">{session.review}</td>
                    <td className="p-3">{session.review_level || "-"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(session)}
                        className="bg-blue-600 text-white px-3 py-1 rounded ml-2 hover:bg-blue-700"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(session.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        حذف
                      </button>
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
