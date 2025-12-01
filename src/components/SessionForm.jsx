import React, { useState, useEffect } from "react";
import api from "../api";

const SessionForm = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_name: "",
    new_lesson: "",
    review: "",
    level: "جيد",
    review_level: "جيد",
  });
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentAge, setNewStudentAge] = useState("");
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
      if (response.data.length > 0 && !formData.student_name) {
        setFormData((prev) => ({
          ...prev,
          student_name: response.data[0].name,
        }));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post("/session", formData);
      setMessage("تم حفظ الجلسة بنجاح!");
      setFormData({
        student_name: formData.student_name, // Keep selected student
        new_lesson: "",
        review: "",
        level: "جيد",
        review_level: "جيد",
      });
    } catch (error) {
      console.error(error);
      setMessage("خطأ في حفظ الجلسة.");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    try {
      const response = await api.post("/students", {
        name: newStudentName,
        age: newStudentAge ? parseInt(newStudentAge) : null,
      });
      setStudents([...students, response.data]);
      setFormData({ ...formData, student_name: response.data.name });
      setNewStudentName("");
      setNewStudentAge("");
      setShowAddStudent(false);
      setMessage("تم إضافة الطالب بنجاح!");
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage("خطأ في إضافة الطالب.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        تسجيل جلسة قرآن
      </h2>
      {message && (
        <p
          className={`text-center mb-4 ${
            message.includes("خطأ") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            اسم الطالب
          </label>
          <div className="flex gap-2">
            <select
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {students.map((student) => (
                <option key={student.id} value={student.name}>
                  {student.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAddStudent(!showAddStudent)}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
              title="إضافة طالب جديد"
            >
              +
            </button>
          </div>
        </div>

        {showAddStudent && (
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <label className="block text-sm text-gray-600 mb-1">
              اسم الطالب الجديد
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="أدخل الاسم"
              />
            </div>
            <label className="block text-sm text-gray-600 mb-1">العمر</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={newStudentAge}
                onChange={(e) => setNewStudentAge(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                placeholder="أدخل العمر (اختياري)"
              />
              <button
                type="button"
                onClick={handleAddStudent}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                إضافة
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            درس جديد
          </label>
          <input
            type="text"
            name="new_lesson"
            value={formData.new_lesson}
            onChange={handleChange}
            placeholder="مثال: القلم 1:42"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            المستوى
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-gray-700 font-medium mb-1">مراجعة</label>
          <input
            type="text"
            name="review"
            value={formData.review}
            onChange={handleChange}
            placeholder="مثال: الملك"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            المستوى
          </label>
          <select
            name="review_level"
            value={formData.review_level}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          حفظ الجلسة
        </button>
      </form>
    </div>
  );
};

export default SessionForm;
