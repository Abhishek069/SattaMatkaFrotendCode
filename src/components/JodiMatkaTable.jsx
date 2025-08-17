import React from "react";
import "./Comman.css";

export default function MatkaTable({groupedData,lastIndexFortheResult}) {
  
  console.log(lastIndexFortheResult)
  
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

  console.log(maxRows)
  // Create rows: each row contains the 2nd value from each day's array
  const data = Array.from({ length: maxRows }, (_, rowIndex) =>
    headers.map((shortDay) => {
      const fullDay = Object.keys(dayMap).find(
        (key) => dayMap[key] === shortDay
      );
      const dayData = groupedData[fullDay];
      return dayData && dayData[rowIndex]
        ? dayData[rowIndex][1] // <-- Only take 2nd value
        : ""; // Empty if no data for that slot
    })
  );

  console.log(data);
  console.log("data", groupedData);
  


  const redNumbers = ["44", "50", "38", "99", "61", "05", "77", "88", "66"];

  return (
    <div>
      <button className="go-bottom">Go to Bottom</button>
      <table className="matka-table">
        <thead>
          <tr>
            <th colSpan={7} className="title">
              MILAN MORNING MATKA JODI RECORD 2019 - 2025
            </th>
          </tr>
          <tr>
            {headers.map((day) => (
              <th key={day} className="day">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  className={redNumbers.includes(cell.toString()) ? "red" : ""}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
