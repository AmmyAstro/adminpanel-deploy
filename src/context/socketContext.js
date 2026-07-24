"use client";

import { createContext, useState } from "react";
import { io } from "socket.io-client";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const connectSocket = ({ token }) => {
    if (socket?.connected) return socket;

    const socketInstance = io("https://dhwaniastro.com/dhwani-astro", {
      path: "/user-socket-service-v2/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,

      auth: {
        token,
      },
    });

    socketInstance.on("connect", () => {
      console.log("Admin Connected", socketInstance.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log(reason);
    });

    socketInstance.on("connect_error", console.error);

    setSocket(socketInstance);

    return socketInstance;
  };

  const disconnectSocket = () => {
    socket?.disconnect();
    setSocket(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connectSocket,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
