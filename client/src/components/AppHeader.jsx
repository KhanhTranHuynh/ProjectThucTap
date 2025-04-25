import React, { useEffect, useState } from "react";
import { Image, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import ContactModal from "../modal/ContactModal";
import InstructModal from "../modal/InstructModal";
import LoginModal from "../modal/LoginModal";
import axios from "axios";


const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({});

    useEffect(() => {
        axios.get("http://localhost:55009/api/settings/getAll")
            .then(res => {
                setSettings(res.data);
            })
            .catch(err => {
                console.error("Lỗi khi gọi API settings:", err);
            });
    }, []);

    return (
        <Header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                backgroundColor: "rgba(255, 255, 255, 0.5)", // trắng có độ trong
                backdropFilter: "blur(10px)",               // hiệu ứng làm mờ phía sau
                WebkitBackdropFilter: "blur(10px)",         // hỗ trợ Safari
                padding: "0 20px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                margin: 0,
                height: "60px",
                display: "flex",
                alignItems: "center"
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                }}
            >
                <div
                    className="logo"
                    style={{
                        color: "#107aff",
                        fontSize: "24px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginRight: "10px",
                    }}
                    onClick={() => navigate("/")}
                >
                    {settings.site_name || "SEASHIP"}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "60px", // Đảm bảo chiều cao bằng Header để căn giữa
                    }}
                >
                    <Image
                        src={settings.logo_url || "/logo/logo.svg"}
                        alt="App Logo"
                        width={40}
                        height={40}
                        preview={false}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                <ContactModal />
                <InstructModal />
                <LoginModal />
            </div>
        </Header>
    );
};

export default AppHeader;