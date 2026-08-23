import crypto from 'crypto';

const TOLERANCE_SECONDS = 300; // 5 phút

/**
 * Middleware xác minh HMAC-SHA256 signature từ SePay Webhook.
 * 
 * SePay gửi:
 *   Header: X-SePay-Signature = sha256=<hex_hash>
 *   Header: X-SePay-Timestamp = <unix_timestamp_seconds>
 * 
 * Công thức ký: HMAC-SHA256(secret, timestamp + "." + rawBody)
 */
export const verifySepaySignature = (req, res, next) => {
    const secret = process.env.SEPAY_WEBHOOK_SECRET;

    // Nếu chưa cấu hình secret, bỏ qua xác minh (cho phép No Auth trong dev)
    if (!secret || secret === 'your_sepay_test_secret_here') {
        console.warn('WARNING: SEPAY_WEBHOOK_SECRET not configured. Skipping HMAC verification.');
        return next();
    }

    const signatureHeader = req.headers['x-sepay-signature'];
    const timestampHeader = req.headers['x-sepay-timestamp'];

    // Kiểm tra header tồn tại
    if (!signatureHeader) {
        console.error('HMAC Verify: Missing X-SePay-Signature header');
        return res.status(401).json({ success: false, message: 'Missing signature' });
    }

    if (!timestampHeader) {
        console.error('HMAC Verify: Missing X-SePay-Timestamp header');
        return res.status(401).json({ success: false, message: 'Missing timestamp' });
    }

    // Replay protection: kiểm tra timestamp không quá cũ
    const timestamp = parseInt(timestampHeader, 10);
    const now = Math.floor(Date.now() / 1000);
    if (isNaN(timestamp) || Math.abs(now - timestamp) > TOLERANCE_SECONDS) {
        console.error(`HMAC Verify: Timestamp too old or invalid. Received: ${timestamp}, Now: ${now}`);
        return res.status(401).json({ success: false, message: 'Timestamp expired or invalid' });
    }

    // Lấy raw body (đã được lưu bởi verify callback trong express.json)
    const rawBody = req.rawBody;
    if (!rawBody) {
        console.error('HMAC Verify: Raw body not available');
        return res.status(401).json({ success: false, message: 'Raw body not available for verification' });
    }

    // Tính HMAC-SHA256 signature
    const signedPayload = `${timestampHeader}.${rawBody}`;
    const expectedSignature = 'sha256=' + crypto
        .createHmac('sha256', secret)
        .update(signedPayload)
        .digest('hex');

    // Constant-time comparison để chống timing attack
    const sigBuffer = Buffer.from(signatureHeader);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        console.error('HMAC Verify: Signature mismatch');
        return res.status(401).json({ success: false, message: 'Invalid signature' });
    }

    // Signature hợp lệ
    next();
};
