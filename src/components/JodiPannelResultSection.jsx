
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function JodiPannelResultSection() {
  const token = localStorage.getItem("authToken");

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameForPop, setNameForPop] = useState('')
  const [nameSizes, setNameSizes] = useState({}); // ✅ store font size per game

  const [editGame, setEditGame] = useState({
    id: "",
    resultNo: "",
    openOrClose: "",
    day: "",
    date: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);

  let username = null;
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      username = decoded.username;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const navigate = useNavigate();

  const fetchGamesAgain = async () => {
    try {
      const data = await api("/AllGames/");
      if (data.success) {
        setGames(data.data);

        // ✅ preload font sizes from backend if available
        const sizes = {};
        data.data.forEach((game) => {
          sizes[game._id] = game.fontSize || 18;
        });
        setNameSizes(sizes);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamesAgain();
  }, []);

  if (loading) return <div>Loading games...</div>;
  if (error) return <div>Error: {error}</div>;

  // ✅ Save font size to backend
  const handleSaveFontSize = async (gameId) => {
    try {
      const response = await api(`/AllGames/saveFontSize/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({ fontSize: nameSizes[gameId] }),
      });

      if (response.success) {
        alert("Font size saved successfully!");
      } else {
        alert("Failed to save font size: " + response.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving font size");
    }
  };

  const handleEditClick = (game) => {
    const today_date = new Date();
    const dayName = new Date().toLocaleDateString("en-US", {
      weekday: "long",
    });

    setEditGame({
      id: game._id,
      resultNo: "",
      openOrClose: "",
      day: dayName,
      date: today_date,
    });
    setShowEditModal(true);
    setNameForPop(game.name)
  };

  const handleUpdateGame = async (e) => {
    e.preventDefault();

    const gameId = editGame.id;
    const inputValue = editGame.resultNo || "";
    const parts = inputValue.split("-").map((num) => num.trim());

    if (parts.length === 0 || !/^\d+$/.test(parts[0])) {
      alert("Invalid format. Please enter a number like 123-7.");
      return;
    }

    const mainNumber = parts[0];
    const providedCheckDigit = parts[1];

    // ✅ Rule 1: First digit must be smaller than second digit
    if (mainNumber.length >= 2) {
      const firstDigit = parseInt(mainNumber[0], 10);
      const secondDigit = parseInt(mainNumber[1], 10);
      if (firstDigit >= secondDigit) {
        alert("Invalid number: first digit must be smaller than second digit.");
        return;
      }
    }

    // ✅ Rule 2: Validate last 3 digit sum check
    if (mainNumber.length >= 3) {
      const lastThree = mainNumber.slice(-3).split("").map(Number);
      const sum = lastThree.reduce((a, b) => a + b, 0);
      const expectedCheckDigit = sum % 10;

      if (
        providedCheckDigit &&
        parseInt(providedCheckDigit, 10) !== expectedCheckDigit
      ) {
        alert(
          `Invalid number: check digit should be ${expectedCheckDigit} (sum of last 3 digits).`
        );
        return;
      }
    }

    const newResultArray = [mainNumber];
    if (providedCheckDigit) newResultArray.push(providedCheckDigit);

    if (editGame.openOrClose) {
      newResultArray.push(editGame.date);
      newResultArray.push(editGame.openOrClose);
      newResultArray.push(editGame.day);
    }

    try {
      const updateData = await api(`/AllGames/updateGame/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({ resultNo: newResultArray }),
      });
      if (updateData.success) {
        fetchGamesAgain();
        setShowEditModal(false);
        alert("Game Number updated successfully!");
      } else {
        alert("Failed to update game: " + updateData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating game");
    }
  };

  const getDisplayResult = (item) => {
    const lastOpen =
      Array.isArray(item.openNo) && item.openNo.length > 0
        ? item.openNo[item.openNo.length - 1]
        : null;
    const lastClose =
      Array.isArray(item.closeNo) && item.closeNo.length > 0
        ? item.closeNo[item.closeNo.length - 1]
        : null;

    if (!lastOpen && !lastClose) return "No numbers";

    const openMain = lastOpen?.[0] || "";
    const openDigit = lastOpen?.[1] || "";
    const openTime = lastOpen?.[2] || "";
    const openDay = lastOpen?.[4] || "";

    const closeMain = lastClose?.[0] || "";
    const closeDigit = lastClose?.[1] || "";
    const closeTime = lastClose?.[2] || "";
    const closeDay = lastClose?.[4] || "";

    if (lastOpen && lastClose && openDay === closeDay) {
      return `${openMain}-${openDigit}${closeDigit}-${closeMain}`;
    }

    if (lastOpen && (!lastClose || new Date(openTime) > new Date(closeTime))) {
      return `${openMain}-${openDigit}`;
    }

    if (lastClose && (!lastOpen || new Date(closeTime) > new Date(openTime))) {
      return `${closeMain}-${closeDigit}`;
    }

    return "No numbers";
  };

  const handlePageChange = (game, value) => {
    if (value !== "panel") {
      navigate(`/JodiPanPage/${game._id}`);
    } else {
      navigate(`/PanelPage/${game._id}`);
    }
  };

  return (
    <div className="bg-warning border border-white m-1 p-3">
      <div className="bg-pink m-1 p-2 jodi-panel-container-second">
        <h3>WORLD ME SABSE FAST SATTA MATKA RESULT</h3>
      </div>

      {games.map((item, index) => {
        let displayResult = "No numbers";
        if (
          (Array.isArray(item.openNo) && item?.openNo.length > 0) ||
          (Array.isArray(item.resultNo) && item?.resultNo.length > 0)
        ) {
          displayResult = <p>{getDisplayResult(item)}</p>;
        }

        return (
          <div
            className="jodi-panel-container jodi-panel-container-second"
            key={item._id || index}
          >
            <button
              className="btn btn-sm btn-primary button-jodi-panel"
              onClick={() => handlePageChange(item)}
            >
              Jodi
            </button>
            <div>
              {/* ✅ Game name with adjustable font size */}
              <h4 style={{ fontSize: `${nameSizes[item._id] || 18}px` }}>
                {item.name}
              </h4>

              {/* ✅ Font size slider + save button */}
              <input
                type="range"
                min="12"
                max="40"
                value={nameSizes[item._id] || 18}
                onChange={(e) =>
                  setNameSizes({
                    ...nameSizes,
                    [item._id]: Number(e.target.value),
                  })
                }
              />
              <span className="ml-2">{nameSizes[item._id] || 18}px</span>
              <button
                className="btn btn-success btn-sm ml-2"
                onClick={() => handleSaveFontSize(item._id)}
              >
                Save
              </button>

              <h5>{displayResult}</h5>

              {/* ✅ Original EDIT button */}
              <button
                className="btn btn-primary"
                onClick={() => handleEditClick(item)}
                hidden={
                  !(
                    role === "Admin" ||
                    (role === "Agent" && item.owner === username)
                  )
                }
              >
                EDIT
              </button>

              <div className="timeStamp-for-jodi-panel">
                <p>{item.startTime}</p>
                <p>{item.endTime}</p>
              </div>
            </div>
            <button
              onClick={() => handlePageChange(item, "panel")}
              className="btn btn-sm btn-primary button-jodi-panel"
            >
              Panel
            </button>
          </div>
        );
      })}

      {/* ✅ Edit Modal for Results */}
      {showEditModal && (
        <div className="AddGameModelMainContainer">
          <div className="AddGameModelSeconContainer">
            <h2>{nameForPop}</h2>
            <h4>Add Result Number</h4>
            <form onSubmit={handleUpdateGame}>
              <div className="form-group">
                <label htmlFor="openOrClose">Open / Close</label>
                <select
                  id="openOrClose"
                  value={editGame.openOrClose}
                  onChange={(e) =>
                    setEditGame({ ...editGame, openOrClose: e.target.value })
                  }
                  required
                >
                  <option value="">Select Open Close</option>
                  <option value="Open">Open</option>
                  <option value="Close">Close</option>
                </select>
              </div>

              {editGame.openOrClose && (
                <div className="form-group">
                  <label htmlFor="resultNo">Result No</label>
                  <input
                    id="resultNo"
                    type="text"
                    placeholder="e.g. 111-3"
                    value={editGame.resultNo}
                    onChange={(e) =>
                      setEditGame({ ...editGame, resultNo: e.target.value })
                    }
                    required
                  />
                </div>
              )}

              <div className="button-group">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
