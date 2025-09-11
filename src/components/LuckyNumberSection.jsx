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
    <div
      className="m-1 border border-white p-2"
      style={{ backgroundColor: "#ffcc99" }}
    >
      <div
        className="text-center py-1 w-100 mb-1 today-lucuky-no"
        style={{ backgroundColor: "#ff00a1" }}
      >
        <strong
          className="text-white lucky-number-section-heading"
          style={{
            color: "#ffffff",
            fontStyle: "italic",
            fontFamily: "'Georgia', serif",
            textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
            fontSize: "1.2rem",
          }}
        >
          Today Lucky Number
        </strong>
      </div>

      <div className="row text-center g-1" style={{ margin: 0 }}>
        <div className="col-6 col-md-6 p-1">
          <h5 className="Gloden-Ank" style={{ fontSize: "1rem", margin: "0.2rem 0" }}>
            Golden Ank
          </h5>
          <p className="Gloden-Ank-Description" style={{ margin: "0", fontSize: "0.9rem" }}>
            0-5-2-7
          </p>
        </div>

        <div className="col-6 col-md-6 border-start p-1">
          <h5 className="fw-bold Final-Ank" style={{ fontSize: "1rem", margin: "0.2rem 0" }}>
            Final Ank
          </h5>
          <div className="scroll-container" style={{ maxHeight: "3rem", overflowY: "auto" }}>
            <div className="scroll-content">
              {ankItems.map((item, index) => (
                <p
                  className="content-name-city"
                  key={index}
                  style={{ margin: "0", fontSize: "0.8rem", lineHeight: "1rem" }}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyNumberSection;
