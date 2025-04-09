import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Button, Table, message, Spin } from "antd";
import { DownloadOutlined, UploadOutlined, VideoCameraOutlined } from "@ant-design/icons";

const VideoTo3D = () => {
    const [videos, setVideos] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:55009/api/model3dRouter/getWithIdUser")
            .then((response) => {
                if (response.data.status === "OK") {
                    setVideos(
                        response.data.data.map((item) => ({
                            key: item.id,
                            id: item.id,
                            users_id: item.users_id,
                            link_video: item.link_video,
                            link_3d: item.link_3d,
                            link_video_full: `/videos/${item.link_video}`,
                            link_3d_full: `/plys/${item.link_3d}`,
                        }))
                    );
                }
            })
            .catch(() => message.error("Failed to fetch videos"));
    }, []);

    const handleUpload = (info) => {
        setFile(info.file);
        message.success(`${info.file.name} selected for upload`);
    };

    const handleConvert = async () => {

        const logtime = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        if (!file) {
            message.error("Please upload a video first");
            return;
        }

        const formData = new FormData();
        formData.append("video", file);


        try {
            setLoading(true);

            await logtime(180000);

            const response = await axios.post(
                "http://localhost:55009/api/model3dRouter/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const newVideo = {
                ...response.data,
                key: response.data.id || Date.now(),
                link_video_full: `/videos/${response.data.link_video}`,
                link_3d_full: `/plys/${response.data.link_3d}`,
            };

            message.success("Video uploaded successfully");
            setVideos([...videos, newVideo]);
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
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "User ID", dataIndex: "users_id", key: "users_id" },
        { title: "Video Link", dataIndex: "link_video", key: "link_video" },
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
            title: "3D Model Link",
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
    ];

    return <
        div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <Upload beforeUpload={() => false} onChange={handleUpload}>
                <Button icon={<UploadOutlined />}>Upload Video</Button>
            </Upload>
            <Button
                type="primary"
                icon={<VideoCameraOutlined />}
                onClick={handleConvert}
                disabled={loading}
            >
                Convert Video to 3D
            </Button>
        </div>

        {/* Hiển thị animation loading */}
        {loading && (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
                <Spin tip="Converting video to 3D, please wait..." size="large" />
            </div>
        )}

        <Table columns={columns} dataSource={videos} />
    </div>;
};

export default VideoTo3D;