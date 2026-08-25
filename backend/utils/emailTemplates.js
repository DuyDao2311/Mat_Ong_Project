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
      <h2 style="color: #f59e0b; text-align: center;">Cảm ơn bạn đã đặt hàng tại Mật Ong Ngọc Trang!</h2>
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
        <strong>Đội ngũ Mật Ong Ngọc Trang</strong>
      </p>
    </div>
  `;

  const text = `Cảm ơn bạn đã đặt hàng tại Mật Ong Ngọc Trang!\nĐơn hàng ${order.id} của bạn đang được xử lý.\nTổng cộng: ${formatCurrency(order.totalPrice)}`;

  return { html, text };
};

export const adminNewOrderTemplate = (order) => {
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
      <h2 style="color: #ef4444; text-align: center;">Thông báo: Có đơn hàng mới!</h2>
      <p>Hệ thống vừa ghi nhận một đơn hàng mới từ khách hàng <strong>${order.shippingAddress.fullName}</strong>.</p>
      <p>Mã đơn hàng: <strong>${order.id}</strong></p>
      
      <h3 style="border-bottom: 2px solid #ef4444; padding-bottom: 5px;">Thông tin đơn hàng</h3>
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
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #b91c1c;">Tổng cộng:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #b91c1c;">${formatCurrency(order.totalPrice)}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="border-bottom: 2px solid #ef4444; padding-bottom: 5px;">Thông tin giao hàng</h3>
      <p><strong>Người nhận:</strong> ${order.shippingAddress.fullName}</p>
      <p><strong>Điện thoại:</strong> ${order.shippingAddress.phone}</p>
      <p><strong>Địa chỉ:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.district}, ${order.shippingAddress.city}</p>
      <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>

      <p style="margin-top: 30px; font-size: 14px; text-align: center; color: #777;">
        Vui lòng đăng nhập vào trang quản trị để xử lý đơn hàng này.
      </p>
    </div>
  `;

  const text = `Có đơn hàng mới ${order.id} từ khách hàng ${order.shippingAddress.fullName}.\nTổng cộng: ${formatCurrency(order.totalPrice)}\nVui lòng kiểm tra trang quản trị.`;

  return { html, text };
};

const statusTranslate = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy"
};

const statusColor = {
  PENDING: "#f59e0b",
  PROCESSING: "#3b82f6",
  SHIPPED: "#8b5cf6",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444"
};

const statusBgColor = {
  PENDING: "#fffbeb",
  PROCESSING: "#eff6ff",
  SHIPPED: "#f5f3ff",
  DELIVERED: "#ecfdf5",
  CANCELLED: "#fef2f2"
};

const statusMessage = {
  PENDING: "Đơn hàng của bạn đang chờ được xử lý. Chúng tôi sẽ sớm xác nhận và chuẩn bị hàng cho bạn.",
  PROCESSING: "Đơn hàng của bạn đang được chuẩn bị. Chúng tôi sẽ giao hàng cho đơn vị vận chuyển trong thời gian sớm nhất.",
  SHIPPED: "Đơn hàng của bạn đã được bàn giao cho đơn vị vận chuyển. Vui lòng chú ý điện thoại để nhận hàng.",
  DELIVERED: "Đơn hàng đã được giao thành công. Cảm ơn bạn đã tin tưởng Mật Ong Ngọc Trang!",
  CANCELLED: "Đơn hàng của bạn đã bị hủy. Nếu bạn cần hỗ trợ, vui lòng liên hệ với chúng tôi."
};

export const orderStatusUpdateTemplate = (order, newStatus) => {
  const vnStatus = statusTranslate[newStatus] || newStatus;
  const color = statusColor[newStatus] || "#f59e0b";
  const bgColor = statusBgColor[newStatus] || "#fffbeb";
  const message = statusMessage[newStatus] || "";

  const itemsHtml = order.orderItems.map(
    (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.qty)}</td>
    </tr>`
  ).join("");

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: ${color}; text-align: center;">Cập nhật trạng thái đơn hàng</h2>
      <p>Xin chào <strong>${order.shippingAddress.fullName}</strong>,</p>
      <p>Đơn hàng <strong>${order.id}</strong> của bạn vừa được cập nhật trạng thái mới.</p>
      
      <div style="background-color: ${bgColor}; padding: 15px; border-left: 4px solid ${color}; margin: 20px 0;">
        <p style="margin: 0 0 8px 0; font-size: 16px;">Trạng thái hiện tại: <strong style="color: ${color};">${vnStatus}</strong></p>
        <p style="margin: 0; font-size: 14px; color: #555;">${message}</p>
      </div>

      <h3 style="border-bottom: 2px solid ${color}; padding-bottom: 5px;">Chi tiết đơn hàng</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background-color: #f9f9f9;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Sản phẩm</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">SL</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Đơn giá</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Tổng tiền hàng:</td>
            <td style="padding: 10px; text-align: right;">${formatCurrency(order.itemsPrice)}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">Phí vận chuyển:</td>
            <td style="padding: 10px; text-align: right;">${formatCurrency(order.shippingPrice)}</td>
          </tr>
          <tr>
            <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: ${color};">Tổng cộng:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: ${color};">${formatCurrency(order.totalPrice)}</td>
          </tr>
        </tfoot>
      </table>

      <h3 style="border-bottom: 2px solid ${color}; padding-bottom: 5px;">Thông tin giao hàng</h3>
      <p><strong>Người nhận:</strong> ${order.shippingAddress.fullName}</p>
      <p><strong>Điện thoại:</strong> ${order.shippingAddress.phone}</p>
      <p><strong>Địa chỉ:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.district}, ${order.shippingAddress.city}</p>
      <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>

      <p style="margin-top: 30px; font-size: 14px; text-align: center; color: #777;">
        Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.<br>
        Trân trọng,<br>
        <strong>Đội ngũ Mật Ong Ngọc Trang</strong>
      </p>
    </div>
  `;

  const itemsText = order.orderItems.map(item => `- ${item.name} x${item.qty}: ${formatCurrency(item.price * item.qty)}`).join("\\n");
  const text = `Xin chào ${order.shippingAddress.fullName},\\nĐơn hàng ${order.id} của bạn vừa được cập nhật trạng thái thành: ${vnStatus}.\\n${message}\\n\\nChi tiết đơn hàng:\\n${itemsText}\\nTổng cộng: ${formatCurrency(order.totalPrice)}`;

  return { html, text };
};

export const adminOrderPaidTemplate = (order) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #10b981; text-align: center;">Thông báo: Đơn hàng đã được thanh toán!</h2>
      <p>Khách hàng <strong>${order.shippingAddress.fullName}</strong> vừa thanh toán thành công cho đơn hàng <strong>${order.id}</strong>.</p>
      
      <div style="background-color: #ecfdf5; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px;">Số tiền đã nhận: <strong style="color: #047857;">${formatCurrency(order.totalPrice)}</strong></p>
      </div>

      <p>Vui lòng kiểm tra hệ thống quản trị để tiến hành chuẩn bị đơn hàng.</p>
    </div>
  `;

  const text = `Thông báo: Khách hàng ${order.shippingAddress.fullName} đã thanh toán ${formatCurrency(order.totalPrice)} cho đơn hàng ${order.id}.\nVui lòng kiểm tra hệ thống.`;

  return { html, text };
};
