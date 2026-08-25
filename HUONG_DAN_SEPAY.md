# Hướng dẫn chuyển đổi SePay sang môi trường thực tế (Production)

Chào bạn, để chuyển đổi từ môi trường test sang môi trường thanh toán thật (production) với SePay trong dự án của bạn, bạn không cần phải thay đổi logic code vì hệ thống của bạn đã được thiết kế sẵn để chạy linh hoạt thông qua các biến môi trường.

Bạn chỉ cần thực hiện việc cấu hình lại theo các bước chi tiết sau:

## Bước 1: Thay đổi thông tin ngân hàng thật trong file `.env` (Backend)

Hệ thống tạo mã QR của bạn đang lấy thông tin ngân hàng từ file cấu hình `.env` của backend. Bạn mở file `backend/.env` và thay đổi các giá trị sau thành thông tin ngân hàng thật của bạn (tài khoản bạn dùng để nhận tiền):

```env
# Thay đổi thành mã ngân hàng của bạn (VD: MB, VCB, TCB,...)
BANK_CODE=MB 

# Thay đổi thành số tài khoản thật của bạn
BANK_ACCOUNT=SỐ_TÀI_KHOẢN_THẬT_CỦA_BẠN 

# Thay đổi thành tên chủ tài khoản thật (Viết hoa không dấu)
BANK_OWNER=TÊN_CHỦ_TÀI_KHOẢN
```

## Bước 2: Cấu hình Webhook trên trang quản trị của SePay

Để SePay báo cáo thành công khi có người chuyển khoản thật vào tài khoản của bạn, bạn cần vào trang quản trị của SePay và cấu hình Webhook:

1. Đăng nhập vào tài khoản SePay của bạn (https://sepay.vn).
2. Chắc chắn rằng bạn đã kết nối ngân hàng thật của mình với SePay thành công.
3. Đi tới mục **Tích hợp** -> **Webhook** (hoặc Webhook API).
4. Thêm một Webhook mới với URL là địa chỉ website thật (domain) của bạn trỏ về API endpoint:
   `https://ten-mien-cua-ban.com/api/payments/sepay/webhook`
   *(Lưu ý: Nếu bạn đang test ở localhost, bạn phải dùng ngrok hoặc deploy backend lên một server thật có public IP/Domain thì SePay mới gọi tới được)*.
5. Khi bạn tạo Webhook, SePay sẽ cung cấp cho bạn một chuỗi **Webhook Secret** (Thường có dạng `whsec_...`). Hãy copy đoạn mã này.

## Bước 3: Cập nhật Webhook Secret vào Backend

Trở lại file `backend/.env`, bạn dán đoạn mã Webhook Secret vừa copy vào:

```env
# Thay bằng Webhook Secret thật lấy từ trang quản trị SePay
SEPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxx 
```

## Bước 4: Khởi động lại Backend

Sau khi đã lưu file `.env`, bạn cần khởi động lại server backend để hệ thống nhận cấu hình mới.
Nếu bạn đang chạy Node.js trực tiếp, hãy nhấn `Ctrl + C` để tắt và chạy lại `npm run server` hoặc `node server.js`.

> [!IMPORTANT]  
> **Lưu ý quan trọng khi lên môi trường thật:**
> 1. **Bảo mật:** Đảm bảo file `.env` của bạn không bị đưa lên Github (đã có trong `.gitignore`).
> 2. **Domain Webhook:** Endpoint webhook `POST /api/payments/sepay/webhook` của bạn phải là địa chỉ truy cập công khai (HTTPS) để máy chủ SePay có thể gửi dữ liệu xác nhận.
> 3. Hệ thống của bạn đang lấy nội dung chuyển khoản là mã thanh toán (VD: `DH12345678`), khi quét QR khách hàng sẽ tự động có nội dung này. SePay sẽ đọc nội dung chuyển khoản đó để tự động cập nhật trạng thái đơn hàng.
