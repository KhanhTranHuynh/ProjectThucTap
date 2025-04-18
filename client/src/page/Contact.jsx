import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useDispatch } from "react-redux";

const { Title } = Typography;
const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (changedValues, allValues) => {
        setFormData(allValues);
    };
    const dispatch = useDispatch();

    const handleSendEmail = async () => {
        const { name, email, message: msg } = formData;

        if (!name || !email || !msg) {
            message.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            const res = await fetch("http://localhost:55009/api/sendEmail/sendEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message: msg }),
            });

            const result = await res.json();

            if (res.ok) {
                message.success("Email đã được gửi đến quản trị viên!");
                form.resetFields();
                setFormData({ name: "", email: "", message: "" });
            } else {
                message.error(result.error || "Lỗi khi gửi email.");
            }
        } catch (err) {
            console.error("Lỗi:", err);
            message.error("Không thể gửi email.");
        }
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
                    onValuesChange={handleChange}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Họ và Tên"
                        name="name"
                        rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
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
                        rules={[{ required: true, message: "Vui lòng nhập nội dung tin nhắn!" }]}
                    >
                        <TextArea rows={4} placeholder="Nhập tin nhắn của bạn" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" onClick={handleSendEmail} block>
                            Gửi
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Contact;
