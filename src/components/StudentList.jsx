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
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        قائمة الطلاب
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-right p-3">الاسم</th>
              <th className="text-right p-3">العمر</th>
              <th className="text-right p-3">عدد الجلسات</th>
              <th className="text-right p-3">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                {editingStudent === student.id ? (
                  <>
                    <td className="p-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={editForm.age}
                        onChange={(e) =>
                          setEditForm({ ...editForm, age: e.target.value })
                        }
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="p-3">{student.session_count}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleUpdate(student.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded ml-2 hover:bg-green-700"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => setEditingStudent(null)}
                        className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                      >
                        إلغاء
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.age || "-"}</td>
                    <td className="p-3">{student.session_count}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-blue-600 text-white px-3 py-1 rounded ml-2 hover:bg-blue-700"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
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

export default StudentList;
