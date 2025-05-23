import React, { useEffect, useState } from "react";
import { Table, message, Button, Modal, Form, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const App = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:55009/api/userRouter/getAllUser");
            if (response.data.status === "OK") {
                setUserData(response.data.data);
            } else {
                message.error("Lấy dữ liệu thất bại");
            }
        } catch (error) {
            message.error("Lỗi khi gọi API");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateRole = async (values) => {
        try {
            const response = await axios.put(
                `http://localhost:55009/api/userRouter/updateRole/${selectedUser.email}`,
                { role: values.role }
            );
            if (response.data.status === "OK") {
                message.success("Cập nhật role thành công");
                setUserData((prev) =>
                    prev.map((user) =>
                        user.email === selectedUser.email ? { ...user, role: values.role } : user
                    )
                );
                setIsModalOpen(false);
                form.resetFields();
            } else {
                message.error("Cập nhật role thất bại");
            }
        } catch (error) {
            message.error("Lỗi khi cập nhật role");
            console.error(error);
        }
    };

    const showModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
        form.setFieldsValue({ role: user.role });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const columns = [
        {
            title: "User Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "User Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "User Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Total",
            dataIndex: "money",
            key: "money",
            render: (value) => (value == null ? 0 : value.toLocaleString("vi-VN")),
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (value) => dayjs(value).format("HH:mm:ss DD/MM/YYYY"),
        },
        {
            title: "Updated At",
            dataIndex: "updated_at",
            key: "updated_at",
            render: (value) => dayjs(value).format("HH:mm:ss DD/MM/YYYY"),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button type="primary" onClick={() => showModal(record)}>
                    Change Role
                </Button>
            ),
        },
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={userData}
                loading={loading}
                rowKey="email"
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ["5", "10", "20"],
                }}
            />
            <Modal
                title="Change User Role"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={handleUpdateRole}
                    layout="vertical"
                >
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: "Please select a role" }]}
                    >
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="client">Client</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default App;