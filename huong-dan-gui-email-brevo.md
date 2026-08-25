# Hướng dẫn: Gửi email bằng Brevo (Room Management)

Tài liệu mô tả cách hệ thống **Room Management** gửi email transactional (quên mật khẩu,
thông báo hóa đơn, hợp đồng, lịch hẹn…) qua **Brevo HTTP API**, và cách tự cấu hình lại
từ đầu cho môi trường của bạn.

Toàn bộ logic gửi mail nằm gọn trong **một file duy nhất**: `backend/utils/sendEmail.js` (~25 dòng).

---

## 1. Vì sao dùng Brevo API thay vì Gmail SMTP?

Ban đầu dự án dùng `nodemailer` + Gmail SMTP (`service: "gmail"`). Khi deploy lên **Render
free tier** thì email không bao giờ tới, dù thông báo in-app vẫn chạy bình thường.

Nguyên nhân: **Render free tier chặn outbound SMTP (port 465/587)** → nodemailer báo
`Connection timeout`, lỗi lại bị nuốt vì email gửi kiểu fire-and-forget.

Cách xử lý: đổi sang **Brevo Transactional Email API** — gửi bằng một HTTP POST qua
**port 443**, port này không bị chặn ở bất kỳ PaaS nào.

| | Gmail SMTP (nodemailer) | Brevo HTTP API |
|---|---|---|
| Giao thức | SMTP, port 465/587 | HTTPS, port 443 |
| Bị PaaS free chặn | ❌ Có (Render, nhiều nơi khác) | ✅ Không |
| Xác thực | App Password (phải bật 2FA) | API key trong header |
| Hạn mức miễn phí | ~500 mail/ngày (không chính thức) | ~300 mail/ngày (gói Free, xem lại trang pricing) |
| Thư viện cần cài | `nodemailer` | Không — dùng `fetch` có sẵn của Node 18+ |

> Chốt lại: chọn Brevo **không phải vì tính năng**, mà vì **đường mạng** — HTTP đi được nơi SMTP bị chặn.

---

## 2. Kiến trúc — luồng gửi mail

```
                                        ┌─────────────────────────────┐
routes/auth.js                          │  utils/emailTemplates.js    │
  ├─ POST /forgot-password ──┐          │  - passwordResetTemplate    │
  ├─ POST /reset-password ───┤          │  - passwordChangedTemplate  │
  └─ ... (đổi mật khẩu…)     │          │  - notificationEmailTemplate│
                             │          └──────────────┬──────────────┘
utils/notificationService.js │                         │ {html, text}
  └─ dispatch()  ────────────┤                         ▼
      (hóa đơn, hợp đồng,    ├──────────►  utils/sendEmail.js  ──HTTPS POST──►  Brevo API
       lịch hẹn, sự cố…)     │                (1 file duy nhất)                api.brevo.com
                             │                                                       │
                             └── kênh in-app + Socket.io (song song)                  ▼
                                                                            Hộp thư người nhận
```

Điểm quan trọng: **mọi nơi trong code đều gọi cùng một hàm** `sendEmail({to, subject, html, text})`.
Khi migrate từ nodemailer sang Brevo, chỉ sửa đúng file đó — không caller nào phải đổi.
Đây là lợi ích của việc bọc dependency bên ngoài sau một interface nhỏ của mình.

---

## 3. Thiết lập tài khoản Brevo (làm 1 lần, ~5 phút)

1. **Đăng ký** tại <https://www.brevo.com> (miễn phí, không cần thẻ).
2. **Xác thực địa chỉ gửi (sender)**: vào **Senders, Domains & Dedicated IPs → Senders → Add a sender**,
   nhập email dùng làm người gửi (ví dụ Gmail cá nhân), rồi bấm link xác nhận trong hộp thư.
   ⚠️ Email chưa verify → API trả lỗi 400, mail không đi.
3. **Tạo API key**: **SMTP & API → API keys → Generate a new API key**.
   Copy ngay — key chỉ hiện một lần.
4. **Đặt key vào biến môi trường** của nơi deploy (Render → Environment → Add Environment Variable).
   ⚠️ **Tuyệt đối không commit key vào Git.** GitHub push protection nhận diện được pattern key
   của Brevo và sẽ chặn push (dự án này đã dính một lần).

---

## 4. Biến môi trường

| Biến | Bắt buộc | Ý nghĩa |
|---|---|---|
| `BREVO_API_KEY` | ✅ | API key lấy ở bước 3. Gửi trong header `api-key`. |
| `EMAIL_USER` | ✅ | Địa chỉ người gửi — **phải trùng sender đã verify ở Brevo**. |
| `EMAIL_ENABLED` | ❌ | Đặt `false` để **tắt hẳn email kênh notification** khi chạy local/dev (tránh spam + đốt quota). Bỏ trống = bật. |
| `CLIENT_URL` | ✅ | URL frontend, dùng dựng link reset password trong nội dung mail. |

Ví dụ `.env` (local):

```env
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxx
EMAIL_USER=ten-ban@gmail.com
EMAIL_ENABLED=false
CLIENT_URL=http://localhost:3000
```

---

## 5. Code — `backend/utils/sendEmail.js`

```js
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

async function sendEmail({ to, subject, html, text }) {
  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "Room Management", email: process.env.EMAIL_USER },
      to: [{ email: to }],
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Brevo API ${res.status}: ${errBody}`);
  }
}

