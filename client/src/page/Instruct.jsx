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
            description: "Vào trang Profile để xem danh sách các tệp đã tải lên và các mô hình 3D đồng thời bạn sẽ tạo mô hình tại đây.",
        },
        {
            title: "Bước 3: Tạo mô hình",
            description: "Bạn tải Video cần tạo mô hình lên tại bằng nút Upload Video và chọn Convert Video to 3D xong bạn cần đợi từ 3 - 7 phút để hệ thống tạo mô hình. Tùy vào đầu vào của video mà chất lượng mô hình sẽ khác đồng thời vì đây là bản Web nên chất lượng sẽ không được cao, bạn có thể hiện với chúng tôi để có thể được hổ trợ tạo các mô hình thương mại."
        },
        {
            title: "Bước 4: Tải xuống mô hình",
            description: "Sau khi hoàn thành việc tạo mộ hình, bạn có thể xem mô hình trực tiếp hoặc tải xuống tệp PLY để sử dụng.",
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