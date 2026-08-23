import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaFileInvoice, FaClipboardList, FaRegCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';
import './OrderList.css';

interface Order {
  _id: string;
  id: string;
  createdAt: string;
  totalPrice: number;
  orderStatus: string;
  paymentStatus: string;
  isPaid: boolean;
  shippingAddress: {
    fullName: string;
  };
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statsMonth, setStatsMonth] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }); // YYYY-MM

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn huỷ đơn hàng này?')) {
      try {
        await api.put(`/orders/${id}/status`, { status: 'CANCELLED' });
        toast.success('Đã huỷ đơn hàng');
        fetchOrders();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi khi huỷ đơn hàng');
      }
    }
  };

  const handleCompleteOrder = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Xác nhận hoàn thành đơn hàng này?')) {
      try {
        await api.put(`/orders/${id}/status`, { status: 'DELIVERED' });
        toast.success('Đã cập nhật trạng thái hoàn thành');
        fetchOrders();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
      }
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'KH';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  const getStatusDisplay = (order: Order) => {
    if (order.orderStatus === 'CANCELLED') {
      return { text: 'Đã hủy', className: 'status-cancelled' };
    }
    if (order.orderStatus === 'DELIVERED') {
      return { text: 'Đã giao hàng', className: 'status-completed' };
    }
    if (order.orderStatus === 'SHIPPED') {
      return { text: 'Đang giao hàng', className: 'status-shipping' };
    }
    // Đối với đơn hàng PENDING / PROCESSING
    if (order.paymentStatus === 'PARTIALLY_PAID') {
      return { text: 'Thanh toán thiếu', className: 'status-partial' };
    }
    if (order.paymentStatus === 'OVERPAID') {
      return { text: 'Thanh toán dư', className: 'status-overpaid' };
    }
    if (order.isPaid || order.paymentStatus === 'PAID') {
      // Dùng màu vàng của status-completed hoặc tạo một CSS class mới
      return { text: 'Đã thanh toán', className: 'status-completed' };
    }
    return { text: 'Chờ xử lý', className: 'status-pending' };
  };

  // Filter by month for stats and list base
  const monthFilteredOrders = React.useMemo(() => {
    if (!statsMonth) return orders;
    return orders.filter(order => {
      const orderMonth = new Date(order.createdAt).toISOString().slice(0, 7);
      return orderMonth === statsMonth;
    });
  }, [orders, statsMonth]);

  // Filtering logic
  const handleFilter = (baseOrders = monthFilteredOrders) => {
    let result = baseOrders;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toLowerCase().includes(lowerSearch) ||
        (order.shippingAddress?.fullName && order.shippingAddress.fullName.toLowerCase().includes(lowerSearch))
      );
    }

    if (statusFilter) {
      if (statusFilter === 'PAYMENT_PARTIAL') {
        result = result.filter(order => order.paymentStatus === 'PARTIALLY_PAID');
      } else if (statusFilter === 'PAYMENT_OVER') {
        result = result.filter(order => order.paymentStatus === 'OVERPAID');
      } else {
        result = result.filter(order => order.orderStatus === statusFilter);
      }
    }

    if (dateFilter) {
      // dateFilter format YYYY-MM-DD
      result = result.filter(order => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate === dateFilter;
      });
    }

    setFilteredOrders(result);
    setCurrentPage(1);
  };

  React.useEffect(() => {
    handleFilter(monthFilteredOrders);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthFilteredOrders]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="admin-order-list-container">
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Header */}
          <div className="admin-page-header order-list-header">
            <h2 className="admin-page-title">Quản lý Đơn Hàng</h2>
            <div className="admin-month-filter">
              {/* <label className="admin-month-filter-label">Thống kê theo tháng:</label> */}
              <input
                type="month"
                className="filter-input month-filter-input"
                value={statsMonth}
                onChange={(e) => setStatsMonth(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Section */}
          <div className="admin-order-stats">
            {/* Card 1: Tổng đơn */}
            <div className="stat-card">
              <div className="stat-card-info">
                <span className="stat-label">TỔNG ĐƠN HÀNG</span>
                <h3 className="stat-value">{monthFilteredOrders.length.toLocaleString('vi-VN')}</h3>
                <div className="stat-badge success">
                  {/* <span><FaArrowUp /> +12%</span>
                  <small>so với tháng trước</small> */}
                </div>
              </div>
              <div className="stat-icon icon-yellow"><FaFileInvoice /></div>
            </div>

            {/* Card 2: Đã huỷ */}
            <div className="stat-card">
              <div className="stat-card-info">
                <span className="stat-label">ĐÃ HUỶ</span>
                <h3 className="stat-value">{monthFilteredOrders.filter(o => o.orderStatus === 'CANCELLED').length.toLocaleString('vi-VN')}</h3>
                <div className="stat-badge warning">
                  <span>! Cần chú ý</span>
                </div>
              </div>
              <div className="stat-icon icon-orange"><FaClipboardList /></div>
            </div>

            {/* Card 3: Đã hoàn thành */}
            <div className="stat-card">
              <div className="stat-card-info">
                <span className="stat-label">ĐÃ HOÀN THÀNH</span>
                <h3 className="stat-value">{monthFilteredOrders.filter(o => o.orderStatus === 'DELIVERED').length.toLocaleString('vi-VN')}</h3>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: `${monthFilteredOrders.length > 0 ? (monthFilteredOrders.filter(o => o.orderStatus === 'DELIVERED').length / monthFilteredOrders.length) * 100 : 0}%` }}></div>
                </div>
              </div>
              <div className="stat-icon icon-blue"><FaRegCheckCircle /></div>
            </div>

            {/* Card 4: Doanh thu */}
            <div className="stat-card">
              <div className="stat-card-info">
                <span className="stat-label">DOANH THU</span>
                <h3 className="stat-value">{(monthFilteredOrders.reduce((sum, o) => o.isPaid || o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED' ? sum + (o.totalPrice || 0) : sum, 0)).toLocaleString('vi-VN')} ₫</h3>
                <div className="stat-badge info">
                  {/* <span><FaArrowUp /> +8.4%</span>
                  <small>Tháng này</small> */}
                </div>
              </div>
              <div className="stat-icon icon-green"><FaMoneyBillWave /></div>
            </div>
          </div>

          <div className="admin-order-filter-section">
            <div className="filter-group">
              <label>Tìm kiếm</label>
              <div className="filter-input-wrapper">
                <FaSearch className="filter-icon" />
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Mã đơn hàng, Tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Trạng thái</label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="PROCESSING">Đang xử lý</option>
                <option value="SHIPPED">Đang giao hàng</option>
                <option value="DELIVERED">Đã giao hàng</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="PAYMENT_PARTIAL">Thanh toán thiếu</option>
                <option value="PAYMENT_OVER">Thanh toán dư</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Thời gian</label>
              <div className="filter-input-wrapper">
                <FaCalendarAlt className="filter-icon" />
                <input
                  type="date"
                  className="filter-input"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            <button className="filter-btn" onClick={() => handleFilter()}>
              <FaFilter /> Lọc
            </button>
          </div>

          <div className="admin-order-table-wrapper">
            <table className="admin-order-table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>Ngày Đặt</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order) => {
                  const statusInfo = getStatusDisplay(order);
                  const customerName = order.shippingAddress?.fullName || 'Khách vãng lai';
                  return (
                    <tr key={order._id} onClick={() => navigate(`/admin/orders/${order._id}`)} style={{ cursor: 'pointer' }} className="admin-order-row-clickable">
                      <td className="col-id">#{order.id}</td>
                      <td className="col-customer">
                        <div className="customer-info">
                          <div className="avatar-circle">{getInitials(customerName)}</div>
                          <span className="customer-name">{customerName}</span>
                        </div>
                      </td>
                      <td className="col-date">{formatDate(order.createdAt)}</td>
                      <td className="col-price">{formatPrice(order.totalPrice)}</td>
                      <td className="col-status">
                        <span className={`status-badge ${statusInfo.className}`}>
                          <span className="status-dot"></span>
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="col-action">
                        {order.orderStatus === 'PENDING' && !order.isPaid && order.paymentStatus !== 'PAID' && (
                          <button
                            className="action-btn cancel-btn"
                            onClick={(e) => handleCancelOrder(e, order._id)}
                          >
                            Huỷ
                          </button>
                        )}
                        {order.orderStatus === 'SHIPPED' && (
                          <button
                            className="action-btn complete-btn"
                            onClick={(e) => handleCompleteOrder(e, order._id)}
                          >
                            Hoàn thành
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination-container">
            <div className="pagination-info">
              Hiển thị {filteredOrders.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, filteredOrders.length)} trên {filteredOrders.length} đơn hàng
            </div>
            <div className="pagination-controls">
              <button
                className="page-btn prev-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                // Show a limited number of pages (e.g. first 3, then ellipsis if many)
                // For simplicity, showing all or a simple subset.
                if (totalPages > 5 && page > 3 && page !== totalPages) {
                  if (page === 4) return <span key={page} className="page-ellipsis">...</span>;
                  return null;
                }
                return (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                className="page-btn next-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;
