import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    const res = await axios.post("http://localhost:55009/api/userRouter/loginUser", {
      googleToken: credentialResponse.credential,
    });

    if (res.data.status === "OK") {
      setToken(credentialResponse.credential);
      alert(res.data.message);
      navigate("/");
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