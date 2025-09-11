import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

// 🔹 Small component for blinking notification messages
const BlinkingNotification = ({
  messages,
  interval = 3000,
  color = "#ff0000",
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, interval);
    return () => clearInterval(timer);
  }, [messages, interval]);

  return <h3 style={{ color }}>{messages[index]}</h3>;
};

export default function JodiPannelResultSection() {
  const token = localStorage.getItem("authToken");

  const [games, setGames] = useState([]);
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameForPop, setNameForPop] = useState("");
  const [nameSizes, setNameSizes] = useState({});

  const [editGame, setEditGame] = useState({
    id: "",
    resultNo: "",
    openOrClose: "",
    day: "",
    date: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  // 🔹 New state for Admin functions
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("addGame");

  const [newGame, setNewGame] = useState({
    name: "",
    owner: "",
    resultNo: "111-11-111",
    startTime: "",
    endTime: "",
    nameColor: "#000000", // default black
    resultColor: "#000000", // default black
    panelColor: "#000000", // default white
    notificationColor: "#ff0000", // default red
  });

  const [newAgent, setNewAgent] = useState({
    name: "",
    mobile: "",
    role: "",
    password: "",
    address: "",
  });

  const [deleteGameName, setDeleteGameName] = useState("");
  const [linkForUpdateGame, setLinkForUpdateGame] = useState("");

  // 🔹 Handlers
  // const handleFormChange = (e) => {
  //   setNewGame({ ...newGame, [e.target.name]: e.target.value });
  // };

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      await api("/AllGames/addGame", {
        method: "POST",
        body: JSON.stringify(newGame),
      });
      fetchGamesAgain();
      setShowModal(false);
      alert("Game added successfully!");
      setNewGame({
        name: "",
        owner: "",
        resultNo: "",
        startTime: "",
        endTime: "",
        nameColor: "#000000",
        resultColor: "#000000",
        backgroundColor: "#ffffff",
        notificationColor: "#ff0000",
      });
    } catch (err) {
      console.error("Error adding game:", err);
    }
  };

  const handleAddAgent = async (e) => {
    e.preventDefault();
    try {
      await api("/user/addUser", {
        method: "POST",
        body: JSON.stringify(newAgent),
      });
      alert("Agent added successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Error adding agent:", err);
    }
  };

  const handleDeleteGame = async (e) => {
    e.preventDefault();
    try {
      await api(`/AllGames/deleteGame/${deleteGameName}`, { method: "DELETE" });
      fetchGamesAgain();
      setShowModal(false);
      alert("Game deleted successfully!");
      setDeleteGameName("");
    } catch (err) {
      console.error("Error deleting game:", err);
    }
  };

  const fetchAndUpdateGame = async (e) => {
    e.preventDefault();
    try {
      const response = await api("/AllGames/api/getGameFormLink", {
        method: "POST",
        body: JSON.stringify({
          url: linkForUpdateGame,
          userName: username,
          admin: role,
        }),
      });
      if (response.success) {
        alert("Games updated successfully!");
      } else {
        alert("Failed: " + response.error);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error updating from link:", err);
    }
  };

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
    setNameForPop(game.name);
  };

