1. http://localhost:55009/api/userRouter/getUser
   method: get
   input: Authorization: Bearer <googleToken>
   output: thông tin tài khoản
   lưu ý: phải có googleToken để lấy thông tin

2. http://localhost:55009/api/userRouter/getemailwithtoken
   method: get
   input: req.query.token
   output: email
   lưu ý: phải có token để lấy thông tin

3. http://localhost:55009/api/userRouter/getAllUser
   method: get
   input: req.query.token
   output: thông tin của tất cả các tài khoản
   lưu ý: phải có token để lấy thông tin

4. http://localhost:55009/api/userRouter/getAllWithToKen
   method: get
   input: req.query.token
   output: thông tin của tất cả các tài khoản
   lưu ý: phải có token để lấy thông tin

5. http://localhost:55009/api/userRouter/getUserRole
   method: get
   input: req.query.token
   output: thông tin role của token
   lưu ý: phải có token để lấy thông tin

6. http://localhost:55009/api/userRouter/loginUser
   method: post
   input: google email
   output: kết quả của việc đăng nhập
   lưu ý: phải dùng tài khoản email google

///////////////////////////////////////////////////////////////////////////////////

7. http://localhost:55009/api/model3dRouter/getWithIdUser
   method: get
   input: headers.authorization
   output: thông tin của các model 3d theo tài khoản
   lưu ý: phải có token gửi về

8. http://localhost:55009/api/model3dRouter/getModel
   method: get
   input: không
   output: thông tin của tất cả các model 3d
   lưu ý: không

9. http://localhost:55009/api/model3dRouter/upload
   method: post
   input: file video
   output: model 3d đã được tạo
   lưu ý: không

10. http://localhost:55009/api/model3dRouter/upload
    method: post
    input: file video
    output: model 3d đã được tạo
    lưu ý: không

///////////////////////////////////////////////////////////////////////////////////

11. http://localhost:55009/api/sendEmail/sendEmail
    method: post
    input: thông tin email, tên người dùng, nội dung được gửi từ về từ body
    output: gửi email đến tài khoản được chỉ định trước
    lưu ý: không

///////////////////////////////////////////////////////////////////////////////////

12. http://localhost:55009/api/settings/getAll
    method: get
    input: không
    output: thông tin cấu hình web theo key-value
    lưu ý: không

13. http://localhost:55009/api/settings/getTable
    method: get
    input: không
    output: tất cả thông tin về cấu hình web
    lưu ý: không

14. http://localhost:55009/api/settings/update
    method: put
    input: thông tin id và setting_value được gửi về từ body
    output: cập nhật thông tin
    lưu ý: không

15. http://localhost:55009/api/settings/upload
    method: post
    input: hình cho logo mới
    output: cập nhật logo
    lưu ý: không

///////////////////////////////////////////////////////////////////////////////////

16. http://localhost:55009/api/PaymentRouter/addnew
    method: post
    input: thông tin được gửi về từ body
    output: tạo được dữ liệu cho bảng Paymen
    lưu ý: không

17. http://localhost:55009/api/PaymentRouter/paymentZalo
    method: post
    input: thông tin được gửi về từ body
    output: thực hiện chuyển tiền và lưu vào csdl
    lưu ý: không
