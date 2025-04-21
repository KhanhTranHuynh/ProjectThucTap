import React, { useState, useContext } from "react";
import { Modal } from "antd";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { useDispatch } from "react-redux";
import { fetchUserEmail } from "../redux/slices/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const LoginModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);  // state điều khiển mở/đóng modal
    const { setToken } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Khai báo hook navigate

    // Hàm mở modal
    const handleSignupClick = () => {
        // Kiểm tra nếu token đã có trong localStorage
        const token = localStorage.getItem("token");
        if (token) {
            // Nếu có token, điều hướng đến trang profile
            navigate("/profile");
        } else {
            // Nếu không có token, mở modal đăng nhập
            setIsModalOpen(true);
        }
    };

    // Hàm đóng modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Hàm khi đăng nhập thành công
    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post("http://localhost:55009/api/userRouter/loginUser", {
                googleToken: credentialResponse.credential,
            });

            if (res.data.status === "OK") {
                const token = credentialResponse.credential;

                localStorage.setItem("token", token); // Lưu token vào localStorage
                setToken(token);                      // Cập nhật AuthContext
                dispatch(fetchUserEmail(token));      // Cập nhật Redux

                toast.success(res.data.message);
                setIsModalOpen(false);  // Đóng modal sau khi đăng nhập thành công

                // Sau khi đăng nhập thành công, điều hướng tới profile
                navigate("/profile");
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            toast.error("Đăng nhập thất bại");
        }
    };

    return (
        <div>
            {/* Button để mở modal đăng nhập */}
            <div
                style={{
                    background: "#22c55e",
                    color: "#000",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    lineHeight: "normal",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                }}
                onClick={handleSignupClick} // Bấm vào để kiểm tra token và mở modal hoặc điều hướng
                onMouseOver={(e) => (e.target.style.background = "#16a34a")}
                onMouseOut={(e) => (e.target.style.background = "#22c55e")}
            >
                Tài khoản
            </div>

            {/* Modal đăng nhập */}
            <Modal
                title="Đăng nhập"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width={400}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        paddingTop: "20px",
                    }}
                >
                    <h2>Đăng nhập bằng Google</h2>
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => toast.error("❌ Đăng nhập thất bại")}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default LoginModal;