const handleUpdateGame = async (e) => {
  e.preventDefault();
  const gameId = editGame.id;

  if (editGame.openOrClose === "Edit Color") {
    // 🔹 Handle color update
    try {
      const updateData = await api(`/AllGames/updateColor/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({
          nameColor: editGame.nameColor || "#000000",
          resultColor: editGame.resultColor || "#000000",
          panelColor: editGame.panelColor || "#ffffff",
          notificationColor: editGame.notificationColor || "#ff0000",
        }),
      });

      if (updateData.success) {
        fetchGamesAgain();
        setShowEditModal(false);
        alert("Game colors updated successfully!");
      } else {
        alert("Failed to update colors: " + updateData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating colors");
    }
  } else if (editGame.openOrClose === "Add Notification") {
    // 🔹 Handle notification update
    try {
      const updateData = await api(`/AllGames/updateNotification/${gameId}`, {
        method: "PUT",
        body: JSON.stringify({
          notificationMessage: [input1 || "", input2 || ""],
        }),
      });

      if (updateData.success) {
        fetchGamesAgain();
        setShowEditModal(false);
        alert("Notification updated successfully!");
      } else {
        alert("Failed to update notification: " + updateData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error updating notification");
    }
  } else {
    // 🔹 Handle Open/Close result number update
    const inputValue = editGame.resultNo || "";
    const parts = inputValue.split("-").map((num) => num.trim());

    if (parts.length === 0 || !/^\d+$/.test(parts[0])) {
      alert("Invalid format. Please enter a number like 123-7.");
      return;
    }

    const mainNumber = parts[0];
    const providedCheckDigit = parts[1];

    if (mainNumber.length >= 2) {
      const firstDigit = parseInt(mainNumber[0], 10);
      const secondDigit = parseInt(mainNumber[1], 10);
      if (firstDigit >= secondDigit) {
        alert("Invalid number: first digit must be smaller than second digit.");
        return;
      }
    }

    if (mainNumber.length >= 3) {
      const lastThree = mainNumber.slice(-3).split("").map(Number);
      const sum = lastThree.reduce((a, b) => a + b, 0);
      const expectedCheckDigit = sum % 10;

      if (providedCheckDigit && parseInt(providedCheckDigit, 10) !== expectedCheckDigit) {
        alert(`Invalid number: check digit should be ${expectedCheckDigit} (sum of last 3 digits).`);
        return;
      }
    }

    const newResultArray = [mainNumber];
    if (providedCheckDigit) newResultArray.push(providedCheckDigit);
    if (editGame.openOrClose) {
      newResultArray.push(editGame.date, editGame.openOrClose, editGame.day);
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
    <div
      className=" border border-white m-1 p-3"
      style={{ backgroundColor: "#ffcc99" }}
    >
      <div className="bg-pink m-1 p-2 jodi-panel-container-second">
        <h3>WORLD ME SABSE FAST SATTA MATKA RESULT</h3>
      </div>
      {role === "Admin" && (
        <div className="mb-3">
          <button
            className="btn btn-primary m-1"
            onClick={() => {
              setModalType("addGame");
              setShowModal(true);
            }}
          >
            ADD GAME
          </button>
          <button
            className="btn btn-secondary m-1"
            onClick={() => {
              setModalType("addAgent");
              setShowModal(true);
            }}
          >
            ADD AGENT
          </button>
          <button
            className="btn btn-danger m-1"
            onClick={() => {
              setModalType("delete");
              setShowModal(true);
            }}
          >
            DELETE
          </button>
          <button
            className="btn btn-info m-1"
            onClick={() => {
              setModalType("import");
              setShowModal(true);
            }}
          >
            Import By Link
          </button>
        </div>
      )}

      {games.map((item, index) => {
        let displayResult = "No numbers";
        if (
          (Array.isArray(item.openNo) && item?.openNo.length > 0) ||
          (Array.isArray(item.resultNo) && item?.resultNo.length > 0)
        ) {
          displayResult = (
            <p style={{ color: item.resultColor || "#000000" }}>
              {getDisplayResult(item)}
            </p>
          );
        }

        return (
          <div
            className="jodi-panel-container jodi-panel-container-second m-2 p-2"
            key={item._id || index}
            style={{ backgroundColor: item.panelColor || "" }} // ✅ background color
          >
            <button
              className="btn btn-sm btn-primary button-jodi-panel"
              onClick={() => handlePageChange(item)}
            >
              Jodi
            </button>
            <div>
              <div>
                {role === "Admin" ? (
                  <>
                    {/* ✅ Name color */}
                    <h4
                      style={{
                        fontSize: `${nameSizes[item._id] || 18}px`,
                        color: item.nameColor || "#000000",
                      }}
                    >
                      {item.name}
                    </h4>

                    {/* ✅ Blinking notification with custom color */}
                    {Array.isArray(item.Notification_Message) &&
                    item.Notification_Message.length > 0 ? (
                      <BlinkingNotification
                        messages={item.Notification_Message}
                        interval={3000}
                        color={item.notificationColor || "#ff0000"}
                      />
                    ) : null}

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
                  </>
                ) : (
                  <>
                    <h4
                      style={{
                        fontSize: `${nameSizes[item._id] || 18}px`,
                        color: item.nameColor || "#000000",
                      }}
                    >
                      {item.name}
                    </h4>
                    {Array.isArray(item.Notification_Message) &&
                    item.Notification_Message.length > 0 ? (
                      <BlinkingNotification
                        messages={item.Notification_Message}
                        interval={3000}
                        color={item.notificationColor || "#ff0000"}
                      />
                    ) : null}
                  </>
                )}
              </div>

              {/* ✅ Result text color applied */}
              <h5 style={{ color: item.resultColor || "#000000" }}>
                {displayResult}
              </h5>

              <div className="d-flex justify-content-around">
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
                <button
                  className="btn btn-info ml-2"
                  onClick={() => {
                    setSelectedGameId(item._id);
                    setShowLiveModal(true);
                  }}
                  hidden={
                    !(
                      role === "Admin" ||
                      (role === "Agent" && item.owner === username)
                    )
                  }
                >
                  Set Live Time
                </button>
              </div>

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

      {showModal && (
        <div className="AddGameModelMainContainer">
          <div className="AddGameModelSeconContainer">
            {modalType === "addGame" && (
              <form onSubmit={handleAddGame}>
                <h3>Add Game</h3>

                {/* Game Name */}
                <input
                  name="name"
                  placeholder="Game Name"
                  value={newGame.name}
                  onChange={(e) =>
                    setNewGame({ ...newGame, name: e.target.value })
                  }
                  required
                />

                {/* Owner */}
                <input
                  name="owner"
                  placeholder="Owner"
                  value={newGame.owner}
                  onChange={(e) =>
                    setNewGame({ ...newGame, owner: e.target.value })
                  }
                />

                {/* Start Time */}
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={newGame.startTime}
                  onChange={(e) =>
                    setNewGame({ ...newGame, startTime: e.target.value })
                  }
                  required
                />

                {/* End Time */}
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={newGame.endTime}
                  onChange={(e) =>
                    setNewGame({ ...newGame, endTime: e.target.value })
                  }
                  required
                />

                {/* Result Number */}
                <input
                  name="resultNo"
                  placeholder="Result No (e.g. 111-33-555)"
                  value={newGame.resultNo}
                  onChange={(e) =>
                    setNewGame({ ...newGame, resultNo: e.target.value })
                  }
                />

                {/* 🎨 Colors */}
                <label>Game Name Color</label>
                <input
                  type="color"
                  value={newGame.nameColor}
                  onChange={(e) =>
                    setNewGame({ ...newGame, nameColor: e.target.value })
                  }
                />

                <label>Result Color</label>
                <input
                  type="color"
                  value={newGame.resultColor}
                  onChange={(e) =>
                    setNewGame({ ...newGame, resultColor: e.target.value })
                  }
                />

                <label>Notification Color</label>
                <input
                  type="color"
                  value={newGame.panelColor}
                  onChange={(e) =>
                    setNewGame({
                      ...newGame,
                      panelColor: e.target.value,
                    })
                  }
                />

                <label>Notification Color</label>
                <input
                  type="color"
                  value={newGame.notificationColor}
                  onChange={(e) =>
                    setNewGame({
                      ...newGame,
                      notificationColor: e.target.value,
                    })
                  }
                />

                <div className="mt-2">
                  <button type="submit" className="btn btn-success m-1">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2 m-4"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {modalType === "addAgent" && (
              <form onSubmit={handleAddAgent}>
                <h3>Add Agent</h3>
                <input
                  name="name"
                  placeholder="Name"
                  value={newAgent.name}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, name: e.target.value })
                  }
                  required
                />
                <input
                  name="mobile"
                  placeholder="Mobile"
                  value={newAgent.mobile}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, mobile: e.target.value })
                  }
                  required
                />
                <input
                  name="password"
                  placeholder="Password"
                  type="password"
                  value={newAgent.password}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, password: e.target.value })
                  }
                  required
                />
                <input
                  name="role"
                  placeholder="Role"
                  value={newAgent.role}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, role: e.target.value })
                  }
                  required
                />
                <input
                  name="address"
                  placeholder="Address"
                  value={newAgent.address}
                  onChange={(e) =>
                    setNewAgent({ ...newAgent, address: e.target.value })
                  }
                  required
                />
                <div className="mt-2">
                  <button type="submit" className="btn btn-success m-1">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ml-2 m-4"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {modalType === "delete" && (
              <form onSubmit={handleDeleteGame}>
                <h3>Delete Game</h3>
                <input
                  placeholder="Game Name"
                  value={deleteGameName}
                  onChange={(e) => setDeleteGameName(e.target.value)}
                />
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
              </form>
            )}

            {modalType === "import" && (
              <form onSubmit={fetchAndUpdateGame}>
                <h3>Import Games By Link</h3>
                <input
                  placeholder="Paste link here"
                  value={linkForUpdateGame}
                  onChange={(e) => setLinkForUpdateGame(e.target.value)}
                />
                <button type="submit" className="btn btn-info">
                  Import
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ✅ Edit Modal for Results */}
      {showLiveModal && (
        <div className="AddGameModelMainContainer">
          <div className="AddGameModelSeconContainer">
            <h4>Set Live Time</h4>
            <input
              type="datetime-local"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <div className="button-group mt-3">
              <button
                className="btn btn-success"
                onClick={async () => {
                  try {
                    const response = await api(
                      `/AllGames/setLiveTime/${selectedGameId}`,
                      {
                        method: "PUT",
                        body: JSON.stringify({ liveTime: selectedTime }),
                      }
                    );
                    if (response.success) {
                      alert("Live time set successfully!");
                      fetchGamesAgain();
                      setShowLiveModal(false);
                      setSelectedTime("");
                    } else {
                      alert("Failed: " + response.message);
                    }
                  } catch (err) {
                    console.error(err);
                    alert("Error setting live time");
                  }
                }}
              >
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowLiveModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="AddGameModelMainContainer">
          <div className="AddGameModelSeconContainer">
            <h2>{nameForPop}</h2>
            <h4>Add Result Number</h4>
            <form onSubmit={handleUpdateGame}>
              <div className="form-group">
                <label htmlFor="openOrClose">Open / Close / Edit Color</label>
                <select
                  id="openOrClose"
                  value={editGame.openOrClose}
                  onChange={(e) =>
                    setEditGame({ ...editGame, openOrClose: e.target.value })
                  }
                  required
                >
                  <option value="">Select Action</option>
                  <option value="Open">Open</option>
                  <option value="Close">Close</option>
                  <option value="Add Notification">Add Notification</option>
                  <option value="Edit Color">Edit Color</option>
                </select>
              </div>

              {editGame.openOrClose === "Add Notification" ? (
                <div>
                  <div className="d-flex flex-column justify-content-center">
                    <label htmlFor="Notification-input-tag-1">
                      Notification message 1
                    </label>
                    <input
                      id="Notification-input-tag-1"
                      name="Notification-input-tag-1"
                      value={input1}
                      onChange={(e) => setInput1(e.target.value)}
                    />
                  </div>
                  <div className="d-flex flex-column justify-content-center m-1">
                    <label htmlFor="Notification-input-tag-2">
                      Notification message 2
                    </label>
                    <input
                      id="Notification-input-tag-2"
                      name="Notification-input-tag-2"
                      value={input2}
                      onChange={(e) => setInput2(e.target.value)}
                    />
                  </div>
                </div>
              ) : editGame.openOrClose === "Open" ||
                editGame.openOrClose === "Close" ? (
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
              ) : editGame.openOrClose === "Edit Color" ? (
                <div className="form-group">
                  <label>Game Name Color</label>
                  <input
                    type="color"
                    value={editGame.nameColor || ""}
                    onChange={(e) =>
                      setEditGame({ ...editGame, nameColor: e.target.value })
                    }
                  />

                  <label>Result Color</label>
                  <input
                    type="color"
                    value={editGame.resultColor || ""}
                    onChange={(e) =>
                      setEditGame({ ...editGame, resultColor: e.target.value })
                    }
                  />

                  <label>Panel Background Color</label>
                  <input
                    type="color"
                    value={editGame.panelColor || ""}
                    onChange={(e) =>
                      setEditGame({ ...editGame, panelColor: e.target.value })
                    }
                  />

                  <label>Notification Color</label>
                  <input
                    type="color"
                    value={editGame.notificationColor || ""}
                    onChange={(e) =>
                      setEditGame({
                        ...editGame,
                        notificationColor: e.target.value,
                      })
                    }
                  />
                </div>
              ) : (
                <div></div>
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
