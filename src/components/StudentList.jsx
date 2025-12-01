import React, { useState, useEffect } from "react";
import api from "../api";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", age: "" });

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

  const handleEdit = (student) => {
    setEditingStudent(student.id);
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
        "هل أنت متأكد من حذف هذا الطالب؟ سيتم حذف جميع الجلسات المرتبطة به."
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

  return (
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        👥 قائمة الطلاب
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
                عدد الجلسات
              </th>
              <th className="text-right p-3 md:p-4 font-bold text-gray-700 whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-gray-100 hover:bg-blue-50 transition duration-200"
              >
                {editingStudent === student.id ? (
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(student.id)}
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
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

export default StudentList;
