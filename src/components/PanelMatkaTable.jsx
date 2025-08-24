import React from "react";
import "./Comman.css";

export default function PanelMatkaTable({ groupedData, groupedByDayOpen }) {
  const headers = ["Week", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

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
    ...Object.values(groupedData).map((dayArr) => dayArr.length),
    ...Object.values(groupedByDayOpen).map((dayArr) => dayArr.length)
  );

  const baseDate = new Date(2019, 3, 22); // month is 0-based → 3 = April

  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const data = Array.from({ length: maxRows }, (_, rowIndex) => {
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() + rowIndex * 7);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekRange = `${formatDate(startOfWeek)}\n to \n${formatDate(
      endOfWeek
    )}`;

    const rowData = Object.values(dayMap).map((shortDay) => {
      const fullDay = Object.keys(dayMap).find(
        (key) => dayMap[key] === shortDay
      );
      
      const openData = groupedByDayOpen[fullDay] && groupedByDayOpen[fullDay][rowIndex]
        ? groupedByDayOpen[fullDay][rowIndex]
        : ["", "", ""];
      
      const closeData = groupedData[fullDay] && groupedData[fullDay][rowIndex]
        ? groupedData[fullDay][rowIndex]
        : ["", "", ""];

      // Determine the combined Jodi value
      const openJodi = openData[1] || '';
      const closeJodi = closeData[1] || '';
      const combinedJodi = (openJodi && closeJodi) ? `${openJodi}${closeJodi}` : '';

      return {
        openPanel: openData[0] || '',
        jodi: combinedJodi,
        closePanel: closeData[0] || ''
      };
    });

    return { weekRange, rowData };
  });

  const redNumbers = ["44", "50", "38", "99", "61", "05", "77", "88", "66"];

  return (
    <div>
      <button className="go-bottom">Go to Bottom</button>
      <table className="matka-table">
        <thead>
          <tr>
            <th colSpan={8} className="title">
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
              <td className="week-cell">
                {row.weekRange.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </td>

              {row.rowData.map(({ openPanel, jodi, closePanel }, colIndex) => (
                <td key={colIndex} className="cell">
                  <div className="data-of-jodi-open-close">
                    <div className="small">
                      <p>{openPanel[0]}</p>
                      <p>{openPanel[1]}</p>
                      <p>{openPanel[2]}</p>
                    </div>
                    <div
                      className={
                        redNumbers.includes(jodi) ? "big red" : "big"
                      }
                    >
                      <h1>{jodi}</h1>
                    </div>
                    <div className="small">
                      <p>{closePanel[0]}</p>
                      <p>{closePanel[1]}</p>
                      <p>{closePanel[2]}</p>
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