module.exports = sendEmail;
```

Giải thích các điểm dễ sai:

- **`fetch` có sẵn từ Node 18+** — không cần `axios`/`node-fetch`. Node cũ hơn thì phải cài thêm.
- **Xác thực bằng header `api-key`**, không phải `Authorization: Bearer`. Đây là quy ước riêng của Brevo.
- **`to` là mảng object** `[{ email }]`, không phải chuỗi — gửi nhiều người thì thêm phần tử.
- **`htmlContent` / `textContent`** là tên field của Brevo (không phải `html`/`text` như nodemailer).
  Luôn gửi kèm bản text để mail đỡ bị đánh spam.
- **Bắt buộc phải tự check `res.ok`**: `fetch` **không** throw khi server trả 4xx/5xx — nó chỉ throw
  khi lỗi mạng. Thiếu đoạn này, mail lỗi 401/400 sẽ "im lặng thành công", đúng cái bug ban đầu.
- **Interface giữ nguyên** `{to, subject, html, text}` để không caller nào phải sửa.

---

## 6. Hai kiểu gọi — và lý do khác nhau

**a) `await` + rollback — dùng cho luồng mà email LÀ kết quả** (`routes/auth.js`, quên mật khẩu):

```js
try {
  await sendEmail({ to: user.email, subject: "Đặt lại mật khẩu - Room Management", html, text });
} catch (mailErr) {
  await User.updateOne({ _id: user._id },
    { $unset: { resetPasswordToken: "", resetPasswordExpires: "" } });
  return res.status(500).json({ message: "Không gửi được email. Vui lòng thử lại." });
}
```

Gửi hỏng thì **xóa luôn token vừa tạo** rồi báo lỗi — không để user chờ một email không bao giờ tới.

**b) Fire-and-forget — dùng cho notification** (`utils/notificationService.js`):

```js
if (channels.includes("email") && process.env.EMAIL_ENABLED !== "false") {
  recipients.forEach((r) => {
    if (r && r.email) {
      sendEmail({ to: r.email, subject: data.title, html, text })
        .catch((err) => console.error(`[email] gửi đến ${r.email} thất bại:`, err.message));
    }
  });
}
```

**Cố ý không `await`**: hóa đơn/hợp đồng vẫn phải tạo thành công dù mail hỏng. Nếu await, request
phải chờ Brevo 1–3s và một lỗi mail sẽ phá cả response. Nhưng **bắt buộc có `.catch`** — Promise
bị reject mà không catch sẽ làm Node cảnh báo (và ở Node đời mới có thể crash process).

---

## 7. Kiểm thử

**Test tự động (Jest)** — mock `sendEmail`, không gọi Brevo thật:

```js
jest.mock("../utils/sendEmail", () => jest.fn(() => Promise.resolve()));
const sendEmail = require("../utils/sendEmail");

expect(sendEmail).toHaveBeenCalledTimes(2);
sendEmail.mockRejectedValueOnce(new Error("SMTP down")); // kiểm tra flow không vỡ khi mail lỗi
```

Xem `backend/__tests__/notificationDispatch.test.js` và `auth.forgot-password.test.js`.

**Test tay bằng `curl`** (kiểm tra key + sender trước khi động vào code):

```bash
curl -X POST https://api.brevo.com/v3/smtp/email \
  -H "api-key: $BREVO_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "sender": {"name":"Room Management","email":"ten-ban@gmail.com"},
    "to": [{"email":"nguoi-nhan@gmail.com"}],
    "subject": "Test Brevo",
    "htmlContent": "<p>Hoạt động rồi</p>"
  }'
```

Thành công trả `201` kèm `{"messageId":"..."}`.

---

## 8. Xử lý sự cố

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| `Brevo API 401` | `BREVO_API_KEY` sai / chưa set / còn dấu nháy thừa | Kiểm tra biến env ở Render, tạo lại key |
| `Brevo API 400 ... sender not valid` | `EMAIL_USER` chưa verify trong Brevo | Verify sender rồi bấm link trong hộp thư |
| Không lỗi nhưng mail không tới | Quên check `res.ok`; hoặc `EMAIL_ENABLED=false`; hoặc mail vào Spam | Xem log server, kiểm tra thư mục Spam |
| `fetch is not defined` | Node < 18 | Nâng Node lên ≥18, hoặc cài `node-fetch` |
| `Connection timeout` khi gửi mail | Vẫn còn code SMTP cũ ở đâu đó | Grep `nodemailer` — phải không còn chỗ nào dùng |
| Push bị GitHub chặn | Lỡ commit API key vào repo | Xóa key khỏi code + **thu hồi key đó ở Brevo**, tạo key mới |
| `402` / hết quota | Vượt hạn mức miễn phí trong ngày | Chờ reset theo ngày hoặc nâng gói |

---

## 9. Tóm tắt để làm lại trong dự án khác

1. Tạo tài khoản Brevo → verify sender → lấy API key.
2. Set `BREVO_API_KEY` và `EMAIL_USER` vào env (không commit).
3. Copy nguyên file `sendEmail.js` (~25 dòng, không cần thư viện ngoài).
4. Mọi chỗ gửi mail chỉ gọi `sendEmail({to, subject, html, text})`.
5. Nhớ 3 điều: check `res.ok`; `.catch` cho lời gọi fire-and-forget; có công tắc tắt mail khi dev.
