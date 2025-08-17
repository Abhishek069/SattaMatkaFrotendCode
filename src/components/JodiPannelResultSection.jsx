import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JodiPannelResultSection({ setGameTitle }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");

  const [newGame, setNewGame] = useState({
    name: "",
    owner: "",
    resultNo: "",
    startTime: "",
    endTime: "", // Added day to the newGame state
  });

  const [deleteGameName, setDeleteGameName] = useState("");

  const [editGame, setEditGame] = useState({ id: "", resultNo: "", day: "" });
  const [showEditModal, setShowEditModal] = useState(false);

  const navigate = useNavigate();

  const fetchGamesAgain = async () => {
    try {
      const res = await fetch("http://localhost:5000/AllGames/");
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      if (data.success) {
        setGames(data.data);
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

  const handleFormChange = (e) => {
    setNewGame({ ...newGame, [e.target.name]: e.target.value });
  };

  const handleAddGame = async (e) => {
    e.preventDefault();

    const resultNoArray = newGame.resultNo
      .split("-")
      .map((num) => num.trim())
      .filter((num) => num !== "");

    // Push the day into the same array
    resultNoArray.push(newGame.day);

    try {
      const res = await fetch("http://localhost:5000/AllGames/addGame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newGame,
          resultNo: resultNoArray, // Sending a single array
        }),
      });

      if (!res.ok) throw new Error("Failed to add game");

      await res.json();
      fetchGamesAgain();
      setShowModal(false);
      setNewGame({
        name: "",
        owner: "",
        resultNo: "",
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      console.error("Error adding game:", err);
    }
  };

  const handleDeleteGame = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:5000/AllGames/deleteGame/${deleteGameName}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete game");

      await res.json();
      fetchGamesAgain();
      setShowModal(false);
      setDeleteGameName("");
    } catch (err) {
      console.error("Error deleting game:", err);
    }
  };

  const handleEditClick = (game) => {
    setEditGame({
      id: game._id,
      resultNo: "",
      day: "",
    });
    setShowEditModal(true);
  };

  console.log(games)
  const handleUpdateGame = async (e) => {
    e.preventDefault();

    const gameId = editGame.id;
    const newResultArray = editGame.resultNo
      .split("-")
      .map((num) => num.trim())
      .filter((num) => num !== "");

    // Push the selected day to the same array
    if (editGame.day) {
      newResultArray.push(editGame.day);
    }

    try {
      // The PUT request now just sends the new result array to be pushed.
      // This is a much cleaner way to handle the update on the backend.
      const updateRes = await fetch(
        `http://localhost:5000/AllGames/updateGame/${gameId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resultNo: newResultArray }),
        }
      );

      const updateData = await updateRes.json();
      if (updateData.success) {
        fetchGamesAgain(); // Fetch all games to get the latest data
        setShowEditModal(false);
      } else {
        alert("Failed to update game: " + updateData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating game");
    }
  };

  const handlePageChange = (game,value) => {
    console.log(game,value);
    if(value!=="panel"){
      navigate(`/JodiPanPage/${game._id}`);
    }
    else{
      navigate(`/PanelPage/${game._id}`); 
    }
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="bg-warning border border-white m-1 p-3">
      <div className="bg-pink m-1 p-2 jodi-panel-container-second">
        <h3>WORLD ME SABSE FAST SATTA MATKA RESULT</h3>
        <button
          className="m-1 btn btn-lg btn-primary"
          onClick={() => {
            setModalType("add");
            setShowModal(true);
          }}
        >
          ADD GAME
        </button>
        <button
          className="m-1 btn btn-lg btn-success"
          onClick={() => {
            setModalType("add");
            setShowModal(true);
          }}
        >
          ADD AGENT
        </button>
        <button
          className="m-1 btn btn-lg btn-danger"
          onClick={() => {
            setModalType("delete");
            setShowModal(true);
          }}
        >
          DELETE
        </button>
      </div>

      {games.map((item, index) => (
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
            <h4>{item.name}</h4>
            <h5>
              {item.resultNo &&
              Array.isArray(item.resultNo) &&
              item.resultNo.length > 0
                ? Array.isArray(item.resultNo[item.resultNo.length - 1])
                  ? item.resultNo[item.resultNo.length - 1]
                      .filter((val) => !isNaN(val)) // remove non-numeric entries
                      .join("-")
                  : item.resultNo[item.resultNo.length - 1]
                : "No numbers"}
            </h5>
            <button
              className="btn btn-primary"
              onClick={() => handleEditClick(item)}
            >
              EDIT
            </button>
            <div className="timeStamp-for-jodi-panel">
              <p>{item.startTime}</p>
              <p>{item.endTime}</p>
            </div>
          </div>
          <button onClick={() => handlePageChange(item,"panel")} className="btn btn-sm btn-primary button-jodi-panel">
            Panel
          </button>
        </div>
      ))}

      {/* Add/Delete Modal */}
      {showModal && (
        <div className="AddGameModelMainContainer">
          <div className="AddGameModelSeconContainer">
            {modalType === "add" ? (
              <>
                <h4>Add New Game</h4>
                <form onSubmit={handleAddGame}>
                  <div className="form-group">
                    <label htmlFor="gameName">Game Name</label>
                    <input
                      id="gameName"
                      type="text"
                      name="name"
                      value={newGame.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="owner">Owner</label>
                    <input
                      id="owner"
                      type="text"
                      name="owner"
                      value={newGame.owner}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <input
                      id="startTime"
                      type="text"
                      name="startTime"
                      value={newGame.startTime}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <input
                      id="endTime"
                      type="text"
                      name="endTime"
                      value={newGame.endTime}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="resultNo">Result No</label>
                    <input
                      id="resultNo"
                      type="text"
                      name="resultNo"
                      placeholder="e.g. 111-33-555"
                      value={newGame.resultNo}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  {/* <div className="form-group">
                    <label htmlFor="day">Day</label>
                    <select
                      id="day"
                      name="day"
                      value={newGame.day}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="">Select a day</option>
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div> */}
                  <div className="button-group">
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h4>Delete Game</h4>
                <form onSubmit={handleDeleteGame}>
                  <div className="form-group">
                    <label htmlFor="deleteGameName">Game Name</label>
                    <input
                      id="deleteGameName"
                      type="text"
                      value={deleteGameName}
                      onChange={(e) => setDeleteGameName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="button-group">
                    <button type="submit" className="btn btn-danger">
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="AddGameModelMainContainer">
          <div className="AddGameModelSeconContainer">
            <h4>Add Result Number</h4>
            <form onSubmit={handleUpdateGame}>
              <div className="form-group">
                <label htmlFor="resultNo">Result No</label>
                <input
                  id="resultNo"
                  type="text"
                  placeholder="e.g. 111-33-555"
                  value={editGame.resultNo}
                  onChange={(e) =>
                    setEditGame({ ...editGame, resultNo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="day">Day</label>
                <select
                  id="day"
                  value={editGame.day}
                  onChange={(e) =>
                    setEditGame({ ...editGame, day: e.target.value })
                  }
                  required
                >
                  <option value="">Select a day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
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
