import React from "react";
import SessionForm from "../components/SessionForm";
import ReportControls from "../components/ReportControls";
import StudentReportControls from "../components/StudentReportControls";

const HomePage = () => {
  return (
    <div className="space-y-8">
      <SessionForm />
      <ReportControls />
      <StudentReportControls />
    </div>
  );
};

export default HomePage;
