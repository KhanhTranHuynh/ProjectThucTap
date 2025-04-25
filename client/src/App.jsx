import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import HomePage from "./page/Home";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import PlyViewerPage from "./page/PlyViewerPage";
import Account from "./page/Account";
import Contact from "./page/Contact";
import Instruct from "./page/Instruct";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import Admin from "./admin/index";
// import { useSocket } from "../../SocketProvider/SocketContext";
import { SocketProvider } from "./SocketProvider/SocketContext";
import BoxChat from "./components/BoxChat";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import HomeBackup from "./page/Home(Backup)";

const GOOGLE_CLIENT_ID =
    "754367632037-7ijdlaht2gcl5hr53md316lvkbtpt2sn.apps.googleusercontent.com";

const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #F9FAFB;
  }
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  * {
    box-sizing: border-box;
  }
  h1, h2, h3, h4, h5, h6, p, ul, ol, li {
    margin: 0;
    padding: 0;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

const MainLayout = ({ children }) => (
    <Layout
        style={{
            minHeight: "100vh",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
        }}
    >
        <AppHeader />
        <Content
            style={{
                padding: "0 50px",
                marginTop: 64,
                marginLeft: 0,
                marginRight: 0,
                flex: 1,
                overflow: "auto",
                backgroundColor: "#F9FAFB",
            }}
        >
            {children}
        </Content>
        <AppFooter />
    </Layout>
);

const App = () => {
    const email = useSelector((state) => state.user.email); // 👈 lấy email từ Redux

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <AuthProvider>
                    <SocketProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route
                                    path="/admin"
                                    element={<PrivateRoute element={<Admin />} requiredRole="admin" />}
                                />
                                <Route
                                    path="*"
                                    element={
                                        <MainLayout>
                                            {email && <BoxChat UserID={email} />}
                                            <Routes>
                                                <Route path="/login" element={<Login />} />
                                                <Route path="/checkdocker" element={<Admin />} />
                                                <Route path="/" element={<HomePage />} />
                                                <Route path="/contact" element={<Contact />} />
                                                <Route path="/instruct" element={<Instruct />} />
                                                <Route
                                                    path="/profile"
                                                    element={<PrivateRoute element={<Account />} />}
                                                />
                                                <Route
                                                    path="/viewer/:plyFileName"
                                                    element={<PlyViewerPage />}
                                                />
                                            </Routes>
                                        </MainLayout>
                                    }
                                />
                                <Route path="/test" element={<HomeBackup />} />
                            </Routes>
                        </BrowserRouter>
                    </SocketProvider>
                </AuthProvider>
            </GoogleOAuthProvider>
        </>
    );
};
export default App;
