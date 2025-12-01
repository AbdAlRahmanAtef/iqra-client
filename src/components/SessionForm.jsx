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
    <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl p-4 md:p-8 w-full max-w-3xl mx-auto mb-8">
      <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        📝 تسجيل جلسة قرآن
      </h2>
      {message && (
        <p
          className={`text-center mb-4 p-3 rounded-lg font-semibold ${
            message.includes("خطأ")
              ? "bg-red-50 text-red-600 border-r-4 border-red-500"
              : "bg-green-50 text-green-600 border-r-4 border-green-500"
          }`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            اسم الطالب
          </label>
          <div className="flex gap-2">
            <select
              name="student_name"
              value={formData.student_name}
              onChange={handleChange}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
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
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white w-[54px] h-[56px] rounded-xl font-bold text-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              title="إضافة طالب جديد"
            >
              +
            </button>
          </div>
        </div>

        {showAddStudent && (
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h3 className="text-sm font-bold mb-3 text-blue-800">
              إضافة طالب جديد
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  الاسم
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                  placeholder="أدخل الاسم"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  العمر (اختياري)
                </label>
                <input
                  type="number"
                  value={newStudentAge}
                  onChange={(e) => setNewStudentAge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm"
                  placeholder="أدخل العمر"
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleAddStudent}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 text-sm"
              >
                ✅ إضافة
              </button>
              <button
                type="button"
                onClick={() => setShowAddStudent(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200 text-sm"
              >
                ❌ إلغاء
              </button>
            </div>
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            الدرس الجديد
          </label>
          <input
            name="new_lesson"
            value={formData.new_lesson}
            onChange={handleChange}
            placeholder="مثال: القلم 1:42"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            المستوى
          </label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
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
          <label className="block text-gray-700 font-semibold mb-2">
            المراجعة
          </label>
          <input
            name="review"
            value={formData.review}
            onChange={handleChange}
            placeholder="مثال: الملك"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            المستوى
          </label>
          <select
            name="review_level"
            value={formData.review_level}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 text-lg"
        >
          حفظ الجلسة
        </button>
      </form>
    </div>
  );
};

export default SessionForm;
