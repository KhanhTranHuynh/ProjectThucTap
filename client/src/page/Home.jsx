import React from "react";
import { Card, Typography, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
const { Title, Paragraph } = Typography;

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <Banner />
            <div style={{ padding: "50px", maxWidth: "1200px", margin: "0 auto" }}>
                <Card style={{ background: "#1e1e1e", textAlign: "center", marginBottom: "30px", border: "none" }}>
                    <Title style={{ color: "#ffffff" }} level={2}>Chào mừng đến với SeaShip - Biến Video Thành Mô Hình 3D Bằng AI!</Title>
                    <Paragraph style={{ color: "#ffffff" }}>
                        Bạn có từng mơ ước biến những đoạn video yêu thích thành các mô hình 3D sống động? Với SeaShip, điều đó giờ đây hoàn toàn trong tầm tay! Chúng tôi sử dụng các thuật toán kết hợp công nghệ trí tuệ nhân tạo (AI) tiên tiến giúp chuyển đổi video của bạn thành các mô hình 3D chi tiết, chân thực, mở ra một thế giới sáng tạo không giới hạn.
                    </Paragraph>
                </Card>
                <Card style={{ background: "#1e1e1e", textAlign: "center", marginBottom: "30px", border: "none" }}>
                    <Title style={{ color: "#ffffff" }} level={4}>Tại sao chọn SeaShip?</Title>
                    <Paragraph style={{ color: "#ffffff" }}>
                        <b>Dễ dàng sử dụng:</b> Chỉ cần tải video lên, phần còn lại hãy để hệ thống của chúng tôi xử lý.
                    </Paragraph >
                    <Paragraph style={{ color: "#ffffff" }}>
                        <b>Kết quả ấn tượng:</b> Tạo ra mô hình 3D chất lượng cao từ chính những đoạn video bạn quay.
                    </Paragraph>
                    <Paragraph style={{ color: "#ffffff" }}>
                        <b>Ứng dụng đa dạng:</b> Phù hợp cho thiết kế, giải trí, giáo dục, hoặc đơn giản là thỏa mãn đam mê sáng tạo.
                    </Paragraph>
                    <Paragraph style={{ color: "#ffffff" }}>
                        <b>Nhanh chóng và tiện lợi:</b> Công nghệ tối ưu giúp bạn tiết kiệm thời gian mà vẫn đạt được sản phẩm phù hợp với nhu cầu.
                    </Paragraph>
                </Card>

                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title={<span style={{ color: "#ffffff" }}>Hồ Sơ Cá Nhân</span>}
                            hoverable
                            style={{
                                background: "#1e1e1e",
                                border: "none",
                                textAlign: "center",
                            }}
                            onClick={() => navigate("/profile")}
                        >
                            <Paragraph style={{ color: "#ffffff" }}>
                                Xem và chỉnh sửa thông tin cá nhân của bạn.
                            </Paragraph>
                            <Button type="primary">Đi đến Profile</Button>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title={<span style={{ color: "#ffffff" }}>Liên Hệ</span>}
                            hoverable
                            style={{
                                background: "#1e1e1e",
                                border: "none",
                                textAlign: "center",
                            }}
                            onClick={() => navigate("/contact")}
                        >
                            <Paragraph style={{ color: "#ffffff" }}>
                                Gửi tin nhắn cho chúng tôi nếu cần hỗ trợ.
                            </Paragraph>
                            <Button type="primary">Đi đến Contact</Button>
                        </Card>

                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <Card
                            title={<span style={{ color: "#ffffff" }}>Hướng Dẫn</span>}
                            hoverable
                            style={{ background: "#1e1e1e", border: "none", textAlign: "center" }}
                            onClick={() => navigate("/instruct")}
                        >
                            <Paragraph style={{ color: "#ffffff" }}>
                                Xem hướng dẫn sử dụng ứng dụng chi tiết.
                            </Paragraph>
                            <Button type="primary">Đi đến Instruct</Button>
                        </Card>

                    </Col>
                </Row>

                <Card style={{ background: "#1e1e1e", border: "none", marginTop: "30px", textAlign: "center" }}>
                    <Title style={{ color: "#ffffff" }} level={3}>Về Chúng Tôi</Title>
                    <Paragraph style={{ color: "#ffffff" }} >
                        SeaShip được thiết kế để mang lại trải nghiệm tốt nhất cho người dùng.
                    </Paragraph>
                    <Paragraph style={{ color: "#ffffff" }} >
                        Chúng tôi luôn sẵn sàng hỗ trợ bạn qua trang Contact hoặc email:
                        <b> khanhtranhuynh9@gmail.com</b>.
                    </Paragraph>
                </Card>
            </div >
        </>
    );
};

export default HomePage;