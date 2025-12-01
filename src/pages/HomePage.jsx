import React from "react";
import SessionForm from "../components/SessionForm";
import ReportControls from "../components/ReportControls";
import StudentReportControls from "../components/StudentReportControls";

const HomePage = () => {
  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
      <SessionForm />
      <ReportControls />
      <StudentReportControls />
    </div>
  );
};

export default HomePage;
