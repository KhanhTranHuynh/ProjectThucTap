import React, { useState } from "react";
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
                color: hover ? "#1890ff" : "#d9d9d9",
                transition: "color 0.3s ease",
                cursor: "pointer",
            }}
        >
            {children}
        </Link>
    );
};

const AppFooter = () => {
    return (
        <Footer
            style={{
                background: "#001529",
                color: "#fff",
                padding: "40px 50px",
                margin: 0,
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Text strong style={{ color: "#fff", fontSize: "16px" }}>
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
                    <Text strong style={{ color: "#fff", fontSize: "16px" }}>
                        Liên Hệ
                    </Text>
                    <Space direction="vertical" style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <Text style={{ color: "#d9d9d9" }}>
                            <MailOutlined /> Email: khanhtranhuynh9@gmail.com
                        </Text>
                        <Text style={{ color: "#d9d9d9" }}>
                            <PhoneOutlined /> Phone: (+84) 868 333 224
                        </Text>
                    </Space>
                </Col>

                <Col xs={24} sm={24} md={8}>
                    <Text strong style={{ color: "#fff", fontSize: "16px" }}>
                        Về Chúng Tôi
                    </Text>
                    <Space direction="vertical" style={{ marginTop: "10px", marginLeft: "10px" }}>
                        <Text style={{ color: "#d9d9d9" }}>
                            SeaShip - Hệ thống chuyển đổi Video thành mô hình 3D.
                        </Text>
                        <Text style={{ color: "#d9d9d9" }}>
                            © {new Date().getFullYear()} SeaShip. All rights reserved.
                        </Text>
                    </Space>
                </Col>
            </Row>
        </Footer>
    );
};

export default AppFooter;
