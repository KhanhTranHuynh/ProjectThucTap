import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserEmail } from "../redux/slices/userSlice"; // 👈 import redux action

export default function Login() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 👈 thêm useDispatch

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:55009/api/userRouter/loginUser", {
        googleToken: credentialResponse.credential,
      });

      if (res.data.status === "OK") {
        const token = credentialResponse.credential;

        localStorage.setItem("token", token); // 👈 lưu vào localStorage
        setToken(token);                      // 👈 cập nhật AuthContext
        dispatch(fetchUserEmail(token));      // 👈 cập nhật Redux NGAY

        alert(res.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingTop: "20vh",
      }}
    >
      <h1>Đăng nhập bằng Google</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.error("❌ Đăng nhập thất bại")}
      />
    </div>
  );
}
