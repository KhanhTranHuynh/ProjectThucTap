import React, { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Button, Table, message, Spin } from "antd";
import { DownloadOutlined, UploadOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { paymentZalo } from "../redux/slices/paymentZalo";
import { addNewPayment } from "../redux/slices/payment";
import { useDispatch, useSelector } from "react-redux"
import moment from "moment";
import { toast } from "react-toastify"


const VideoTo3D = () => {
    const [videos, setVideos] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");
    const [userRole, setUserRole] = useState(null);
    const [userMoney, setUserMoney] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:55009/api/model3dRouter/getWithIdUser", {
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

        axios
            .get(`http://localhost:55009/api/userRouter/getUserRole?token=${token}`)
            .then((response) => {
                setUserRole(response.data.role);
            })
            .catch(() => message.error("Failed to fetch user role"));
        axios
            .get(`http://localhost:55009/api/userRouter/getAllWithToKen?token=${token}`)
            .then((response) => {
                setUserMoney(response.data.user.money);
            })
            .catch(() => message.error("Failed to fetch user role"));
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

            await logtime(1800);

            const response = await axios.post(
                "http://localhost:55009/api/model3dRouter/upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
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
    const dispatch = useDispatch()

    const email = useSelector((state) => state.user.email);

    const handleOrder = () => {
        const before = moment().format("YYMMDD").toString();
        const after = Math.floor(Math.random() * 1000000).toString();
        const totalPrice = 100000; // Replace with your actual total price calculation

        const temp = async () => {
            const result = await dispatch(addNewPayment({ id: before + after, Oder_TotalPrice: totalPrice, email: email }))
            console.log(result); // Kiểm tra kết quả trả về
        }
        temp()

        const payZalo = async () => {
            const zalo = await dispatch(paymentZalo({ Oder_TotalPrice: totalPrice, app_trans_id: before + after }))
            if (zalo.payload.data.return_message === "Giao dịch thành công") {
                toast.success("Transaction successful")
                window.open(zalo.payload.data.order_url);
            } else {
                toast.error("An error occurred")
            }
        }
        payZalo()
    }

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
                    <Upload
                        beforeUpload={() => false}
                        onChange={handleUpload}
                        itemRender={(originNode, file, fileList, actions) => {
                            return React.cloneElement(originNode, {
                                style: {
                                    backgroundColor: 'white',
                                    padding: '8px',
                                    borderRadius: '4px',
                                }
                            });
                        }}
                    >
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
                {userRole === "admin" && (
                    <Button type="primary" onClick={() => window.location.href = "/admin"}>
                        Admin
                    </Button>
                )}
                <Button >
                    Money: {userMoney?.toLocaleString('vi-VN')} VND
                </Button>
                <Button type="primary" onClick={() => handleOrder()}>
                    Deposit 100.000 VND
                </Button>
            </div>
            {loading && (
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <Spin tip="Converting video to 3D, please wait..." size="large" />
                </div>
            )}
            {/* <Table columns={columns} dataSource={videos} /> */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '8px' }}>
                <Table
                    columns={columns}
                    dataSource={videos}
                    pagination={{ pageSize: 10 }}
                    bordered
                    style={{ backgroundColor: 'white' }} // áp dụng cho container
                />
            </div>
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
        </div >
    );
};

export default VideoTo3D;
