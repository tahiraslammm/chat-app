import { Button, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const App = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message) {
      socketRef.current.emit("message", message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");

      socketRef.current.on("connect", () => {
        setConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        setConnected(false);
      });

      socketRef.current.on("userCount", (count) => {
        setUserCount(count);
      });

      socketRef.current.on("message", (messages) => {
        setMessages(messages);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div style={{ fontSize: "24px", textAlign: "center", marginTop: "50px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

      <div style={{ marginTop: "20px" }}>
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          Users Online:{" "}
          {userCount ? (
            userCount
          ) : (
            <CircularProgress size={24} style={{ marginLeft: "10px" }} />
          )}
        </span>
      </div>

      <div>{messages ? <h1>{messages}</h1> : <h1>No messages yet</h1>}</div>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {/* Chat Message Input */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: "30px",
          }}
        >
          <TextField
            value={message}
            onChange={handleChange}
            placeholder="Enter Message"
            size="small"
            style={{
              marginBottom: "20px",
              maxWidth: "100%",
              borderRadius: "20px",
            }}
          />

          <Button variant="contained" type="submit" disabled={!message}>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default App;
