import React from "react";
import { Card, Typography, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "50px", maxWidth: "1200px", margin: "0 auto" }}>
            <Card style={{ textAlign: "center", marginBottom: "30px" }}>
                <Title level={2}>Chào mừng đến với SeaShip - Biến Video Thành Mô Hình 3D Bằng AI!</Title>
                <Paragraph>
                    Bạn có từng mơ ước biến những đoạn video yêu thích thành các mô hình 3D sống động? Với SeaShip, điều đó giờ đây hoàn toàn trong tầm tay! Chúng tôi sử dụng các thuật toán kết hợp công nghệ trí tuệ nhân tạo (AI) tiên tiến giúp chuyển đổi video của bạn thành các mô hình 3D chi tiết, chân thực, mở ra một thế giới sáng tạo không giới hạn.
                </Paragraph>
            </Card>
            <Card style={{ textAlign: "center", marginBottom: "30px" }}>
                <Title level={4}>Tại sao chọn SeaShip?</Title>
                <Paragraph>
                    <b>Dễ dàng sử dụng:</b> Chỉ cần tải video lên, phần còn lại hãy để hệ thống của chúng tôi xử lý.
                </Paragraph>
                <Paragraph>
                    <b>Kết quả ấn tượng:</b> Tạo ra mô hình 3D chất lượng cao từ chính những đoạn video bạn quay.
                </Paragraph>
                <Paragraph>
                    <b>Ứng dụng đa dạng:</b> Phù hợp cho thiết kế, giải trí, giáo dục, hoặc đơn giản là thỏa mãn đam mê sáng tạo.
                </Paragraph>
                <Paragraph>
                    <b>Nhanh chóng và tiện lợi:</b> Công nghệ tối ưu giúp bạn tiết kiệm thời gian mà vẫn đạt được sản phẩm phù hợp với nhu cầu.
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
                    <b>khanhtranhuynh9@gmail.com</b>.
                </Paragraph>
            </Card>
        </div>
    );
};

export default HomePage;