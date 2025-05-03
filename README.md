# Hệ thống Web chuyển đổi video thành mô hình vật thể 3D 🎥➡️📦

## 🧩 Công nghệ sử dụng

- **Frontend:** ReactJS (>= v18)
- **Backend:** Node.js (ExpressJS)
- **Database:** MySQL
- **Authentication:** Google OAuth (token)

---

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/KhanhTranHuynh/ProjectThucTap.git
```

---

### 2. Cài đặt Frontend (ReactJS)

```bash
cd client
npm install # dùng để cài các gói
npm start
```

> 🔁 Frontend sẽ chạy mặc định ở: `http://localhost:3000`

---

### 3. Cài đặt Backend (Node.js)

```bash
cd server
npm install # dùng để cài các gói
npm start
```

#### 3.1. Tạo file `.env` trong thư mục `server`

```env
MYSQL_ROOT_PASSWORD=?
MYSQL_DATABASE=?
MYSQL_USER=?
MYSQL_PASSWORD=?
```

> Bạn cần tạo database trước trong MySQL hoặc để backend tự tạo nếu bạn dùng Sequelize sync.

#### 3.2. Khởi động server

```bash
npm start  # hoặc npm start tùy setup
```

> 🌐 Backend sẽ chạy tại `http://localhost:55009`

---

### 4. Cấu hình MySQL

- Đảm bảo MySQL đã được cài đặt và chạy.
- Tạo database:

```sql
CREATE DATABASE your_database_name;
```

---

## 📦 Các API chính xem trong file APIDocs.md

---

## ✍️ Tác giả

- **Tên:** Huỳnh Khánh Trân
