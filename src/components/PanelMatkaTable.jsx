import React from "react";
import "./Comman.css";

export default function PanelMatkaTable({ groupedData }) {
  const headers = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const dayMap = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  const maxRows = Math.max(
    ...Object.values(groupedData).map((dayArr) => dayArr.length)
  );

  // Create rows for the table
  const data = Array.from({ length: maxRows }, (_, rowIndex) =>
    headers.map((shortDay) => {
      const fullDay = Object.keys(dayMap).find(
        (key) => dayMap[key] === shortDay
      );
      const dayData = groupedData[fullDay];
      return dayData && dayData[rowIndex]
        ? dayData[rowIndex] // keep full triple ["765","90","765"]
        : ["", "", ""];
    })
  );

  const redNumbers = ["44", "50", "38", "99", "61", "05", "77", "88", "66"];

  return (
    <div>
      <button className="go-bottom">Go to Bottom</button>
      <table className="matka-table">
        <thead>
          <tr>
            <th colSpan={7} className="title">
              MILAN MORNING MATKA PANEL RECORD 2019 - 2025
            </th>
          </tr>
          <tr>
            {headers.map((day) => (
              <th key={day} className="day">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map(([open, jodi, close], colIndex) => (
                <td key={colIndex} className="cell">
                  <div className="data-of-jodi-open-close">
                    <div className="small">
                      <p>{open[0]}</p>
                      <p>{open[1]}</p>
                      <p>{open[2]}</p>
                    </div>
                    <div
                      className={
                        redNumbers.includes(jodi.toString()) ? "big red" : "big"
                      }
                    >
                      <h1>{jodi}</h1>
                    </div>
                    <div className="small">
                      <p>{close[0]}</p>
                      <p>{close[1]}</p>
                      <p>{close[2]}</p>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
