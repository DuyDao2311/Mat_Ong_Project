const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Gửi email thông qua Brevo API
 * @param {Object} options 
 * @param {String} options.to - Email người nhận
 * @param {String} options.subject - Tiêu đề email
 * @param {String} options.html - Nội dung email dạng HTML
 * @param {String} options.text - Nội dung email dạng Text
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (process.env.EMAIL_ENABLED !== "true") {
    console.log("Email is disabled. Skipping sending email to:", to);
    return;
  }

  if (!process.env.BREVO_API_KEY) {
    console.warn("No BREVO_API_KEY provided. Skipping sending email to:", to);
    return;
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "Mật Ong Ngọc Trang", email: process.env.EMAIL_USER },
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
    console.log(`[Email OK] Đã gửi email thành công đến: ${to} | Subject: ${subject}`);
  } catch (error) {
    // Chỉ in lỗi ra console để không làm chết ứng dụng (Fire-and-forget)
    console.error("Lỗi khi gửi email:", error.message);
  }
};
