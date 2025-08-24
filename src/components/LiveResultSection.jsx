import React, { useEffect, useState } from "react";
import LiveResultItem from "./LiveResultItem";
import { api } from "../lib/api";

const LiveResultSection = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api("/AllGames/latest-updates");

        // Transform to only keep last resultNo entry
        const formatted = data.map((game) => {

          // ✅ Safely get last values
          const lastOpen = game.openNo?.length
            ? game.openNo[game.openNo.length - 1]
            : null;
          const lastClose = game.closeNo?.length
            ? game.closeNo[game.closeNo.length - 1]
            : null;

          const OpenValue = lastOpen ? lastOpen.slice(0, 2) : "";
          const closeValue = lastClose ? lastClose.slice(0, 2) : "";

          // ✅ Build lastResult only if valid
          let lastResult = "N/A";

          if (OpenValue && closeValue) {
            // ✅ Both present → show combined
            lastResult = `${OpenValue[0]}-${OpenValue[1]}${closeValue[1]}-${closeValue[0]}`;
          } else if (OpenValue) {
            // ✅ Only open present
            lastResult = `${OpenValue[0]}-${OpenValue[1]}`;
          } else if (closeValue) {
            // ✅ Only close present (optional, if you want to allow this case too)
            lastResult = `${closeValue[0]}-${closeValue[1]}`;
          }

          return {
            title: game.name,
            numbers: lastResult,
          };
        });

        setResults(formatted);
      } catch (error) {
        console.error("Error fetching live results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="bg-warning border border-white m-1 p-3 Live-Result-section-main-container">
        <div className="bg-pink text-white text-center py-2 mb-4 fw-bold Live-Result-Heading">
          <h2>💥LIVE RESULT💥</h2>
        </div>
        <p className="text-center">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="bg-warning border border-white m-1 p-3 Live-Result-section-main-container">
      <div className="bg-pink text-white text-center py-2 mb-4 fw-bold Live-Result-Heading">
        <h2>💥LIVE RESULT💥</h2>
      </div>
      <div className="row">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div className="col-md-4" key={idx}>
              <LiveResultItem title={item.title} numbers={item.numbers} />
            </div>
          ))
        ) : (
          <p className="text-center">No live results found.</p>
        )}
      </div>
    </div>
  );
};

export default LiveResultSection;
