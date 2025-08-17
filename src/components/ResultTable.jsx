// src/components/ResultTable.jsx
import React from 'react';

const ResultTable = ({ rows }) => (
  <table className="table table-bordered text-center" style={{ backgroundColor: "#ffdead" }}>
    <thead>
      <tr className="table-header">
        <th>Time</th>
        <th>Result</th>
        <th>Time</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      {rows.map((row, index) => (
        <tr key={index}>
          <td>{row.leftTime}</td>
          <td>{row.leftResult}</td>
          <td>{row.rightTime}</td>
          <td>{row.rightResult}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ResultTable;
