import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Kết nối socket chỉ một lần
        const newSocket = io.connect("http://localhost:55009");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // Ngắt kết nối khi component unmount
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
