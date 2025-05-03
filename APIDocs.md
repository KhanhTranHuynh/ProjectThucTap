# Tài liệu API

## 1. API Người dùng

### 1.1. Lấy thông tin người dùng

- **Endpoint:** `GET /api/userRouter/getUser`
- **Input:** Header `Authorization: Bearer <googleToken>`
- **Output:** Thông tin tài khoản
- **Ghi chú:** Cần token Google

### 1.2. Lấy email từ token

- **Endpoint:** `GET /api/userRouter/getemailwithtoken`
- **Input:** `req.query.token`
- **Output:** Email
- **Ghi chú:** Cần token

### 1.3. Lấy tất cả người dùng

- **Endpoint:** `GET /api/userRouter/getAllUser`
- **Input:** `req.query.token`
- **Output:** Danh sách người dùng
- **Ghi chú:** Cần token

### 1.4. Lấy tất cả người dùng (có token)

- **Endpoint:** `GET /api/userRouter/getAllWithToKen`
- **Input:** `req.query.token`
- **Output:** Danh sách người dùng
- **Ghi chú:** Cần token

### 1.5. Lấy role từ token

- **Endpoint:** `GET /api/userRouter/getUserRole`
- **Input:** `req.query.token`
- **Output:** Role của người dùng
- **Ghi chú:** Cần token

### 1.6. Đăng nhập người dùng

- **Endpoint:** `POST /api/userRouter/loginUser`
- **Input:** Email Google (trong body)
- **Output:** Kết quả đăng nhập
- **Ghi chú:** Dùng email Google

---

## 2. API Model 3D

### 2.1. Lấy model 3D theo người dùng

- **Endpoint:** `GET /api/model3dRouter/getWithIdUser`
- **Input:** Header `Authorization: Bearer <token>`
- **Output:** Danh sách model 3D
- **Ghi chú:** Cần token

### 2.2. Lấy tất cả model 3D

- **Endpoint:** `GET /api/model3dRouter/getModel`
- **Input:** Không
- **Output:** Danh sách tất cả model 3D

### 2.3. Upload video để tạo model 3D

- **Endpoint:** `POST /api/model3dRouter/upload`
- **Input:** File video (form-data)
- **Output:** Model 3D được tạo
- **Ghi chú:** Không cần token

---

## 3. API Gửi Email

### 3.1. Gửi email

- **Endpoint:** `POST /api/sendEmail/sendEmail`
- **Input:** Body gồm email, tên người dùng, nội dung
- **Output:** Gửi email đến tài khoản chỉ định
- **Ghi chú:** Không cần token

---

## 4. API Cấu hình (Settings)

### 4.1. Lấy tất cả cấu hình (key-value)

- **Endpoint:** `GET /api/settings/getAll`
- **Input:** Không
- **Output:** Danh sách cấu hình (key-value)

### 4.2. Lấy toàn bộ cấu hình dạng bảng

- **Endpoint:** `GET /api/settings/getTable`
- **Input:** Không
- **Output:** Danh sách cấu hình

### 4.3. Cập nhật cấu hình

- **Endpoint:** `PUT /api/settings/update`
- **Input:** Body gồm `id`, `setting_value`
- **Output:** Kết quả cập nhật

### 4.4. Cập nhật logo

- **Endpoint:** `POST /api/settings/upload`
- **Input:** Hình ảnh logo mới (form-data)
- **Output:** Cập nhật thành công

---

## 5. API Thanh toán

### 5.1. Thêm giao dịch mới

- **Endpoint:** `POST /api/PaymentRouter/addnew`
- **Input:** Thông tin giao dịch (trong body)
- **Output:** Thêm vào bảng Payment

### 5.2. Thanh toán qua ZaloPay

- **Endpoint:** `POST /api/PaymentRouter/paymentZalo`
- **Input:** Thông tin thanh toán (trong body)
- **Output:** Thực hiện giao dịch và lưu DB
