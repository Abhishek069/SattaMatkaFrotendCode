import React, { useEffect, useState } from "react";
import LiveResultItem from "./LiveResultItem";
import {api} from '../lib/api'

const LiveResultSection = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api("/AllGames/latest-updates");
        // Transform to only keep last resultNo entry
        const formatted = data.map(game => {
          const lastResult = game.resultNo?.[game.resultNo.length - 1];
          let numbers = "";

          // Check if the last element is an array before processing
          if (Array.isArray(lastResult)) {
            numbers = lastResult.slice(0, 3).join("-");
          } else {
            // Handle cases where resultNo is not an array of arrays
            // If it's a string, use it directly. Otherwise, provide a default.
            numbers = lastResult || "N/A"; 
          }

          return {
            title: game.name,
            numbers: numbers
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
