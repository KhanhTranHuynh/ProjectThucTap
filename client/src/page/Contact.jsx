import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();

    // Xử lý khi submit form
    const onFinish = (values) => {
        console.log("Dữ liệu form liên hệ:", values);
        message.success("Tin nhắn của bạn đã được gửi thành công!");
        form.resetFields();
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Lỗi:", errorInfo);
        message.error("Vui lòng điền đầy đủ thông tin!");
    };

    return (
        <div style={{ padding: "50px", maxWidth: "600px", margin: "0 auto" }}>
            <Card>
                <Title level={2} style={{ textAlign: "center" }}>
                    Liên Hệ Với Chúng Tôi
                </Title>
                <Form
                    form={form}
                    name="contact"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Họ và Tên"
                        name="name"
                        rules={[
                            { required: true, message: "Vui lòng nhập họ và tên!" },
                        ]}
                    >
                        <Input placeholder="Nhập họ và tên của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input placeholder="Nhập email của bạn" />
                    </Form.Item>

                    <Form.Item
                        label="Tin Nhắn"
                        name="message"
                        rules={[
                            { required: true, message: "Vui lòng nhập nội dung tin nhắn!" },
                        ]}
                    >
                        <TextArea rows={4} placeholder="Nhập tin nhắn của bạn" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Gửi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Contact;