import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Row, Col, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link } = Typography;

const HoverableLink = ({ to, children }) => {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);

    return (
        <Link
            onClick={() => navigate(to)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                color: hover ? "#1890ff" : "#111827",
                transition: "color 0.3s ease",
                cursor: "pointer",
            }}
        >
            {children}
        </Link>
    );
};

const AppFooter = () => {
    const [settings, setSettings] = useState({});

    useEffect(() => {
        axios
            .get("http://localhost:55009/api/settings/getAll")
            .then((res) => {
                setSettings(res.data);
            })
            .catch((err) => {
                console.error("Lỗi khi gọi API settings:", err);
            });
    }, []);

    const styles = `
        @media (max-width: 768px) {
            .quick-links {
                display: none !important; /* Ẩn Liên Kết Nhanh chỉ trên mobile */
            }
        }
    `;

    return (
        <Footer
            style={{
                background: "#c7ccd5",
                color: "#111827",
                padding: "40px 50px",
                margin: 0,
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <style>{styles}</style>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} className="quick-links">
                    <Text strong style={{ color: "#111827", fontSize: "16px" }}>
                        Liên Kết Nhanh
                    </Text>
                    <Space direction="vertical" style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <HoverableLink to="/">Home</HoverableLink>
                        <HoverableLink to="/contact">Contact</HoverableLink>
                        <HoverableLink to="/instruct">Instruct</HoverableLink>
                        <HoverableLink to="/profile">Profile</HoverableLink>
                    </Space>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Text strong style={{ color: "#111827", fontSize: "16px" }}>
                        Liên Hệ
                    </Text>
                    <Space direction="vertical" style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <Text style={{ color: "#111827" }}>
                            <MailOutlined /> Email: {settings.contact_email || "Đang tải..."}
                        </Text>
                        <Text style={{ color: "#111827" }}>
                            <PhoneOutlined /> Phone: {settings.contact_phone || "Đang tải..."}
                        </Text>
                    </Space>
                </Col>
                <Col xs={24} sm={24} md={8}>
                    <Text strong style={{ color: "#111827", fontSize: "16px" }}>
                        Về Chúng Tôi
                    </Text>
                    <Space direction="vertical" style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <Text style={{ color: "#111827" }}>
                            {settings.about_us || "SeaShip - Hệ thống chuyển đổi Video thành mô hình 3D."}
                        </Text>
                        <Text style={{ color: "#111827" }}>
                            {settings.footer_text}
                        </Text>
                    </Space>
                </Col>
            </Row>
        </Footer>
    );
};

export default AppFooter;