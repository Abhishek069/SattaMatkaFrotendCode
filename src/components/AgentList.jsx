import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { jwtDecode } from "jwt-decode";

export default function UserPayments() {
  const [users, setUsers] = useState([]);
  const [gamesForUser, setGamesForUser] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [paymentData, setPaymentData] = useState({
    method: "",
    amount: "",
    valid_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch users and games
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const usersData = await api("/user/");
        const gamesData = await api("/AllGames/");

        setUsers(Array.isArray(usersData.data) ? usersData.data : []);  
        setGamesForUser(gamesData?.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load users or games.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const token = localStorage.getItem("authToken");

  let username = null;
  // let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      // role = decoded.role;
      username = decoded.username;
      // console.log(role, username);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // 🔹 Save payment
  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedGame) {
      alert("Select both user and game first!");
      return;
    }

    setSaving(true);
    try {
      const result = await api(`/AllGames/updatePayment/${selectedUser._id}`, {
        method: "PUT",
        body: JSON.stringify({
          gameId: selectedGame._id,
          ...paymentData,
        }),
      });

      if (result.success) {
        alert("Payment updated successfully!");
        // reset form
        setPaymentData({
          method: "",
          amount: "",
          status: "Pending",
          valid_date: "",
        });
        setSelectedGame(null);
      } else {
        alert(result.message || "Failed to update payment");
      }
    } catch (err) {
      console.error("Error updating payment:", err);
      alert("Failed to update payment");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Filter games for selected user
  const filteredGames = selectedUser
    ? gamesForUser.filter((game) => game.owner === selectedUser.name)
    : [];

  const filterGameOflogedUser = gamesForUser.filter(
    (game) => game.owner === username
  );
  // filterGameOflogedUser.map((e) => {
  //   console.log(e);
  // });

  return (
    <>
      <div className="m-1" style={{ backgroundColor: "#ffcc99", border: "2px solid black" }}> 
        <h1>Total Payment</h1>
        <ul>
          {filterGameOflogedUser?.map((game) => (
            <li key={game._id} className="mb-2">
              {game.name} has balance {game.amount} and expires on{" "}
              {game.valid_date}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-screen m-1">
        {/* 🔹 Users Section */}
        <div
          className="p-6 rounded-lg shadow p-2"
          style={{ backgroundColor: "#ffcc99", border: "2px solid black" }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">Select User</h2>
          {loading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : (
            <select
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              style={{ backgroundColor: "#ffcc99", border: "2px solid black" }}
              value={selectedUser?._id || ""}
              onChange={(e) => {
                const user = users.find((u) => u._id === e.target.value);
                setSelectedUser(user);
                setSelectedGame(null);
              }}
            >
              <option value="">-- Choose a user --</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* 🔹 Payment Section */}
        <div
          className="p-6 border rounded-lg shadow m-1"
          style={{ backgroundColor: "#ffcc99" }}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Payment Details
          </h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {/* Game selection */}
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">
              Select User Game
            </label>
            <select
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
              style={{ backgroundColor: "#ffcc99" }}
              value={selectedGame?._id || ""}
              onChange={(e) => {
                const game = filteredGames.find(
                  (g) => g._id === e.target.value
                );
                setSelectedGame(game);
              }}
              disabled={!selectedUser}
            >
              <option value="">-- Choose a game --</option>
              {filteredGames.map((game) => (
                <option key={game._id} value={game._id}>
                  {game.title || game.name || `Game ${game._id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Payment form */}
          {selectedUser ? (
            <form onSubmit={handleSavePayment} className="space-y-4 ">
              <div className="d-flex flex-column justify-content-center align-items-center m-1">
                <div className="m-1 d-flex">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">
                      Payment Method
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="method"
                        value={paymentData.method}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">
                      Valid Date
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="date"
                        name="valid_date"
                        value={paymentData.valid_date}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-gray-700">
                      Amount
                    </label>
                    <div className="input-group mb-3">
                      <input
                        type="number"
                        name="amount"
                        value={paymentData.amount}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Recipient's username"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                a
                disabled={!selectedGame || saving}
                className="btn btn-success"
              >
                {saving ? "Saving..." : "Save Payment"}
              </button>
            </form>
          ) : (
            <p className="text-gray-600">Select a user to add payment</p>
          )}
        </div>
      </div>
    </>
  );
}
