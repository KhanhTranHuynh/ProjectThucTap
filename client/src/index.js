import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import HomePage from "./page/Home";
import { AuthProvider } from "./AuthContext";
import PrivateRoute from "./PrivateRoute";
import PlyViewerPage from "./page/PlyViewerPage";

const GOOGLE_CLIENT_ID =
  "754367632037-7ijdlaht2gcl5hr53md316lvkbtpt2sn.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
          <Route path="/viewer/:plyFileName" element={<PlyViewerPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </GoogleOAuthProvider>
);
