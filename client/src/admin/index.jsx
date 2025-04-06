import React, { useState } from "react";
import { AreaChartOutlined, LogoutOutlined, RollbackOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import TableUsers from "./users/TableUsers";
import StatisticalUser from "./users/Statistical";
import { useNavigate } from "react-router-dom";
import TableProducts from './products/TableProducts';
import StatisticalProducts from "./products/Statistical";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [compo, setCompo] = useState("TableUsers"); // Mặc định là TableUsers
    const [selectedKeys, setSelectedKeys] = useState(["2-2"]); // Mặc định chọn "User"
    const [openKeys, setOpenKeys] = useState(["2"]); // Mặc định mở menu "User"
    const navigate = useNavigate();

    const renderComponent = () => {
        switch (compo) {
            case "TableUsers":
                return <TableUsers />;
            case "StatisticalUser":
                return <StatisticalUser />;
            case "TableProducts":
                return <TableProducts />;
            case "StatisticalProducts":
                return <StatisticalProducts />;
            default:
                return <TableUsers />;
        }
    };

    const items = [
        {
            key: "1",
            label: "User",
            icon: <UserOutlined />,
            children: [
                {
                    key: "1-1",
                    label: "Statistical User",
                    icon: <AreaChartOutlined />,
                    onClick: () => {
                        setCompo("StatisticalUser");
                        setSelectedKeys(["1-1"]);
                    },
                },
                {
                    key: "1-2",
                    label: "User",
                    icon: <UserOutlined />,
                    onClick: () => {
                        setCompo("TableUsers");
                        setSelectedKeys(["1-2"]);
                    },
                },
            ],
        },
        {
            key: "2",
            label: "model3D",
            // icon: <UserOutlined />,
            children: [
                {
                    key: "2-1",
                    label: "Statistical model3D",
                    icon: <AreaChartOutlined />,
                    onClick: () => {
                        setCompo("StatisticalProducts");
                        setSelectedKeys(["2-1"]);
                    },
                },
                {
                    key: "2-2",
                    label: "model3D",
                    // icon: <UserOutlined />,
                    onClick: () => {
                        setCompo("TableProducts");
                        setSelectedKeys(["2-2"]);
                    },
                },
            ],
        },
        {
            key: '3',
            label: 'Settings',
            icon: <SettingOutlined />,
            children: [
                {
                    key: '3-1',
                    label: 'Back',
                    icon: <RollbackOutlined />,
                    onClick: () => { navigate(`/`) }
                },
                {
                    key: '3-2',
                    label: 'Logout',
                    icon: <LogoutOutlined />,
                    // onClick: () => { dispatch(logoutUser()); navigate(`/login`) }
                },
            ]
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    zIndex: 10,
                    transition: "all 0.3s linear",
                    overflow: "auto",
                    height: "calc(100% - 46px)",
                }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    selectedKeys={selectedKeys}
                    defaultSelectedKeys={["1-2"]}
                    mode="inline"
                    items={items}
                    openKeys={openKeys}
                    onOpenChange={setOpenKeys}
                />
            </Sider>
            <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "all 0.3s linear" }}>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: "0 16px" }}>
                    {renderComponent()}
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    Iphone Store ©{new Date().getFullYear()} Created KhanhTran
                </Footer>
            </Layout>
        </Layout>
    );
};

export default App;