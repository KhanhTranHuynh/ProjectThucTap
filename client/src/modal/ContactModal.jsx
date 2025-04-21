import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography, message } from "antd";

const { Title } = Typography;
const { TextArea } = Input;

const ContactModal = () => {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (_, allValues) => {
        setFormData(allValues);
    };

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
                setIsModalOpen(false);
            } else {
                message.error(result.error || "Lỗi khi gửi email.");
            }
        } catch (err) {
            console.error("Lỗi:", err);
            message.error("Không thể gửi email.");
        }
    };

    return (
        <>
            <span
                style={{
                    color: "#fff",
                    lineHeight: "64px",
                    cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(true)}
                onMouseOver={(e) => (e.target.style.color = "#d1d5db")}
                onMouseOut={(e) => (e.target.style.color = "#fff")}
            >
                Liên hệ
            </span>

            <Modal
                title="Liên Hệ Với Chúng Tôi"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
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
            </Modal>
        </>
    );
};

export default ContactModal;
