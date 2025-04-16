import React from "react";
import { SocketProvider } from "../SocketProvider/SocketContext";
import ChatBox from "./BoxChat/index";
import RealTime from "./RealTime";

const App = () => {
    return (
        <SocketProvider>
            <ChatBox />
            <RealTime />
        </SocketProvider>
    );
};

export default App;
