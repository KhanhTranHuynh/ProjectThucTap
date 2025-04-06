import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import axios from "axios";
import dayjs from "dayjs"; // Đảm bảo bạn đã cài: npm install dayjs

const App = () => {
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/userRouter/getAllUser");
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
    ];

    return (
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
    );
};

export default App;
