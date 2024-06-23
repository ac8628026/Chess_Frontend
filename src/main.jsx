import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RoomProvider } from "./useContext/RoomContext.jsx";
import { SocketProvider } from "./useContext/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <RoomProvider>
        <App />
      </RoomProvider>
    </SocketProvider>
  </React.StrictMode>
);
