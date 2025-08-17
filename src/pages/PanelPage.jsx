import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import PanelMatkaTable from "../components/PanelMatkaTable";
import { useParams } from "react-router-dom";
import {api} from '../lib/api'

const PanelPage = () => {
  // Initialize with an empty object to prevent errors when trying to access properties
  const [singleGameData, setSingleGameData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams(); // This correctly gets the game ID from the URL

  const fetchSingleGameData = async () => {
    try {
      // const res = await fetch(`http://localhost:5000/AllGames/${id}`);
      // if (!res.ok) {
      //   throw new Error("Network response was not ok");
      // }
      // const data = await res.json();
      const data = await api(`/AllGames/${id}`);
      if (data.success) {
        setSingleGameData(data.data);
        console.log(data.data);
      } else {
        setError("Failed to fetch game data.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) { // Only fetch if an ID is present
      fetchSingleGameData();
    }
  }, [id]); // Rerun effect if the URL ID changes

  if (loading) {
    return <div>Loading game data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  // Grouping the result data by day.
  // This will create an object like:
  // {
  //   "Monday": [ ["123", "45", "678"], ... ],
  //   "Tuesday": [ ["987", "65", "432"], ... ]
  // }
  const groupedByDay = (singleGameData.resultNo || []).reduce((acc, item) => {
    // Ensure the item is an array and has at least 4 elements (3 numbers + 1 day)
    if (Array.isArray(item) && item.length >= 4) {
      const day = item[item.length - 1];
      const numbers = item.slice(0, -1);
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(numbers);
    }
    return acc;
  }, {});
  
  // The description text now uses the fetched data safely
  const description = `Dpboss ${singleGameData.name} jodi chart, ${singleGameData.name} jodi chart, old ${singleGameData.name} jodi chart, dpboss ${singleGameData.name} chart, ${singleGameData.name} jodi record, ${singleGameData.name}jodi record, ${singleGameData.name} jodi chart 2015, ${singleGameData.name} jodi chart 2012, ${singleGameData.name} jodi chart 2012 to 2023, ${singleGameData.name} final ank, ${singleGameData.name} jodi chart.co, ${singleGameData.name} jodi chart matka, matka jodi chart ${singleGameData.name}, matka ${singleGameData.name} chart, satta ${singleGameData.name} chart jodi, ${singleGameData.name} state chart, ${singleGameData.name} chart result, डीपी बॉस, सट्टा चार्ट, सट्टा मटका जोड़ी चार्ट, सट्टा मटका जोड़ी चार्ट, ${singleGameData.name} मटका जोड़ी चार्ट, सट्टा मटका ${singleGameData.name} चार्ट जोड़ी, ${singleGameData.name} सट्टा चार्ट, ${singleGameData.name} जोड़ी चार्ट`;
  console.log(groupedByDay);
  
  return (
    <div className="bg-danger border m-1 border-danger text-center py-2">
      <Header />
      <div
        className="border m-1 border-danger text-center py-2"
        style={{ "background-color": "Pink" }}
      >
        <h3>{singleGameData.name} JODI CHART</h3>
      </div>
      <div className="bg-warning m-1 border border-white py-3 text-center">
        <p>{description}</p>
      </div>
      <div
        className="border m-1 border-danger text-center py-2"
        style={{ "background-color": "Pink" }}
      >
        <h3>{singleGameData.name}</h3>
        <h3>{singleGameData.resultNo[singleGameData.resultNo.length - 1].slice(0, -1).join("-")}</h3>
      </div>
      {/* Pass the grouped data to the MatkaTable component */}
      <PanelMatkaTable groupedData={groupedByDay} />
      <div
        className="border m-1 border-danger text-center py-2"
        style={{ "background-color": "Pink" }}
      >
        <h3>{singleGameData.name}</h3>
        <h3>{singleGameData.resultNo[singleGameData.resultNo.length - 1].slice(0, -1).join("-")}</h3>
      </div>
    </div>
  );
};

export default PanelPage;
