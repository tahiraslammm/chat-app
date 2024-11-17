import { Button, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const Chat = ({
  connected,
  userCount,
  socketId,
  messages,
  usersList,
  socket,
}) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message && socket) {
      socket.emit("message", { message, socketId });
      setMessage(""); // Clear the input after sending
    }
  };
  const chatEndRef = useRef(null);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className="main-container"
      style={{
        display: "flex",
        height: "100vh",
        padding: "10px",
        gap: "10px",
      }}
    >
      {/* Left Section: User List */}
      <div
        className="user-container"
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "10px",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: connected ? "green" : "gray",
            }}
          />
          <span>{connected ? "Connected" : "Connecting"}</span>
        </div>
        <div
          style={{
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          <small>Users Connected: {userCount}</small>
        </div>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {usersList.map((user, index) => (
            <li
              key={index}
              style={{
                padding: "5px",
                borderBottom: "1px solid #ddd",
              }}
            >
              {user}
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section: Chat Box */}
      <div
        className="chat-container"
        style={{
          flex: "3",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "10px",
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f8f9fa",
          }}
        >
          <h3>Socket ID: {socketId}</h3>
        </div>

        {/* Chat Messages */}
        <div
          style={{
            flex: "1",
            padding: "10px",
            overflowY: "auto",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.length > 0 ? (
            messages.map((message, index) => {
              const isCurrentUser =
                message.sender === localStorage.getItem("username");
              return (
                <div
                  key={index}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    textAlign: isCurrentUser ? "right" : "left", // Align to right if it's the current user's message
                  }}
                >
                  <h4 style={{ margin: 0 }}>{message.message}</h4>
                  <small>
                    {isCurrentUser ? "Your Message" : `${message.sender}`}
                  </small>
                </div>
              );
            })
          ) : (
            <h4>No messages yet</h4>
          )}
        </div>

        {/* Chat Input */}
        <div
          style={{
            padding: "10px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#f8f9fa",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <TextField
              value={message}
              onChange={handleChange}
              placeholder="Enter Message"
              size="small"
              fullWidth
            />
            <Button variant="contained" type="submit" disabled={!message}>
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
