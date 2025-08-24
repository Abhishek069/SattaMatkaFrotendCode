import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function JodiPannelResultSection() {
  const token = localStorage.getItem("authToken");
  // const role = localStorage.getItem("userRole");

  const CurrentTime = Date();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add");
  let username = null;
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      username = decoded.username; // adjust this key to match your backend payload
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const [newGame, setNewGame] = useState({
    name: "",
    owner: "",
    resultNo: "",
    startTime: "",
    endTime: "",
  });

  const [deleteGameName, setDeleteGameName] = useState("");

  const [editGame, setEditGame] = useState({
    id: "",
    resultNo: "",
    openOrClose: "",
    day: "",
    date: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // -------- New Agent States ----------
  const [newAgent, setNewAgent] = useState({
    name: "",
    mobile: "",
    role: "",
    password: "",
    address: "",
  });

  const navigate = useNavigate();

  const fetchGamesAgain = async () => {
    try {
      const data = await api("/AllGames/");
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

    resultNoArray.push(newGame.day);

    try {
      await api("/AllGames/addGame", {
        method: "POST",
        body: JSON.stringify({ ...newGame, resultNo: resultNoArray }),
      });
      fetchGamesAgain();
      setShowModal(false);
      setNewGame({
        name: "",
        owner: "",
        resultNo: "",
        startTime: "",
        endTime: "",
      });
      alert("Game Added successfully!");
    } catch (err) {
      console.error("Error adding game:", err);
    }
  };

  const handleDeleteGame = async (e) => {
    e.preventDefault();
    try {
      await api(`/AllGames/deleteGame/${deleteGameName}`, { method: "DELETE" });
      fetchGamesAgain();
      setShowModal(false);
      setDeleteGameName("");
      alert("Game Deleted successfully!");
    } catch (err) {
      console.error("Error deleting game:", err);
    }
  };

  const handleEditClick = (game) => {
    const today_date = new Date();
    const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

    setEditGame({
      id: game._id,
      resultNo: "",
      openOrClose: "", // ✅ consistent casing
      day: dayName,
      date: today_date, // ✅ store as "day"
    });
    setShowEditModal(true);
  };

  const getDisplayResult = (item) => {
    console.log()
  const lastOpen = item.openNo?.[item.openNo.length - 1] || [];
  const lastClose = item.closeNo?.[item.closeNo.length - 1] || [];

  const openMain = lastOpen[0] || "";
  const openDigit = lastOpen[1] || "";
  const closeDigit = lastClose[1] || "";
  const closeMain = lastClose[0] || "";

  // Format: openMain-openDigit+closeDigit-closeMain
  return `${openMain}-${openDigit}${closeDigit}-${closeMain}`;
};

  const handleUpdateGame = async (e) => {
    e.preventDefault();

    const gameId = editGame.id;

    // split resultNo safely
    const newResultArray = (editGame.resultNo || "")
      .split("-")
      .map((num) => num.trim())
      .filter((num) => num !== "");

    console.log("You called me!");
    console.log(editGame);
    console.log(editGame.OpenOrclose);

    if (editGame.OpenOrclose) {
      newResultArray.push(editGame.date);
      newResultArray.push(editGame.OpenOrclose);
      newResultArray.push(editGame.day);
    }

    console.log("Final Result Array:", newResultArray);

    try {
      const updateData = await api(`/AllGames/updateGame/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({ resultNo: newResultArray }),
      });
      if (updateData.success) {
        fetchGamesAgain();
        setShowEditModal(false);
        alert("Game Number update successfully!");
      } else {
        alert("Failed to update game: " + updateData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating game");
    }
  };

  const handlePageChange = (game, value) => {
    if (value !== "panel") {
      navigate(`/JodiPanPage/${game._id}`);
    } else {
      navigate(`/PanelPage/${game._id}`);
    }
  };

  // Handle agent form change
  const handleAgentChange = (e) => {
    setNewAgent({ ...newAgent, [e.target.name]: e.target.value });
  };

  // Submit agent form
  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      await api("/user/addUser", {
        method: "POST",
        body: JSON.stringify(newAgent),
      });
      alert("Agent added successfully!");
      setShowModal(false);
      setNewAgent({
        name: "",
        mobile: "",
        role: "",
        address: "",
      });
    } catch (err) {
      console.error("Error adding agent:", err);
    }
  };

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
          // disabled={role !== 'Admin'}
          hidden={role !== "Admin"}
        >
          ADD GAME
        </button>
        <button
          className="m-1 btn btn-lg btn-success"
          onClick={() => {
            setModalType("agent");
            setShowModal(true);
          }}
          hidden={role !== "Admin"}
        >
          ADD AGENT
        </button>
        <button
          className="m-1 btn btn-lg btn-danger"
          onClick={() => {
            setModalType("delete");
            setShowModal(true);
          }}
          hidden={role !== "Admin"}
        >
          DELETE
        </button>
        <button
          className="m-1 btn btn-lg btn-danger"
          onClick={() => {
            setModalType("delete");
            setShowModal(true);
          }}
          hidden={role !== "Admin"}
        >
          Add Throw API
        </button>
      </div>

      {games.map((item, index) => {
        const now = new Date();

        const parseTime = (timeStr) => {
          if (!timeStr) return null;
          const [time, modifier] = timeStr.split(" ");
          let [hours, minutes] = time.split(":").map(Number);

          if (modifier === "PM" && hours < 12) hours += 12;
          if (modifier === "AM" && hours === 12) hours = 0;

          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          return date;
        };

        const start = parseTime(item.startTime);
        // console.log(start,item.name);

        let displayResult = "No numbers";

        if (start) {
          const diffInMs = start - now; // positive if start is in the future
          const diffInMinutes = diffInMs / (1000 * 60);
          // console.log("diff");

          // console.log(diffInMinutes, item.name);

          if (diffInMinutes <= 5 && diffInMinutes >= 0) {
            // If start time is 5 min or less away
            // console.log("loadding...");

            displayResult = "Loading...";
          } else if (
            item.resultNo &&
            Array.isArray(item.resultNo) &&
            item.resultNo.length > 0
          ) {
            displayResult = Array.isArray(
              item.openNo[item.openNo.length -1]
              // item.resultNo[item.resultNo.length - 1]
            )
              // ? item.resultNo[item.resultNo.length - 1]
              //     .filter((val) => !isNaN(val))
              //     .join("-")
              ? <p>{getDisplayResult(item)}</p>
              : item.resultNo[item.resultNo.length - 1];
          }
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
              <h4>{item.name}</h4>
              <h5>{displayResult}</h5>
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

      {/* Add/Delete/Agent Modal */}
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
                  <div className="button-group">
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : modalType === "delete" ? (
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
            ) : (
              <>
                <h4>Add New Agent</h4>
                <form onSubmit={handleAddAgent}>
                  <div className="form-group">
                    <label htmlFor="username">User Name</label>
                    <input
                      id="username"
                      type="text"
                      name="name"
                      value={newAgent.name}
                      onChange={handleAgentChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mobile">Mobile No</label>
                    <input
                      id="mobile"
                      type="text"
                      name="mobile"
                      value={newAgent.mobile}
                      onChange={(e) => {
                        // Allow only digits and max 10 characters
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 10) {
                          handleAgentChange({
                            target: { name: "mobile", value },
                          });
                        }
                      }}
                      maxLength="10"
                      pattern="\d{10}"
                      title="Enter a valid 10-digit mobile number"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      id="role"
                      type="text"
                      name="role"
                      value={newAgent.role}
                      onChange={handleAgentChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="role">Password</label>
                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={newAgent.password}
                      onChange={handleAgentChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <textarea
                      id="address"
                      name="address"
                      value={newAgent.address}
                      onChange={handleAgentChange}
                      required
                    />
                  </div>
                  <div className="button-group">
                    <button type="submit" className="btn btn-success">
                      Save
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
                <label htmlFor="day">Day</label>
                <select
                  id="day"
                  value={editGame.OpenOrclose}
                  onChange={(e) =>
                    setEditGame({ ...editGame, OpenOrclose: e.target.value })
                  }
                  required
                >
                  <option value="">Select Open Close</option>
                  <option value="Open">Open</option>
                  <option value="Close">Close</option>
                </select>
              </div>

              {/* Show input only if Open or Close is selected */}
              {editGame.OpenOrclose && (
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
