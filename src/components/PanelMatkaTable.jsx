import React from "react";
import "./Comman.css";

export default function PanelMatkaTable({
  groupedData,
  gameName,
  groupedByDayOpen,
}) {
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

  const baseDate = new Date(2019, 3, 22);

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

    const weekRange = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;

    const rowData = Object.values(dayMap).map((shortDay) => {
      const fullDay = Object.keys(dayMap).find(
        (key) => dayMap[key] === shortDay
      );

      const openData =
        groupedByDayOpen[fullDay] && groupedByDayOpen[fullDay][rowIndex]
          ? groupedByDayOpen[fullDay][rowIndex]
          : ["", "", ""];

      const closeData =
        groupedData[fullDay] && groupedData[fullDay][rowIndex]
          ? groupedData[fullDay][rowIndex]
          : ["", "", ""];

      const openJodi = openData[1] || "";
      const closeJodi = closeData[1] || "";
      const combinedJodi =
        openJodi && closeJodi ? `${openJodi}${closeJodi}` : "";

      return {
        openPanel: openData,
        jodi: combinedJodi,
        closePanel: closeData,
      };
    });

    return { weekRange, rowData };
  });

  const redNumbers = ["44", "50", "38", "99", "61", "05", "77", "88", "66"];

  return (
    <div className="panel-table-wrapper">
      <button className="go-bottom">Go to Bottom</button>
      <div className="table-responsive">
        <table className="matka-table">
          <thead>
            <tr>
              <th colSpan={8} className="title">
                {gameName} MATKA PANEL RECORD 2019 - 2025
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
                <td className="week-cell">{row.weekRange}</td>

                {row.rowData.map(
                  ({ openPanel, jodi, closePanel }, colIndex) => (
                    <td key={colIndex} className="cell">
                      {console.log(openPanel,closePanel )                      }
                      {/* ✅ Show only if both open & close have first value */}
                      {openPanel &&
                      closePanel &&
                      openPanel[0] &&
                      closePanel[0] ? (
                        <div className="data-of-jodi-open-close">
                          {/* Open Panel Vertical */}
                          <div
                            className="small-panel"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            {openPanel[0].split("").map((digit, i) => (
                              <span key={i}>{digit}</span>
                            ))}
                          </div>

                          {/* Combined Jodi */}
                          <div
                            className={`big-jodi ${
                              redNumbers.includes(jodi) ? "red" : ""
                            }`}
                          >
                            {jodi || "-"}
                          </div>

                          {/* Close Panel */}
                          <div
                            className="small-panel"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            {closePanel[0].split("").map((digit, i) => (
                              <span key={i}>{digit}</span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div
                          style={{ textAlign: "center", color: "#ccc" }}
                        >
                          -
                        </div>
                      )}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
