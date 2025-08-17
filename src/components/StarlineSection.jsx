// src/components/StarlineSection.jsx
import React from "react";
import StarlineTable from "./StarlineTable";

const StarlineSection = () => {
  const mainStarlineRows = [
    { leftTime: "09:05 AM", leftResult: "250-7", rightTime: "03:05 PM", rightResult: "" },
    { leftTime: "10:05 AM", leftResult: "380-1", rightTime: "04:05 PM", rightResult: "" },
    { leftTime: "11:05 AM", leftResult: "347-4", rightTime: "05:05 PM", rightResult: "" },
    { leftTime: "12:05 PM", leftResult: "", rightTime: "06:05 PM", rightResult: "" },
    { leftTime: "01:05 PM", leftResult: "", rightTime: "07:05 PM", rightResult: "" },
    { leftTime: "02:05 PM", leftResult: "", rightTime: "08:05 PM", rightResult: "" },
  ];

  const mumbaiStarlineRows = [
    { leftTime: "09:30 AM", leftResult: "478-9", rightTime: "03:30 PM", rightResult: "" },
    { leftTime: "10:30 AM", leftResult: "678-1", rightTime: "04:30 PM", rightResult: "" },
    { leftTime: "11:30 AM", leftResult: "446-4", rightTime: "05:30 PM", rightResult: "" },
    { leftTime: "12:30 PM", leftResult: "", rightTime: "06:30 PM", rightResult: "" },
    { leftTime: "01:30 PM", leftResult: "", rightTime: "07:30 PM", rightResult: "" },
    { leftTime: "02:30 PM", leftResult: "", rightTime: "08:30 PM", rightResult: "" },
  ];

  return (
    <div className="container">
      <StarlineTable title="MAIN STARLINE" color="#FFD700" rows={mainStarlineRows} />
      <StarlineTable title="Mumbai Rajshree Star Line Result" color="#ff1493" rows={mumbaiStarlineRows} />
    </div>
  );
};

export default StarlineSection;
