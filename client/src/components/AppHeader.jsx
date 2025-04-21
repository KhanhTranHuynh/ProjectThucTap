import React from "react";
import { Image, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import ContactModal from "../modal/ContactModal";
import InstructModal from "../modal/InstructModal";
import LoginModal from "../modal/LoginModal";


const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();

    return (
        <Header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                background: "#1a1a1a",
                padding: "0 20px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                margin: 0,
                height: "60px", // Tăng chiều cao để có không gian căn giữa
                display: "flex",
                alignItems: "center",
                zIndex: 1000,
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
                        color: "#22c55e",
                        fontSize: "24px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginRight: "10px",
                    }}
                    onClick={() => navigate("/")}
                >
                    SEASHIP
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
                        src="/logo/logo.svg"
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