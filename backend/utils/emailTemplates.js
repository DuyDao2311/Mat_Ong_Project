export const formatCurrency = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const orderCreatedTemplate = (order) => {
  const itemsHtml = order.orderItems.map(
    (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatCurrency(item.price)}</td>
    </tr>`
  ).join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #f59e0b; text-align: center;">Cảm ơn bạn đã đặt hàng tại Mật Ong Quê!</h2>
      <p>Xin chào <strong>${order.shippingAddress.fullName}</strong>,</p>
      <p>Đơn hàng <strong>${order.id}</strong> của bạn đã được tiếp nhận và đang trong quá trình xử lý.</p>
      
      <h3 style="border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">Thông tin đơn hàng</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Sản phẩm</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Số lượng</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Tổng tiền hàng:</td>
            <td style="padding: 10px; text-align: right;">${formatCurrency(order.itemsPrice)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Phí vận chuyển:</td>
            <td style="padding: 10px; text-align: right;">${formatCurrency(order.shippingPrice)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #d97706;">Tổng cộng:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #d97706;">${formatCurrency(order.totalPrice)}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="border-bottom: 2px solid #f59e0b; padding-bottom: 5px;">Thông tin giao hàng</h3>
      <p><strong>Người nhận:</strong> ${order.shippingAddress.fullName}</p>
      <p><strong>Điện thoại:</strong> ${order.shippingAddress.phone}</p>
      <p><strong>Địa chỉ:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.district}, ${order.shippingAddress.city}</p>
      <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>

      <p style="margin-top: 30px; font-size: 14px; text-align: center; color: #777;">
        Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email này.<br>
        Trân trọng,<br>
        <strong>Đội ngũ Mật Ong Quê</strong>
      </p>
    </div>
  `;

  const text = `Cảm ơn bạn đã đặt hàng tại Mật Ong Quê!\nĐơn hàng ${order.id} của bạn đang được xử lý.\nTổng cộng: ${formatCurrency(order.totalPrice)}`;

  return { html, text };
};

const statusTranslate = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy"
};

export const orderStatusUpdateTemplate = (order, newStatus) => {
  const vnStatus = statusTranslate[newStatus] || newStatus;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #f59e0b; text-align: center;">Cập nhật trạng thái đơn hàng</h2>
      <p>Xin chào <strong>${order.shippingAddress.fullName}</strong>,</p>
      <p>Đơn hàng <strong>${order.id}</strong> của bạn vừa được cập nhật trạng thái mới.</p>
      
      <div style="background-color: #fffbeb; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px;">Trạng thái hiện tại: <strong style="color: #b45309;">${vnStatus}</strong></p>
      </div>

      <p>Chi tiết đơn hàng: ${formatCurrency(order.totalPrice)}</p>

      <p style="margin-top: 30px; font-size: 14px; text-align: center; color: #777;">
        Trân trọng,<br>
        <strong>Đội ngũ Mật Ong Quê</strong>
      </p>
    </div>
  `;

  const text = `Xin chào ${order.shippingAddress.fullName},\nĐơn hàng ${order.id} của bạn vừa được cập nhật trạng thái thành: ${vnStatus}.`;

  return { html, text };
};
