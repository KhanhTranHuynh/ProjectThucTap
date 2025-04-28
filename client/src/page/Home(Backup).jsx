import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Button, Table, message, Spin } from "antd";
import { DownloadOutlined, UploadOutlined, VideoCameraOutlined } from "@ant-design/icons";

const VideoTo3D = () => {
    const [videos, setVideos] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:55009/api/model3dRouter/getModel")
            .then((response) => {
                if (response.data.status === "OK") {
                    setVideos(
                        response.data.data.map((item) => ({
                            key: item.id,
                            id: item.id,
                            users_email: item.users_email,
                            link_video: item.link_video,
                            link_3d: item.link_3d,
                            created_at: new Date(item.created_at).toLocaleString(),
                            updated_at: new Date(item.updated_at).toLocaleString(),
                            link_video_full: `/videos/${item.link_video}`,
                            link_3d_full: `/plys/${item.link_3d}`,
                        }))
                    );
                }
            })
            .catch(() => {
                message.error("Failed to fetch videos");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [token]);


    useEffect(() => {
        const handleKeyPress = (event) => {
            if ((event.key === "c" || event.key === "C")) {
                handleConvert();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [file, loading]);

    const handleUpload = (info) => {
        setFile(info.file);
        message.success(`${info.file.name} selected for upload`);
    };
    const handleStartLoading = () => {
        setLoading(true);
    };

    const handleConvert = async () => {
        try {
            setLoading(true);

            axios.post("http://localhost:55009/api/model3dRouter/upload", {
                timestamp: Date.now()
            });

            message.success("Video uploaded successfully");
        } catch (error) {
            message.error("Failed to upload video");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (filePath, fileName) => {
        const link = document.createElement("a");
        link.href = filePath;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        { title: "Video", dataIndex: "link_video", key: "link_video" },
        {
            title: "Download Video",
            dataIndex: "link_video",
            key: "download_video",
            render: (text, record) => (
                <Button
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownload(record.link_video_full, text)}
                >
                    Download
                </Button>
            ),
        },
        {
            title: "3D Model",
            dataIndex: "link_3d",
            key: "link_3d",
            render: (text) => (
                <a href={`/viewer/${text}`} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: "Download PLY",
            dataIndex: "link_3d",
            key: "download_ply",
            render: (text, record) => (
                <Button
                    icon={<DownloadOutlined />}
                    onClick={() => {
                        handleDownload(`/png/${record.link_3d.replace(".ply", "0.png")}`, `${record.link_3d.replace(".ply", "0.png")}`);
                        handleDownload(record.link_3d_full, text);
                    }}
                >
                    Download
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 10 }}>
                    <Upload beforeUpload={() => false} onChange={handleUpload}>
                        <Button icon={<UploadOutlined />}>Upload Video</Button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={handleStartLoading}
                        icon={<VideoCameraOutlined />}
                        disabled={loading}
                    >
                        Convert Video to 3D
                    </Button>
                </div>
                <Button type="primary" onClick={() => window.location.href = "/admin"}>
                    Admin
                </Button>
                <Button >
                    Money: {100000?.toLocaleString('vi-VN')} VND
                </Button>
                <Button type="primary">
                    Deposit 100.000 VND
                </Button>
            </div>
            {loading && (
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <Spin tip="Converting video to 3D, please wait..." size="large" />
                </div>
            )}
            <Table columns={columns} dataSource={videos} />
            <Button
                type="primary"
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = "/";
                }}
                style={{ marginTop: 20 }}
            >
                LogOut
            </Button>
        </div>
    );
};

export default VideoTo3D;
