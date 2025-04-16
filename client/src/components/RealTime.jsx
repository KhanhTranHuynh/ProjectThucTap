import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const socket = io.connect("http://localhost:55009");

const App = () => {
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    // Tham gia phòng
    const joinRoom = () => {
        if (room !== "") {
            socket.emit("join_room", room); // Gửi sự kiện tham gia phòng tới server
        }
    };

    // Gửi tin nhắn
    const sendMessage = () => {
        if (message !== "") {
            const messageData = {
                conversationId: room,
                // senderID: 1, // Thay bằng ID hoặc tên người dùng
                senderID: jwtDecode(localStorage.getItem("token")).id, // Thay bằng ID hoặc tên người dùng
                text: message,
            };
            socket.emit("send_message", messageData); // Gửi tin nhắn đến server
            setMessage("");
        }
    };

    // Nhận tin nhắn từ server
    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList((list) => [...list, data]);
        });

        // Nhận tin nhắn lịch sử khi tham gia phòng
        socket.on("load_messages", (messages) => {
            setMessageList(messages);
        });
    }, []);

    return (
        <div className="App">
            <h1>Chat Room</h1>
            <div>
                <input
                    type="text"
                    placeholder="Enter Room ID..."
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <button onClick={joinRoom}>Join Room</button>
            </div>

            <div >
                <h3>Room: {room}</h3>
                {messageList.map((msg, index) => (
                    <div key={index}>
                        <p>
                            <strong>{msg.time}</strong>: {msg.senderID} said: {msg.text}
                        </p>
                    </div>
                ))}
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default App;
