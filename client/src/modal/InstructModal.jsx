import React, { useState } from "react";
import { Modal, Card, Typography, List, Space } from "antd";

const { Title, Paragraph } = Typography;

const InstructModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const instructions = [
        {
            title: "Bước 1: Đăng nhập",
            description: "Sử dụng tài khoản Google của bạn để đăng nhập vào hệ thống.",
        },
        {
            title: "Bước 2: Truy cập trang Profile",
            description: "Vào trang Profile để xem danh sách các tệp đã tải lên và các mô hình 3D đồng thời bạn sẽ tạo mô hình tại đây.",
        },
        {
            title: "Bước 3: Tạo mô hình",
            description: "Bạn tải Video cần tạo mô hình lên tại bằng nút Upload Video và chọn Convert Video to 3D xong bạn cần đợi từ 3 - 7 phút để hệ thống tạo mô hình. Tùy vào đầu vào của video mà chất lượng mô hình sẽ khác đồng thời vì đây là bản Web nên chất lượng sẽ không được cao, bạn có thể hiện với chúng tôi để có thể được hổ trợ tạo các mô hình thương mại.",
        },
        {
            title: "Bước 4: Tải xuống mô hình",
            description: "Sau khi hoàn thành việc tạo mô hình, bạn có thể xem mô hình trực tiếp hoặc tải xuống tệp PLY để sử dụng.",
        },
    ];

    return (
        <>
            <span
                style={{
                    color: "#111827",
                    lineHeight: "64px",
                    cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(true)}
                onMouseOver={(e) => (e.target.style.color = "#3B82F6")}
                onMouseOut={(e) => (e.target.style.color = "#111827")}
            >
                Hướng dẫn
            </span>

            <Modal
                title="Hướng Dẫn Sử Dụng"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                <Card>
                    <Paragraph style={{ textAlign: "center", marginBottom: "20px" }}>
                        Dưới đây là các bước cơ bản để sử dụng ứng dụng của chúng tôi.
                    </Paragraph>
                    <List
                        itemLayout="vertical"
                        dataSource={instructions}
                        renderItem={(item, index) => (
                            <List.Item key={index}>
                                <Space direction="vertical">
                                    <Title level={4}>{item.title}</Title>
                                    <Paragraph>{item.description}</Paragraph>
                                </Space>
                            </List.Item>
                        )}
                    />
                </Card>
            </Modal>
        </>
    );
};

export default InstructModal;
