import React, { useEffect, useState } from "react";
import { api } from "../lib/api";

// --- ScrollingNotification Component (Unchanged) ---
const ScrollingNotification = ({ messages, color = "#ff0000", speed = 10 }) => {
  if (!messages || messages.length === 0) return null;
  const text = messages;

  return (
    <div
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "100%",
        maxWidth: "100%",
        position: "relative",
        // Added styling for the top bar appearance
        backgroundColor: "#fffbe6", // Light background for visibility
        borderBottom: `2px solid ${color}`,
        padding: "5px 0",
      }}
    >
      <div
        style={{
          display: "inline-block",
          color,
          animation: `scroll ${speed}s linear infinite`,
          fontWeight: "bold", // Make the text stand out
        }}
      >
        <span style={{ paddingRight: "4rem" }}>{text}</span>
        <span>{text}</span> {/* duplicate for seamless loop */}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

// --- Updated Pop-up Form Component (Smaller and uses Radio Buttons for Index) ---
const AddNotificationModal = ({ onClose, onSave }) => {
  // Initialize index with a default value, e.g., '1'
  const [formData, setFormData] = useState({ name: "", index: "1" });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const INDEX_OPTIONS = ["1", "2", "3", "4"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!formData.name || !formData.index) {
      setError("Both Notification Name and Index must be selected.");
      setIsSaving(false);
      return;
    }

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  // Inline styles for the modal
  const modalStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Slightly lighter backdrop
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const contentStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "6px",
    width: "90%", // Reduce max width
    maxWidth: "350px", // Set a small maximum width
    boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
  };

  const radioContainerStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "5px",
    marginBottom: "20px",
  };

  const radioBoxStyle = {
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "0.9rem",
    flexGrow: 1,
  };

  // Dynamic style for selected radio button
  const getSelectedStyle = (value) => ({
    ...radioBoxStyle,
    backgroundColor: formData.index === value ? "#007bff" : "#f0f0f0",
    color: formData.index === value ? "white" : "#333",
    borderColor: formData.index === value ? "#007bff" : "#ccc",
  });

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h3
          style={{
            marginTop: 0,
            borderBottom: "1px solid #eee",
            paddingBottom: "10px",
          }}
        >
          Add Notification
        </h3>
        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="name"
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Notification Message:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="E.g., Server downtime at 2 AM"
              value={formData.name}
              onChange={handleChange}
              disabled={isSaving}
              required
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              Section Index:
            </label>
            <div style={radioContainerStyle}>
              {INDEX_OPTIONS.map((val) => (
                <label key={val} style={getSelectedStyle(val)}>
                  <input
                    type="radio"
                    name="index"
                    value={val}
                    checked={formData.index === val}
                    onChange={handleChange}
                    disabled={isSaving}
                    style={{ display: "none" }} // Hide the default radio button
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              style={{
                padding: "8px 15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                background: "#f8f8f8",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                padding: "8px 15px",
                border: "none",
                borderRadius: "4px",
                background: isSaving ? "#6c757d" : "#28a745",
                color: "white",
                cursor: "pointer",
              }}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
function NotificationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollMessages, setScrollMessages] = useState([
    "Welcome! Click the button below to add a new notification.",
  ]);

  const handleSaveNotification = async (data) => {
    // API endpoint setup (assuming /api/notifications is correctly mapped in your Express app)
    const API_URL = "/Notification/update-noti";

    try {
      const response = await api(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const newNotification = response;
      console.log("Notification saved:", newNotification);

      // Add the new notification message and its index to the scrolling list
      setScrollMessages(newNotification.name);
    } catch (error) {
      console.error("Error saving notification:", error);
      throw new Error(`Failed to save: ${error.message}`);
    }
  };

  const handleGetNotification = async () => {
    // Set the correct API endpoint for fetching ALL notifications.
    // We'll stick to your URL '/Notification/update-noti' since that's what you provided,
    // but note that '/Notification/notifications' is more conventional for a GET all.
    const API_URL = "/Notification/update-noti";

    try {
      // 1. Call the API wrapper
      const apiResponse = await api(API_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      // Convert the object values to an array
      const responseValues = Object.values(apiResponse);

      // Filter out the non-data properties (like status, ok) to get only the notification objects
      const notificationsArray = responseValues.filter(
        (item) => item && typeof item === "object" && !item.ok
      );

      // A simpler but less robust check might just be the first element:
      // const notificationsArray = apiResponse[0] && Array.isArray(apiResponse[0]) ? apiResponse[0] : Object.values(apiResponse).filter(item => typeof item === 'object' && !item.ok);

      console.log(
        "Processed Notifications:",
        notificationsArray,
        typeof notificationsArray
      );

      // --- Error Checking (Adjusted for your API wrapper's behavior) ---
      if (!apiResponse.ok || !Array.isArray(notificationsArray)) {
        // Since we can't change the API wrapper, we check the metadata it returns
        // and throw a custom error if the status isn't OK or data is missing.
        throw new Error(
          `Failed to retrieve notifications. Status: ${apiResponse.status}`
        );
      }

      // --- Success Logic (Updated) ---

      // 3. Format the array into a single scrolling message string
      const formattedMessage = notificationsArray.map((e)=>{
        if(e.index === '1'){
            setScrollMessages(e.name);
        }
      })

      // 4. Update the state
    } catch (error) {
      console.error("Error retrieving notification:", error);
      // Throwing the error here allows the calling component (like useEffect or onSave) to catch it.
      throw new Error(`Failed to retrieve: ${error.message}`);
    }
  };

  useEffect(() => {
    handleGetNotification();
  }, []);

  return (
    <div style={{ minHeight: "10vh", backgroundColor: "#ffcc99" }}>
      {/* 1. Scrolling Notification Bar (Now at the very top) */}
      <ScrollingNotification
        messages={scrollMessages}
        color="#dc3545" // Use a vibrant color like red/danger
        speed={15}
      />

      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* 2. Button to open the modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginTop: "15px",
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          ➕ Add New Notification
        </button>

        {/* 3. The Pop-up/Modal */}
        {isModalOpen && (
          <AddNotificationModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveNotification}
          />
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
