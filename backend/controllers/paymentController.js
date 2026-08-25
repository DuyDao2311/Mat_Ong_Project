import Payment from '../models/Payment.js';
import Order from '../models/Order.js';
import { sendEmail } from '../utils/sendEmail.js';
import { orderCreatedTemplate, adminNewOrderTemplate } from '../utils/emailTemplates.js';

// Generate payment code like DH12345678
const generatePaymentCode = () => {
    const random = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 digits
    return `DH${random}`;
};

// @desc    Create a payment for an order
// @route   POST /api/payments/create
// @access  Private
export const createPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'Missing orderId' });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns order
        if (order.user) {
            if (!req.user || order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to pay for this order' });
            }
        }

        // Check if order is already paid
        if (order.isPaid || order.paymentStatus === 'PAID') {
            return res.status(400).json({ message: 'Order is already paid' });
        }
        
        // Check if order is cancelled
        if (order.orderStatus === 'CANCELLED') {
            return res.status(400).json({ message: 'Order is cancelled' });
        }

        // Check for existing payment
        let payment = await Payment.findOne({ orderId: order._id });
        if (payment) {
            if (['PAID', 'PARTIALLY_PAID', 'OVERPAID'].includes(payment.status)) {
                return res.status(400).json({ message: 'Order is already paid or being paid' });
            }
            payment.status = 'PENDING';
            await payment.save();
        } else {
            const paymentCode = order.id.replace(/-/g, '');
            payment = new Payment({
                paymentCode,
                orderId: order._id,
                orderCode: order.id, 
                amount: order.totalPrice,
                method: 'SePay',
                provider: 'SePay',
                status: 'PENDING'
            });
            await payment.save();
        }

        const createdPayment = payment;

        const bankCode = process.env.BANK_CODE || 'MB';
        const accountNo = process.env.BANK_ACCOUNT || '0987654321';
        const accountName = process.env.BANK_OWNER || 'NGUYEN VAN A';
        const transferContent = createdPayment.paymentCode;

        // https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
        const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.png?amount=${createdPayment.amount}&addInfo=${transferContent}&accountName=${encodeURIComponent(accountName)}`;

        res.status(201).json({
            paymentCode: createdPayment.paymentCode,
            orderCode: createdPayment.orderCode,
            amount: createdPayment.amount,
            status: createdPayment.status,
            paymentMethod: createdPayment.method,
            provider: createdPayment.provider,
            bankCode,
            accountNumber: accountNo,
            accountName,
            transferContent,
            qrUrl
        });

    } catch (error) {
        console.error("Create payment error:", error);
        res.status(500).json({ message: 'Server error creating payment' });
    }
};

// @desc    Handle SePay Webhook
// @route   POST /api/payments/sepay/webhook
// @access  Public
export const sepayWebhook = async (req, res) => {
    try {
        console.log("SePay Webhook Received:", req.body);
        
        const {
            id,
            gateway,
            transactionDate,
            accountNumber,
            code,
            content,
            transferType,
            transferAmount,
            referenceCode
        } = req.body;

        // 1. Chỉ xử lý tiền vào
        if (transferType !== 'in') {
            return res.status(200).json({ success: true, message: 'Ignored: Not an incoming transfer' });
        }

        // 2. Chống Duplicate: Kiểm tra transactionId
        const existingTx = await Payment.findOne({ transactionId: String(id) });
        if (existingTx) {
            return res.status(200).json({ success: true, message: 'Ignored: Transaction already processed' });
        }

        // 3. Kiểm tra và trích xuất mã (Tự động trích xuất từ content để phòng SePay giới hạn 8 số)
        let actualCode = code;
        if (content) {
            const match = content.match(/DH\d+/i);
            if (match) {
                actualCode = match[0].toUpperCase();
            }
        }

        if (!actualCode) {
            return res.status(200).json({ success: true, message: 'Ignored: No payment code found' });
        }

        // 4. Tìm Payment
        const payment = await Payment.findOne({ paymentCode: actualCode });
        if (!payment) {
            return res.status(200).json({ success: true, message: 'Ignored: Payment not found' });
        }

        // 5. Tìm Order
        const order = await Order.findById(payment.orderId);
        if (!order) {
            return res.status(200).json({ success: true, message: 'Ignored: Order not found' });
        }

        // 6. Kiểm tra trạng thái Payment
        if (payment.status !== 'PENDING' && payment.status !== 'PARTIALLY_PAID') {
            return res.status(200).json({ success: true, message: 'Ignored: Payment is already PAID or OVERPAID' });
        }

        // 7. Cộng dồn số tiền
        payment.amountReceived = (payment.amountReceived || 0) + Number(transferAmount);
        order.amountReceived = (order.amountReceived || 0) + Number(transferAmount);

        // 8. Đánh giá trạng thái
        let newStatus = 'PENDING';
        let isPaid = false;
        const wasPaid = payment.status === 'PAID' || payment.status === 'OVERPAID';

        console.log(`[Payment Debug] amountReceived: ${payment.amountReceived}, amount: ${payment.amount}, wasPaid: ${wasPaid}`);

        if (payment.amountReceived < payment.amount) {
            newStatus = 'PARTIALLY_PAID';
        } else if (payment.amountReceived >= payment.amount) {
            newStatus = payment.amountReceived === payment.amount ? 'PAID' : 'OVERPAID';
            isPaid = true;
        }

        console.log(`[Payment Debug] newStatus: ${newStatus}, isPaid: ${isPaid}`);

        // 9. Cập nhật dữ liệu
        payment.status = newStatus;
        payment.transactionId = String(id);
        payment.transactionContent = content;
        if (isPaid && !payment.paidAt) payment.paidAt = new Date();
        await payment.save();

        order.paymentStatus = newStatus;
        order.isPaid = isPaid;
        if (isPaid && !order.paidAt) order.paidAt = new Date();
        await order.save();

        // 10. Gửi email xác nhận đơn hàng cho khách (Fire-and-forget)
        console.log(`[Email Debug] isPaid: ${isPaid}, wasPaid: ${wasPaid}, email: ${order.shippingAddress?.email}, EMAIL_USER: ${process.env.EMAIL_USER}`);
        if (isPaid && !wasPaid) {
            if (order.shippingAddress && order.shippingAddress.email) {
                console.log(`[Email] Gửi email xác nhận đơn hàng cho khách: ${order.shippingAddress.email}`);
                const customerEmail = orderCreatedTemplate(order);
                sendEmail({
                    to: order.shippingAddress.email,
                    subject: `[Mật Ong Ngọc Trang] Xác nhận đơn hàng ${order.id}`,
                    html: customerEmail.html,
                    text: customerEmail.text
                });
            } else {
                console.log(`[Email] Không gửi email cho khách vì thiếu shippingAddress.email`);
            }

            // 11. Gửi email thông báo "Có đơn hàng mới" cho Admin (Fire-and-forget)
            if (process.env.EMAIL_USER) {
                console.log(`[Email] Gửi email thông báo Admin: ${process.env.EMAIL_USER}`);
                const adminEmail = adminNewOrderTemplate(order);
                sendEmail({
                    to: process.env.EMAIL_USER,
                    subject: `[Thông báo Admin] Có đơn hàng mới - ${order.id}`,
                    html: adminEmail.html,
                    text: adminEmail.text
                });
            }
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("SePay Webhook Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get payment status by payment code
// @route   GET /api/payments/:paymentCode/status
// @access  Public (hoặc Protect tuỳ yêu cầu, nhưng test đang cần tự động nhận biết)
export const getPaymentStatus = async (req, res) => {
    try {
        const { paymentCode } = req.params;
        const payment = await Payment.findOne({ paymentCode });
        
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        // Tạo lại qrUrl để phòng trường hợp user refresh trang cần hiển thị lại
        const bankCode = process.env.BANK_CODE || "MB";
        const accountNo = process.env.BANK_ACCOUNT || "0000000000";
        const accountName = process.env.BANK_OWNER || "NGUYEN VAN A";
        
        const remainingAmount = payment.amount - (payment.amountReceived || 0);
        const amountForQR = remainingAmount > 0 ? remainingAmount : payment.amount;

        const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNo}-compact2.png?amount=${amountForQR}&addInfo=${payment.paymentCode}&accountName=${encodeURIComponent(accountName)}`;

        res.status(200).json({
            success: true,
            data: {
                paymentCode: payment.paymentCode,
                orderCode: payment.orderCode,
                amount: payment.amount,
                amountReceived: payment.amountReceived || 0,
                status: payment.status,
                bankCode,
                accountNumber: accountNo,
                accountName,
                transferContent: payment.paymentCode,
                qrUrl
            }
        });
    } catch (error) {
        console.error("Get Payment Status Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
