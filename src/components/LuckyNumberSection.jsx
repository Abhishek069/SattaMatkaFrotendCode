import React from "react";
import "./Comman.css";

const LuckyNumberSection = () => {
  const ankItems = [
  "MAIN KALYAN - 0",
  "MAIN MARKET - 8",
  "MAIN MARKET - 8",
  "MAIN MARKET - 8",
  "MAIN MARKET - 8",
  "MAIN MARKET - 8",
  "MAIN MARKET - 8",
];

  return (
    <div className="bg-warning m-1 border border-white p-3">
      <div
        className="bg-pink text-center py-2 w-100 mb-3 today-lucuky-no"
        style={{ backgroundColor: "#ff5733" }}
      >
        <strong className="text-white lucky-number-section-heading">Today Lucky Number</strong>
      </div>

      <div className="row text-center">
        <div className="col-6 col-md-6 mb-3">
          <h5 className="Gloden-Ank">Golden Ank</h5>
          <p className="Gloden-Ank-Description">0-5-2-7</p>
        </div>

        <div className="col-6 col-md-6 border-start">
          <h5 className="fw-bold Final-Ank">Final Ank</h5>
          <div className="scroll-container">
            <div className="scroll-content">
              {ankItems.map((item, index) => (
                <p className="content-name-city" key={index}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyNumberSection;
