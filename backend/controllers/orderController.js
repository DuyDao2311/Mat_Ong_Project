import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendEmail } from '../utils/sendEmail.js';
import { orderCreatedTemplate, orderStatusUpdateTemplate, adminNewOrderTemplate, adminOrderPaidTemplate } from '../utils/emailTemplates.js';

const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `DH-${timestamp}${random}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest) or Private (User)
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 1. Kiểm tra tồn kho trước khi đặt hàng
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Sản phẩm ${product.name} không đủ số lượng trong kho.` });
      }
    }

    const order = new Order({
      id: generateOrderId(),
      orderItems,
      user: req.user ? req.user._id : null, 
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();

    // 2. Trừ tồn kho và tăng số lượng đã bán
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty, sold: item.qty }
      });
    }

    // 3. Email xác nhận sẽ được gửi sau khi khách thanh toán thành công (xem paymentController.js)

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('orderItems.product', 'name price weight id');
    
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Fetch order error:", error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const previousStatus = order.orderStatus;
      const previousPaymentStatus = order.paymentStatus;
      order.orderStatus = req.body.status || order.orderStatus;
      
      if (req.body.status === 'DELIVERED') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      
      if (req.body.status === 'SHIPPED') {
          // Additional logic if needed for SHIPPED
      }

      // 3. Hoàn trả tồn kho nếu đơn hàng bị HỦY
      if (req.body.status === 'CANCELLED' && previousStatus !== 'CANCELLED') {
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { countInStock: item.qty, sold: -item.qty }
          });
        }
      }

      if (req.body.paymentStatus) {
        order.paymentStatus = req.body.paymentStatus;
        if (req.body.paymentStatus === 'PAID') {
          order.isPaid = true;
          order.paidAt = Date.now();
        }
      }

      const updatedOrder = await order.save();

      // 4. Gửi email thông báo cập nhật trạng thái (Fire-and-forget)
      if (updatedOrder.shippingAddress && updatedOrder.shippingAddress.email && req.body.status && req.body.status !== previousStatus) {
        const { html, text } = orderStatusUpdateTemplate(updatedOrder, req.body.status);
        sendEmail({
          to: updatedOrder.shippingAddress.email,
          subject: `[Mật Ong Ngọc Trang] Cập nhật trạng thái đơn hàng ${updatedOrder.id}`,
          html,
          text
        });
      }

      // 5. Gửi email thông báo thanh toán thành công cho Admin (Fire-and-forget)
      if (process.env.EMAIL_USER && req.body.paymentStatus === 'PAID' && previousPaymentStatus !== 'PAID') {
        const { html, text } = adminOrderPaidTemplate(updatedOrder);
        sendEmail({
          to: process.env.EMAIL_USER,
          subject: `[Thông báo Admin] Khách hàng đã thanh toán đơn hàng ${updatedOrder.id}`,
          html,
          text
        });
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
