import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
    const navigate = useNavigate();

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
                        <Link
                            onClick={() => navigate("/")}
                            style={{ color: "#d9d9d9" }}
                            hoverStyle={{ color: "#1890ff" }}
                        >
                            Home
                        </Link>
                        <Link
                            onClick={() => navigate("/contact")}
                            style={{ color: "#d9d9d9" }}
                            hoverStyle={{ color: "#1890ff" }}
                        >
                            Contact
                        </Link>
                        <Link
                            onClick={() => navigate("/instruct")}
                            style={{ color: "#d9d9d9" }}
                            hoverStyle={{ color: "#1890ff" }}
                        >
                            Instruct
                        </Link>
                        <Link
                            onClick={() => navigate("/profile")}
                            style={{ color: "#d9d9d9" }}
                            hoverStyle={{ color: "#1890ff" }}
                        >
                            Profile
                        </Link>
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