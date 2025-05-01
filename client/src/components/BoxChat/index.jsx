import React, { useEffect, useState, useRef } from "react";
import "./BoxChat.css";
import { useSocket } from "../../SocketProvider/SocketContext";
import { useDispatch } from "react-redux";
import { updateData } from "../../redux/slices/ForRealTime";
import { WechatOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const ChatBox = ({ UserID, showBoxChat }) => {
    const [isChatOpen, setIsChatOpen] = useState(showBoxChat);
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const socket = useSocket(); // Lấy socket từ context
    const dispatch = useDispatch(); // Sử dụng dispatch để gửi action
    const email = useSelector((state) => state.user.email); // 👈 lấy email từ Redux

    // Tạo ref cho phần tử cuối cùng
    const chatEndRef = useRef(null);

    // Hàm cuộn tự động đến cuối
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (socket) {
            socket.emit("join_room", UserID);

            // Nhận tin nhắn từ server
            socket.on("receive_message", (data) => {
                setMessageList((list) => [...list, data]);
            });

            // Nhận tin nhắn lịch sử
            socket.on("load_messages", (messages) => {
                setMessageList(messages);
            });
        }

        return () => {
            if (socket) {
                socket.off("receive_message");
                socket.off("load_messages");
            }
        };
    }, [socket, UserID]);


    // Mỗi khi messageList thay đổi, cuộn xuống dưới
    useEffect(() => {
        scrollToBottom();
    }, [messageList, isChatOpen]);

    // Gửi tin nhắn
    const sendMessage = () => {
        if (message && socket) {
            const messageData = {
                conversationId: UserID,
                senderID: email,
                text: message,
            };
            socket.emit("send_message", messageData);
            socket.on("update_conversations", (conversationIds) => {
                dispatch(updateData(conversationIds));
            });
            setMessage("");
        }
    };

    return (
        <div className="chat-container">
            <button className="chat-toggle-btn" onClick={() => setIsChatOpen(!isChatOpen)}>
                <WechatOutlined />
            </button>
            {isChatOpen && (
                <div className="chat-box">
                    <div className="chat-header">
                        <span>Chat với chúng tôi</span>
                        <button className="chat-close-btn" onClick={() => setIsChatOpen(false)}>
                            ×
                        </button>
                    </div>

                    <div className="chat-body">
                        {messageList.map((msg, index) => (
                            <div key={index}>
                                {msg.senderID === email ? (
                                    <div
                                        style={{
                                            marginBottom: 10,
                                            width: "100%",
                                            display: "flex",
                                            justifyContent: "flex-end",
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: 6,
                                                borderRadius: 8,
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                background: "#fff",
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                                width: "fit-content",
                                                maxWidth: "90%",
                                            }}
                                        >
                                            <span style={{ fontWeight: 600 }}>{msg.text}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            marginBottom: 10,
                                            width: "100%",
                                            display: "inline-block",
                                            wordWrap: "break-word",
                                            whiteSpace: "normal",
                                        }}
                                    >
                                        <div
                                            style={{
                                                padding: 6,
                                                borderRadius: 8,
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                background: "#fff",
                                                whiteSpace: "normal",
                                                wordWrap: "break-word",
                                                width: "fit-content",
                                                maxWidth: "90%",
                                            }}
                                        >
                                            <span style={{ fontWeight: 600 }}>{msg.text}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Phần tử để cuộn tới */}
                        <div ref={chatEndRef} />
                    </div>

                    <div className="chat-footer">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="chat-input"
                        />
                        <button onClick={sendMessage} className="chat-send-btn">Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
