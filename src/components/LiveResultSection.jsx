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

        const formatted = data.map((game) => {
          const lastOpen = game.openNo?.length
            ? game.openNo[game.openNo.length - 1]
            : null;
          const lastClose = game.closeNo?.length
            ? game.closeNo[game.closeNo.length - 1]
            : null;

          if (!lastOpen && !lastClose) {
            return {
              title: game.name,
              numbers: "N/A",
            };
          }

          // Extract parts
          const openMain = lastOpen?.[0] || "";
          const openDigit = lastOpen?.[1] || "";
          const openTime = lastOpen?.[2] || "";
          const openDay = lastOpen?.[4] || "";

          const closeMain = lastClose?.[0] || "";
          const closeDigit = lastClose?.[1] || "";
          const closeTime = lastClose?.[2] || "";
          const closeDay = lastClose?.[4] || "";

          let lastResult = "N/A";

          if (lastOpen && lastClose && openDay === closeDay) {
            // ✅ Same day → combine
            lastResult = `${openMain}-${openDigit}${closeDigit}-${closeMain}`;
          } else if (
            lastOpen &&
            (!lastClose || new Date(openTime) > new Date(closeTime))
          ) {
            // ✅ Only open or newer open
            lastResult = `${openMain}-${openDigit}`;
          } else if (
            lastClose &&
            (!lastOpen || new Date(closeTime) > new Date(openTime))
          ) {
            // ✅ Only close or newer close
            lastResult = `${closeMain}-${closeDigit}`;
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
      <div
        className="bg-warning border border-white m-1 p-3 Live-Result-section-main-container"
        style={{ backgroundColor: "#ffcc99" }}
      >
        <div className="bg-pink text-white text-center py-2 mb-4 fw-bold Live-Result-Heading">
          <h2>💥LIVE RESULT💥</h2>
        </div>
        <p className="text-center">Loading results...</p>
      </div>
    );
  }

  return (
    <div
      className=" border border-white m-1 p-3 Live-Result-section-main-container"
      style={{ backgroundColor: "#ffcc99" }}
    >
      <div
        className="text-white text-center py-1 mb-1 fw-bold Live-Result-Heading"
        style={{ backgroundColor: "#ff00a1" }}
      >
        <h3 style={{ fontSize: "1.2rem", margin: 0 }}>💥LIVE RESULT💥</h3>
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
