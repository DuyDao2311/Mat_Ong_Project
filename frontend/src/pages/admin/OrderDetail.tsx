import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaFileInvoice, FaMoneyBill, FaHourglassHalf, FaTruck, FaHome, FaUniversity, FaUser, FaChevronDown, FaEnvelope, FaPhone } from 'react-icons/fa';
import api from '../../services/api';
import './OrderList.css';

interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
  product: any;
}

interface Order {
  _id: string;
  id: string;
  createdAt: string;
  totalPrice: number;
  itemsPrice: number;
  shippingPrice: number;
  amountReceived?: number;
  orderStatus: string;
  paymentStatus: string;
  isPaid: boolean;
  paymentMethod: string;
  paidAt?: string;
  shippingAddress: {
    fullName: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
    district: string;
  };
  orderItems: OrderItem[];
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      await api.put(`/orders/${id}/status`, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công!');
      fetchOrder(); // Reload data
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setUpdating(false);
      setShowStatusMenu(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Đang tải...</div>;
  }

  if (!order) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>Không tìm thấy đơn hàng.</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const resolveImageUrl = (url: string) => {
    if (!url || url === '/images/sample.jpg') return 'https://placehold.co/100x100?text=No+Image';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  // Determine active states for timeline based on orderStatus
  const statusLevels = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentStatusIndex = statusLevels.indexOf(order.orderStatus);

  const getStepClass = (stepName: string) => {
    const stepIndex = statusLevels.indexOf(stepName);
    if (stepIndex < currentStatusIndex) return 'completed';
    if (stepIndex === currentStatusIndex) return 'active';
    return '';
  };

  return (
    <div className="admin-order-detail-container">
      {/* Header */}
      <div className="od-header">
        <div className="od-breadcrumb">
          <Link to="/admin/orders">Đơn hàng</Link> &gt; <span>#{order.id}</span>
        </div>
        <div className="od-title-row">
          <div className="od-title-left">
            <h2>Chi tiết đơn hàng</h2>
            <span className={`od-status-badge ${order.orderStatus.toLowerCase()}`}>
              {order.orderStatus === 'PENDING' ? 'Chờ xử lý' :
                order.orderStatus === 'PROCESSING' ? 'Đang xử lý' :
                  order.orderStatus === 'SHIPPED' ? 'Đang giao hàng' :
                    order.orderStatus === 'DELIVERED' ? 'Đã hoàn thành' :
                      order.orderStatus === 'CANCELLED' ? 'Đã hủy' : order.orderStatus}
            </span>
          </div>
          <div className="od-actions" style={{ position: 'relative' }}>
            <button
              className="od-btn-primary"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              disabled={updating}
            >
              {updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'} <FaChevronDown />
            </button>
            {showStatusMenu && (
              <div className="od-status-dropdown">
                <ul>
                  <li onClick={() => handleUpdateStatus('PROCESSING')}>Đang xử lý</li>
                  <li onClick={() => handleUpdateStatus('SHIPPED')}>Đang giao hàng</li>
                  <li onClick={() => handleUpdateStatus('DELIVERED')}>Đã giao hàng</li>
                  <li onClick={() => handleUpdateStatus('CANCELLED')}>Đã hủy</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="od-content">
        {/* Left Column */}
        <div className="od-left">
          {/* Progress Timeline */}
          <div className="od-card od-progress-card">
            <h3>Tiến độ đơn hàng</h3>
            <div className="od-timeline">
              <div className={`od-step ${getStepClass('PENDING')}`}>
                <div className="step-icon"><FaFileInvoice /></div>
                <div className="step-text">Đơn hàng đã đặt<br /><span>{formatDate(order.createdAt)}</span></div>
              </div>
              <div className={`od-step-connector ${getStepClass('PENDING')}`}></div>

              <div className={`od-step ${order.isPaid || order.paymentStatus === 'PAID' ? 'completed' : 'active'}`}>
                <div className="step-icon"><FaMoneyBill /></div>
                <div className="step-text">Xác nhận thanh toán</div>
              </div>
              <div className={`od-step-connector ${getStepClass('PROCESSING')}`}></div>

              <div className={`od-step ${getStepClass('PROCESSING')}`}>
                <div className="step-icon"><FaHourglassHalf /></div>
                <div className="step-text">Đang xử lý<br /><span>In Progress</span></div>
              </div>
              <div className={`od-step-connector ${getStepClass('SHIPPED')}`}></div>

              <div className={`od-step ${getStepClass('SHIPPED')}`}>
                <div className="step-icon"><FaTruck /></div>
                <div className="step-text">Đang giao hàng<br /><span>Pending</span></div>
              </div>
              <div className={`od-step-connector ${getStepClass('DELIVERED')}`}></div>

              <div className={`od-step ${getStepClass('DELIVERED')}`}>
                <div className="step-icon"><FaHome /></div>
                <div className="step-text">Đã giao hàng<br /><span>Pending</span></div>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="od-card">
            <div className="od-card-header">
              <h3>Danh sách sản phẩm</h3>
              <span className="od-item-count">{order.orderItems.length} Items</span>
            </div>
            <table className="od-product-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>SL</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <div className="od-product-info">
                        <img src={resolveImageUrl(item.image)} alt={item.name} />
                        <div>
                          <h4>{item.name}</h4>
                          <p>{item.product?.weight || '500g'}</p>
                        </div>
                      </div>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.qty}</td>
                    <td><strong>{formatPrice(item.price * item.qty)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="od-right">
          {/* Payment Details */}
          <div className="od-card od-payment-card">
            <h3>Chi tiết thanh toán</h3>
            <div className="od-payment-row">
              <span>Tạm tính</span>
              <span>{formatPrice(order.itemsPrice || 0)}</span>
            </div>
            <div className="od-payment-row">
              <span>Phí vận chuyển<br /><small>(Tiêu chuẩn)</small></span>
              <span>{formatPrice(order.shippingPrice || 0)}</span>
            </div>
            <div className="od-payment-total">
              <span>Tổng cộng</span>
              <span>{formatPrice(order.totalPrice || 0)}</span>
            </div>

            <div className="od-payment-method-box">
              <FaUniversity />
              <div>
                <strong>{order.paymentMethod || 'Chưa chọn'}</strong>
                <div>
                  {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  {order.paidAt && <><br />{formatDate(order.paidAt)}</>}
                </div>
              </div>
            </div>

            {order.amountReceived !== undefined && order.amountReceived > 0 && order.amountReceived !== order.totalPrice && (
              <div style={{
                marginTop: '15px', 
                padding: '10px', 
                backgroundColor: order.amountReceived < order.totalPrice ? '#fff3cd' : '#d1ecf1', 
                color: order.amountReceived < order.totalPrice ? '#856404' : '#0c5460', 
                borderRadius: '5px', 
                fontSize: '14px'
              }}>
                <strong>Lưu ý:</strong> Khách hàng chuyển {order.amountReceived < order.totalPrice ? 'thiếu' : 'thừa'} <strong>{formatPrice(Math.abs(order.amountReceived - order.totalPrice))}</strong>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="od-card">
            <h3>Khách hàng</h3>
            <div className="od-customer-box">
              <div className="od-customer-box-header">
                <div className="customer-avatar"><FaUser /></div>
                <div>{order.shippingAddress?.fullName || 'Khách vãng lai'}</div>
              </div>

              <div className="od-customer-details">
                {order.shippingAddress?.email && (
                  <div className="od-customer-details-row mb-8">
                    <FaEnvelope />
                    <span>{order.shippingAddress.email}</span>
                  </div>
                )}
                <div className="od-customer-details-row">
                  <FaPhone />
                  <span>{order.shippingAddress?.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>

            <h3 className="mt-4">Địa chỉ giao hàng</h3>
            <div className="od-address-box">
              {order.shippingAddress?.fullName}<br />
              {order.shippingAddress?.address}<br />
              {order.shippingAddress?.district}, {order.shippingAddress?.city}<br />
              Vietnam
            </div>
          </div>

          {!order.isPaid && (
            <button className="od-cancel-btn">Hủy đơn hàng</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
