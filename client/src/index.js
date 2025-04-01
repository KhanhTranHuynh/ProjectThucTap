import React from "react";
import ReactDOM from "react-dom/client";
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

const GOOGLE_CLIENT_ID =
  "754367632037-7ijdlaht2gcl5hr53md316lvkbtpt2sn.apps.googleusercontent.com";

const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    overflow-x: hidden; /* Ngăn cuộn ngang */
  }
  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  * {
    box-sizing: border-box; /* Đảm bảo padding và border không làm tăng kích thước */
  }
  /* Reset margin và padding mặc định cho các phần tử */
  h1, h2, h3, h4, h5, h6, p, ul, ol, li {
    margin: 0;
    padding: 0;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <BrowserRouter>
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
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/instruct" element={<Instruct />} />
              <Route
                path="/profile"
                element={<PrivateRoute element={<Account />} />}
              />
              <Route path="/viewer/:plyFileName" element={<PlyViewerPage />} />
            </Routes>
          </Content>
          <AppFooter />
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);
