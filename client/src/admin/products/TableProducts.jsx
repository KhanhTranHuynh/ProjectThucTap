import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, message, Spin } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const VideoTo3D = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        axios
            .get("http://localhost:5000/api/model3dRouter/getModel", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
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

    const handleDownload = (filePath, fileName) => {
        const link = document.createElement("a");
        link.href = filePath;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        { title: "User Email", dataIndex: "users_email", key: "users_email" },
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
                    onClick={() => handleDownload(record.link_3d_full, text)}
                >
                    Download
                </Button>
            ),
        },
        { title: "Created At", dataIndex: "created_at", key: "created_at" },
        { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    ];

    return (
        <div style={{ padding: 20 }}>
            {loading && (
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <Spin tip="Converting video to 3D, please wait..." size="large" />
                </div>
            )}

            <Table columns={columns} dataSource={videos} />
        </div>
    );
};

export default VideoTo3D;
