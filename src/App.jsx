import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import SessionsPage from "./pages/SessionsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            نظام متابعة حلقات القرآن
          </h1>
          <p className="text-gray-600 mt-2">متابعة تقدم الطلاب</p>
        </header>
        <Navigation />
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
