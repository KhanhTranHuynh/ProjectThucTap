import React from "react";
import { useSocket } from "./SocketContext";

const ConversationList = () => {
    const { conversationList } = useSocket(); // Lấy danh sách conversationId từ context

    return (
        <div>
            <h2>Danh sách Conversations</h2>
            <ul>
                {conversationList.map((id) => (
                    <li key={id}>Conversation ID: {id}</li>
                ))}
            </ul>
        </div>
    );
};

export default ConversationList;
