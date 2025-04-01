import React from "react";
import { Card, Typography, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "50px", maxWidth: "1200px", margin: "0 auto" }}>
            <Card style={{ textAlign: "center", marginBottom: "30px" }}>
                <Title level={2}>Chào Mừng Đến Với My App!</Title>
                <Paragraph>
                    Đây là ứng dụng giúp bạn quản lý thông tin cá nhân, liên hệ với chúng
                    tôi, và xem các hướng dẫn sử dụng. Khám phá ngay các tính năng bên
                    dưới!
                </Paragraph>
            </Card>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        title="Hồ Sơ Cá Nhân"
                        hoverable
                        style={{ textAlign: "center" }}
                        onClick={() => navigate("/profile")}
                    >
                        <Paragraph>Xem và chỉnh sửa thông tin cá nhân của bạn.</Paragraph>
                        <Button type="primary">Đi đến Profile</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        title="Liên Hệ"
                        hoverable
                        style={{ textAlign: "center" }}
                        onClick={() => navigate("/contact")}
                    >
                        <Paragraph>Gửi tin nhắn cho chúng tôi nếu cần hỗ trợ.</Paragraph>
                        <Button type="primary">Đi đến Contact</Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        title="Hướng Dẫn"
                        hoverable
                        style={{ textAlign: "center" }}
                        onClick={() => navigate("/instruct")}
                    >
                        <Paragraph>Xem hướng dẫn sử dụng ứng dụng chi tiết.</Paragraph>
                        <Button type="primary">Đi đến Instruct</Button>
                    </Card>
                </Col>
            </Row>

            <Card style={{ marginTop: "30px", textAlign: "center" }}>
                <Title level={3}>Về Chúng Tôi</Title>
                <Paragraph>
                    My App được thiết kế để mang lại trải nghiệm tốt nhất cho người dùng.
                    Chúng tôi luôn sẵn sàng hỗ trợ bạn qua trang Contact hoặc email:
                    support@myapp.com.
                </Paragraph>
            </Card>
        </div>
    );
};

export default HomePage;