import React, { useEffect, useRef } from "react";
import { Button } from "antd";
import PlyViewerHome from '../components/PlyViewerHome';

const Banner = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.play().catch((error) => {
                console.error("Video playback failed:", error);
            });
        }
    }, []);

    const slidingTextStyle = {
        fontSize: "48px",
        fontWeight: "bold",
        animation: "slideBackAndForth 6s ease-in-out infinite",
        whiteSpace: "nowrap",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
    };

    const slidingLogosStyle = {
        marginBottom: "-50px",
        display: "flex",
        gap: "20px",
        alignItems: "center",
        flexWrap: "nowrap",
        animation: "slideLeft 15s linear infinite",
        whiteSpace: "nowrap",
    };

    const keyframes = `
        @keyframes slideBackAndForth {
            0% {
                transform: translateX(-50%);
            }
            50% {
                transform: translateX(-40%);
            }
            100% {
                transform: translateX(-50%);
            }
        }

        @keyframes slideLeft {
            0% {
                transform: translateX(100%);
            }
            100% {
                transform: translateX(-100%);
            }
        }
    `;

    return (
        <div style={{ height: "100vh", overflow: "hidden", width: "100%" }}>
            <style>{keyframes}</style>

            {/* Video Background */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                }}
            >
                <source src="/logo/banner.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay đen phủ toàn bộ */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(0, 0, 0, 0.6)",
                    zIndex: 1,
                }}
            ></div>

            {/* Gradient đen từ dưới lên */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "30%",
                    background: "linear-gradient(to top, #181818, rgba(0, 0, 0, 0))",
                    zIndex: 2,
                }}
            ></div>

            {/* Content chính */}
            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    color: "white",
                    padding: "50px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <h1 style={slidingTextStyle}>
                        Mở hình 3D không căng não lực với<br />
                        Bộ tạo mô hình 3D AI của SEASHIP
                    </h1>
                    <p style={{ fontSize: "18px", maxWidth: "600px", margin: "180px 0 20px 0" }}>
                        Được tin tưởng bởi hàng triệu nhà phát triển game, studio game, nhiều nguồn hỗ trợ mô hình 3D và các nhà
                        sáng tạo từ XR trên toàn thế giới để thúc hiện ý tưởng của họ, Meshy là công cụ tạo mô hình 3D AI hàng đầu
                        dành cho việc tạo ra các mô hình và hoạt ảnh 3D chỉ trong vài giây.
                    </p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                            type="primary"
                            style={{
                                background: "#22c55e",
                                borderColor: "#22c55e",
                                color: "black",
                                padding: "0 20px",
                                height: "40px",
                            }}
                        >
                            Bắt đầu miễn phí
                        </Button>
                        <Button
                            type="default"
                            style={{
                                background: "transparent",
                                borderColor: "white",
                                color: "white",
                                padding: "0 20px",
                                height: "40px",
                            }}
                        >
                            Khám phá mô hình 3D
                        </Button>
                    </div>
                </div>
            </div>

            {/* PlyViewerHome ở bên phải */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "100px",
                    transform: "translateY(-50%)",
                    zIndex: 4,
                }}
            >
                <PlyViewerHome
                    plyPath="/plys/mesh_textured.ply"
                    texturePath="/png/mesh_textured0.png"
                    zIndex={3}
                />
            </div>
        </div>
    );
};

export default Banner;
