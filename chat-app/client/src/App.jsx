import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Chat from "./components/chat";

const App = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [socketId, setSocketId] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );

  const [usernameSet, setUsernameSet] = useState(
    !!localStorage.getItem("username")
  );

  const handleSetUsername = () => {
    if (!(socketRef.current && username.trim())) {
      return;
    }

    localStorage.setItem("username", username.trim());
    socketRef.current.emit("setUsername", username.trim());
    setUsernameSet(true);
  };

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3000");

      socketRef.current.on("connect", () => {
        setConnected(true);

        if (username) {
          socketRef.current.emit("setUsername", username);
          setUsernameSet(true);
        }

        // socketRef.current.emit("chatHistory");
      });

      socketRef.current.on("disconnect", () => {
        setConnected(false);
      });

      socketRef.current.on("userData", (userData) => {
        setUserCount(userData.connectedUsers);
        setSocketId(userData.socketId);
        setUsersList(userData.usersList);
      });

      socketRef.current.on("message", (receivedMessage) => {
        setMessages((previousMessages) => [
          ...previousMessages,
          receivedMessage,
        ]);
      });

      socketRef.current.on("chatHistory", (chatHistory) => {
        console.log(chatHistory);
        setMessages(chatHistory);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [username]);

  return (
    <>
      {usernameSet ? (
        <Chat
          connected={connected}
          userCount={userCount}
          socketId={socketId}
          messages={messages}
          usersList={usersList}
          socket={socketRef.current}
        />
      ) : (
        <div>
          <h3>Set Your Username</h3>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
          <button onClick={handleSetUsername}>Set Username</button>
        </div>
      )}
    </>
  );
};

export default App;
