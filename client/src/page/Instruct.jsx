import React from "react";
import { Card, Typography, List, Space } from "antd";

const { Title, Paragraph } = Typography;

const Instruct = () => {
    const instructions = [
        {
            title: "Bước 1: Đăng nhập",
            description: "Sử dụng tài khoản Google của bạn để đăng nhập vào hệ thống.",
        },
        {
            title: "Bước 2: Truy cập trang Profile",
            description: "Vào trang Profile để xem và chỉnh sửa thông tin cá nhân.",
        },
        {
            title: "Bước 3: Liên hệ hỗ trợ",
            description: "Truy cập trang Contact để gửi tin nhắn nếu cần trợ giúp.",
        },
        {
            title: "Bước 4: Xem tài liệu",
            description: "Sử dụng trang Viewer để xem các tệp PLY (nếu có).",
        },
    ];

    return (
        <div style={{ padding: "50px", maxWidth: "800px", margin: "0 auto" }}>
            <Card>
                <Title level={2} style={{ textAlign: "center" }}>
                    Hướng Dẫn Sử Dụng
                </Title>
                <Paragraph style={{ textAlign: "center", marginBottom: "20px" }}>
                    Dưới đây là các bước cơ bản để sử dụng ứng dụng của chúng tôi.
                </Paragraph>
                <List
                    itemLayout="vertical"
                    dataSource={instructions}
                    renderItem={(item, index) => (
                        <List.Item>
                            <Space direction="vertical">
                                <Title level={4}>{item.title}</Title>
                                <Paragraph>{item.description}</Paragraph>
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    );
};

export default Instruct;