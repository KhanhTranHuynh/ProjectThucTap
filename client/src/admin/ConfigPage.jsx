import React, { useEffect, useState } from "react";
import {
    Table,
    message,
    Modal,
    Button,
    Input,
    Form,
    Upload,
    Space
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const SettingTable = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [form] = Form.useForm();

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:55009/api/settings/getTable");
            setSettings(response.data);
        } catch (error) {
            message.error("Không thể tải dữ liệu settings");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const showEditModal = (record) => {
        setSelectedSetting(record);
        form.setFieldsValue({ setting_value: record.setting_value });
        setIsModalOpen(true);
    };

    const handleUpdate = async () => {
        const updatedValue = form.getFieldValue("setting_value");
        try {
            await axios.put(`http://localhost:55009/api/settings/update`, {
                id: selectedSetting.id,
                setting_value: updatedValue,
            });
            message.success("Cập nhật thành công");
            setIsModalOpen(false);
            fetchSettings();
        } catch (err) {
            console.error(err);
            message.error("Lỗi khi cập nhật");
        }
    };



    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Key",
            dataIndex: "setting_key",
            key: "setting_key",
        },
        {
            title: "Value",
            dataIndex: "setting_value",
            key: "setting_value",
            render: (value, record) => {
                if (record.setting_key === "logo_url") {
                    return <img src={value} alt="Logo" style={{ height: 40 }} />;
                }
                return value;
            },
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Tùy chỉnh",
            key: "action",
            render: (_, record) => (
                <Button type="link" onClick={() => showEditModal(record)}>
                    Chỉnh sửa
                </Button>
            ),
        },
    ];
    const [file, setFile] = useState(null);



    const handleUpload = async () => {
        if (!file) return alert("Vui lòng chọn hình!");

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axios.post("http://localhost:55009/api/settings/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Upload thành công: " + res.data.filename);
        } catch (err) {
            console.error(err);
            alert("Upload thất bại");
        }
    };
    const [fileName, setFileName] = useState(null);

    const handleChange = (e) => {
        setFile(e.target.files[0]);
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    return (
        <>


            <Table
                columns={columns}
                dataSource={settings}
                loading={loading}
                rowKey="id"
                pagination={{
                    pageSize: 6,
                    showSizeChanger: true,
                    pageSizeOptions: ["6", "12", "20"],
                }}
            />

            <Modal
                title={`Chỉnh sửa: ${selectedSetting?.setting_key}`}
                open={isModalOpen}
                onOk={handleUpdate}
                onCancel={() => setIsModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    {selectedSetting?.setting_key === "logo_url" ? (
                        <>
                            <Form.Item label="Hình ảnh hiện tại">
                                <img
                                    src={form.getFieldValue("setting_value")}
                                    alt="preview"
                                    style={{ maxWidth: "100%", maxHeight: 100 }}
                                />
                            </Form.Item>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <label
                                    htmlFor="file-upload"
                                    style={{
                                        background: "#f0f0f0",
                                        border: "1px solid #d9d9d9",
                                        borderRadius: "5px",
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        color: "#333",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "200px",
                                    }}
                                >
                                    {fileName || "Chọn tệp"} {/* Display selected file name or default text */}
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleChange}
                                    style={{ display: "none" }} // Hide the default input
                                />
                                <Button
                                    type="primary"
                                    onClick={handleUpload}
                                    disabled={loading}
                                    style={{
                                        background: "#0b7cff",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding: "8px 16px",
                                        fontSize: "14px",
                                        height: "auto",
                                    }}
                                >
                                    Update Logo
                                </Button>
                            </div>
                        </>
                    ) : (
                        <Form.Item label="Giá trị" name="setting_value">
                            <Input />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    );
};

export default SettingTable;
