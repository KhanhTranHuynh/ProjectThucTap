import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import axios from "axios";
import { Button, Table } from 'antd';
import * as XLSX from 'xlsx';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [yearToFilter, setYearToFilter] = useState(new Date().getFullYear());

    // Fetch data from the API
    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:55009/api/userRouter/getAllUser");
            setData(response.data.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Columns for Ant Design Table
    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' }, // Changed to 'name'
        { title: 'Email', dataIndex: 'email', key: 'email' }, // Changed to 'email'
        {
            title: 'Create User',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleDateString() // Format the 'created_at' date
        },
        {
            title: 'Total Amount Spent',
            dataIndex: 'money',
            key: 'money',
            render: (value) => value.toLocaleString('vi'), // Changed 'Sum' to 'money'
            sorter: (a, b) => a.money - b.money // Changed 'Sum' to 'money'
        },
    ];

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastYear = now.getFullYear() - 1;

    // Filter data for today, this year, last year, and month
    const filteredDay = data.filter(item => new Date(item.created_at).toISOString().split('T')[0] === today);
    const filteredYear = data.filter(item => new Date(item.created_at).getFullYear() === now.getFullYear());
    const filteredLastYear = data.filter(item => new Date(item.created_at).getFullYear() === lastYear);

    // Calculate the percentage change for each statistic
    const calculateChange = (current, previous) => ((current - previous) / previous) * 100;

    const summaryData = [
        { title: "Accounts Created Today", value: filteredDay.length, change: "" },
        { title: "Accounts Created This Year", value: filteredYear.length, change: "" },
        { title: "All Accounts", value: data.length, change: "" },
    ];

    // Create data for the bar chart based on the selected year
    const createBarChartData = (year) => {
        const monthsData = Array(12).fill(0);

        data.forEach(item => {
            const createDate = new Date(item.created_at);
            const createYear = createDate.getFullYear();
            const createMonth = createDate.getMonth();

            if (createYear === year) {
                monthsData[createMonth]++;
            }
        });

        return monthsData.map((value, index) => ({
            Month: (index + 1).toString(),
            "Total Account": value
        }));
    };

    const barChartData = createBarChartData(yearToFilter);
    const uniqueYears = [...new Set(data.map(item => new Date(item.created_at).getFullYear()))];

    // Download data as Excel
    const handleDownload = async () => {
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(barChartData), `Year_${yearToFilter}`);
        XLSX.writeFile(workbook, "data.xlsx");
    };

    return (
        <div style={{ padding: "20px", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
            <Typography variant="h4" gutterBottom>
                User Statistics
            </Typography>

            {/* 4 thống kê */}
            <Grid container spacing={3} style={{ marginBottom: "1rem" }}>
                {summaryData.map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
                            <CardContent>
                                <Typography variant="h6">{item.title}</Typography>
                                <Typography variant="h4">{item.value}</Typography>
                                <Typography variant="subtitle1" style={{ fontWeight: 550 }} color={item.change.includes("-") ? "error" : "blue"}>
                                    {item.change}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Bảng dữ liệu */}
            <Table columns={columns} dataSource={data} rowKey="email" style={{ marginBottom: "20px" }} />

            {/* Nút tải file Excel */}
            <Button onClick={handleDownload} style={{ marginBottom: 16 }}>Export Excel File</Button>

            {/* Dropdown chọn năm */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={yearToFilter}
                            onChange={(e) => setYearToFilter(e.target.value)}
                            label="Year"
                        >
                            {uniqueYears.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Biểu đồ cột */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Accounts Created in {yearToFilter}</Typography>
                            <BarChart width={1200} height={300} data={barChartData}>
                                <XAxis dataKey="Month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="Total Account" fill="#8884d8" />
                            </BarChart>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
