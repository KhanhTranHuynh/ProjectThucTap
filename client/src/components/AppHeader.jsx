import React from "react";
import { Image, Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;

const AppHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { key: "/", label: "Home" },
        { key: "/contact", label: "Contact" },
        { key: "/instruct", label: "Instruct" },
        { key: "/profile", label: "Profile" },
    ];

    const handleMenuClick = ({ key }) => {
        navigate(key);
    };

    return (
        <Header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                background: "#001529",
                padding: "0 20px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                margin: 0,
                lineHeight: "64px",
            }}
        >
            <div
                className="logo"
                style={{
                    float: "left",
                    color: "#fff",
                    fontSize: "24px",
                    fontWeight: "bold",
                    lineHeight: "64px",
                    cursor: "pointer",
                    margin: 0,
                }}
                onClick={() => navigate("/")}
            >
                SeaShip
                <Image
                    src="/logo/logo.svg"
                    alt="App Logo"
                    width={40}
                    height={40}
                    preview={false}
                    style={{ marginLeft: 10, verticalAlign: "middle" }}
                />
            </div>
            <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                style={{
                    float: "right",
                    lineHeight: "64px",
                    borderBottom: "none",
                    background: "transparent",
                    margin: 0,
                }}
            />
        </Header>
    );
};

export default AppHeader;