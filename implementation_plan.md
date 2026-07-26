# Khởi tạo dự án thương mại điện tử "Mật Ong"

Dự án này sẽ xây dựng một website bán mật ong sử dụng stack MERN (MongoDB, Express, React, Node.js). 

## User Review Required

> [!IMPORTANT]
> **Về MongoDB Atlas**: Vì mục đích bảo mật, tôi không thể tự tạo database MongoDB Atlas cho bạn. Thay vào đó, tôi sẽ thiết lập file `.env` mẫu. Bạn sẽ cần cung cấp chuỗi kết nối (Connection String) của MongoDB Atlas của bạn hoặc điền vào file `.env` sau khi khởi tạo xong. Nếu bạn chưa có, bạn có thể tạo một tài khoản miễn phí trên MongoDB Atlas.
>
> Xin vui lòng xác nhận xem bạn muốn tôi thiết lập backend với một chuỗi kết nối giả định, hay bạn có thể cung cấp chuỗi kết nối ngay bây giờ?

## Open Questions

1. **Frontend framework**: Bạn có muốn sử dụng Vite để khởi tạo React app cho tốc độ nhanh hơn thay vì Create React App cũ không? (Khuyến nghị: Vite)
2. **Ngôn ngữ**: Bạn muốn sử dụng JavaScript hay TypeScript cho dự án này? (Mặc định tôi sẽ dùng JavaScript để đơn giản hóa).
3. **CSS**: Bạn có muốn cài đặt TailwindCSS cho frontend luôn không?

## Proposed Changes

### Backend (Node.js + Express)
Khởi tạo Node.js project và cấu hình Express server kết nối tới MongoDB.

#### [NEW] `backend/package.json`
Chứa các thư viện như `express`, `mongoose`, `cors`, `dotenv`.
#### [NEW] `backend/server.js`
File gốc của server, cấu hình middleware và kết nối tới database.
#### [NEW] `backend/config/db.js`
Cấu hình kết nối tới MongoDB Atlas sử dụng Mongoose.
#### [NEW] `backend/.env`
File chứa biến môi trường như `PORT` và `MONGO_URI`.
#### Cấu trúc thư mục backend:
- `backend/controllers/`
- `backend/models/`
- `backend/routes/`
- `backend/middlewares/`

---

### Frontend (React)
Khởi tạo React bằng Vite hoặc Create React App.

#### [NEW] `frontend/*` (Các file do Vite/React tạo ra)
Chứa toàn bộ mã nguồn của React, bao gồm cấu trúc thư mục tiêu chuẩn:
- `frontend/src/components/`
- `frontend/src/pages/`
- `frontend/src/assets/`

## Verification Plan

### Manual Verification
1. Chạy `npm install` và `npm run dev` ở cả 2 thư mục `backend` và `frontend`.
2. Kiểm tra xem React app có hiển thị trên trình duyệt (thường ở cổng 5173 hoặc 3000) không.
3. Kiểm tra console log của Backend xem đã hiển thị "MongoDB Connected..." thành công hay chưa.
