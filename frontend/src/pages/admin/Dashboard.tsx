import { useEffect, useState, useMemo } from 'react';
import {
    XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { FaMoneyBillWave, FaShoppingBag, FaUsers, FaBoxOpen } from 'react-icons/fa';
import api from '../../services/api';

/* ── Types ── */
interface OrderItem {
    name: string;
    qty: number;
    price: number;
    product: string;
}

interface Order {
    _id: string;
    id: string;
    totalPrice: number;
    orderStatus: string;
    paymentStatus: string;
    isPaid: boolean;
    createdAt: string;
    shippingAddress: { fullName: string };
    orderItems: OrderItem[];
}

interface Product {
    _id: string;
    id: string;
    name: string;
    price: number;
    sold: number;
    countInStock: number;
}

interface User {
    _id: string;
    name: string;
}

/* ── Helpers ── */
const formatPrice = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value) + 'đ';


const getStatusLabel = (status: string) => {
    switch (status) {
        case 'PENDING': return 'Chờ xử lý';
        case 'PROCESSING': return 'Đang xử lý';
        case 'SHIPPED': return 'Đang giao';
        case 'DELIVERED': return 'Đã giao';
        case 'CANCELLED': return 'Đã hủy';
        default: return status;
    }
};

const getStatusType = (status: string) => {
    switch (status) {
        case 'PENDING': return 'pending';
        case 'PROCESSING': return 'processing';
        case 'SHIPPED': return 'processing';
        case 'DELIVERED': return 'delivered';
        case 'CANCELLED': return 'processing';
        default: return 'pending';
    }
};

const Dashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Month filter: default to current month (YYYY-MM)
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products'),
                    api.get('/users'),
                ]);
                setOrders(ordersRes.data);
                setProducts(productsRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    /* ── Filter orders by selected month ── */
    const monthFilteredOrders = useMemo(() => {
        if (!selectedMonth) return orders;
        return orders.filter(o => {
            const orderMonth = new Date(o.createdAt).toISOString().slice(0, 7);
            return orderMonth === selectedMonth;
        });
    }, [orders, selectedMonth]);

    /* ── Computed stats (based on filtered orders) ── */
    const totalRevenue = useMemo(() =>
        monthFilteredOrders
            .filter(o => o.isPaid || o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED')
            .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
        [monthFilteredOrders]);

    const pendingOrders = useMemo(() =>
        monthFilteredOrders.filter(o => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING').length,
        [monthFilteredOrders]);

    const lowStockProducts = useMemo(() =>
        products.filter(p => p.countInStock <= 10),
        [products]);

    /* ── Chart: revenue by week within the selected month ── */
    const chartData = useMemo(() => {
        const [year, month] = selectedMonth.split('-').map(Number);
        const daysInMonth = new Date(year, month, 0).getDate();
        const weeks: { name: string; revenue: number }[] = [];

        // Group days into weeks (1-7, 8-14, 15-21, 22-28, 29+)
        const weekRanges = [
            [1, 7], [8, 14], [15, 21], [22, 28], [29, daysInMonth]
        ];

        for (const [start, end] of weekRanges) {
            if (start > daysInMonth) break;
            const actualEnd = Math.min(end, daysInMonth);
            const weekRevenue = monthFilteredOrders
                .filter(o => {
                    const d = new Date(o.createdAt);
                    const day = d.getDate();
                    return day >= start && day <= actualEnd &&
                        (o.isPaid || o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED');
                })
                .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

            weeks.push({
                name: `Tuần ${weeks.length + 1}`,
                revenue: weekRevenue,
            });
        }
        return weeks;
    }, [monthFilteredOrders, selectedMonth]);

    const peakRevenue = useMemo(() => Math.max(...chartData.map(d => d.revenue), 0), [chartData]);

    /* ── Best sellers: top 4 products by sold (global, not filtered by month) ── */
    const bestSellers = useMemo(() =>
        [...products]
            .sort((a, b) => (b.sold || 0) - (a.sold || 0))
            .slice(0, 4)
            .map((p, idx) => ({
                id: idx + 1,
                name: p.name,
                revenue: formatPrice((p.sold || 0) * p.price),
                sold: p.sold || 0,
            })),
        [products]);

    /* ── Recent orders: last 4 within selected month ── */
    const recentOrders = useMemo(() =>
        [...monthFilteredOrders]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4)
            .map(o => ({
                id: `#${o.id}`,
                customer: o.shippingAddress?.fullName || 'Khách vãng lai',
                product: o.orderItems.map(i => `${i.name}${i.qty > 1 ? ` x${i.qty}` : ''}`).join(', '),
                total: formatPrice(o.totalPrice),
                status: getStatusLabel(o.orderStatus),
                statusType: getStatusType(o.orderStatus),
            })),
        [monthFilteredOrders]);

    /* ── Display month label ── */
    // const displayMonth = useMemo(() => {
    //     const [y, m] = selectedMonth.split('-').map(Number);
    //     return `Tháng ${m}, ${y}`;
    // }, [selectedMonth]);

    if (loading) {
        return <div style={{ textAlign: 'center', padding: 50 }}>Đang tải dữ liệu...</div>;
    }

    return (
        <div className="dash-wrapper">
            {/* Header */}
            <div className="dash-header">
                <div>
                    <h2 className="admin-page-title">Tổng Quan</h2>
                </div>
                <div className="dash-month-filter">
                    <input
                        type="month"
                        className="dash-month-input"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="dash-stats-grid">
                {/* Card 1 - Tổng Doanh Thu */}
                <div className="dash-card">
                    <div className="dash-card-top">
                        <span className="dash-card-label">TỔNG DOANH THU</span>
                        <div className="dash-card-icon gold">
                            <FaMoneyBillWave size={14} />
                        </div>
                    </div>
                    <div className="dash-card-value">
                        {new Intl.NumberFormat('vi-VN').format(totalRevenue)}<span className="dash-card-dong">đ</span>
                    </div>
                    <div className="dash-card-trend">
                        <span className="dash-trend-up">Tổng cộng</span>
                    </div>
                </div>

                {/* Card 2 - Đơn Hàng */}
                <div className="dash-card">
                    <div className="dash-card-top">
                        <span className="dash-card-label">ĐƠN HÀNG</span>
                        <div className="dash-card-icon gold">
                            <FaShoppingBag size={14} />
                        </div>
                    </div>
                    <div className="dash-card-value with-unit">
                        {orders.length.toLocaleString('vi-VN')} <span className="dash-card-unit">đơn</span>
                    </div>
                    <div className="dash-card-trend gap-6">
                        <span className="dash-trend-dot"></span>
                        <span className="dash-trend-text">{pendingOrders} đơn chờ xử lý</span>
                    </div>
                </div>

                {/* Card 3 - Khách Hàng */}
                <div className="dash-card">
                    <div className="dash-card-top">
                        <span className="dash-card-label">KHÁCH HÀNG</span>
                        <div className="dash-card-icon blue">
                            <FaUsers size={14} />
                        </div>
                    </div>
                    <div className="dash-card-value with-unit">
                        {users.length.toLocaleString('vi-VN')} <span className="dash-card-unit">người</span>
                    </div>
                    <div className="dash-card-trend">
                        <span className="dash-trend-up">Tổng đăng ký</span>
                    </div>
                </div>

                {/* Card 4 - Cảnh Báo Tồn Kho */}
                <div className="dash-card">
                    <div className="dash-card-top">
                        <span className="dash-card-label">CẢNH BÁO TỒN KHO</span>
                        <div className="dash-card-icon red">
                            <FaBoxOpen size={14} />
                        </div>
                    </div>
                    <div className="dash-card-value with-unit danger">
                        {lowStockProducts.length} <span className="dash-card-unit">sản phẩm</span>
                    </div>
                    <div className="dash-card-trend">
                        <span className="dash-trend-warn">⚠</span>
                        <span className="dash-trend-warn-text">Dưới định mức (≤ 10 hũ)</span>
                    </div>
                </div>
            </div>

            {/* Middle Section: Chart and Best Sellers */}
            <div className="dash-middle-grid">
                {/* Chart */}
                <div className="dash-card dash-chart-card">
                    <div className="dash-chart-header">
                        <div>
                            <h2 className="dash-section-title">Doanh thu tháng</h2>
                            <p className="dash-section-sub">Doanh thu theo từng tuần trong tháng</p>
                        </div>
                        <div>
                            <p className="dash-chart-peak-label">Đỉnh tháng</p>
                            <p className="dash-chart-peak-value">{formatPrice(peakRevenue)}</p>
                        </div>
                    </div>

                    <div className="dash-chart-body">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f9f3e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#fcfaf8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 13 }}
                                    dy={15}
                                />
                                <Tooltip
                                    formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value as number)}
                                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: 13, fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#D4A03C"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    dot={{ r: 5, fill: '#D4A03C', stroke: '#fff', strokeWidth: 2 }}
                                    activeDot={{ r: 7, fill: '#D4A03C', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Best Sellers */}
                <div className="dash-card dash-best-card">
                    <div className="dash-best-header">
                        <div>
                            <h2 className="dash-section-title">Sản phẩm Bán Chạy</h2>
                            <p className="dash-section-sub small">Xếp hạng theo sản lượng và doanh thu</p>
                        </div>
                        <span className="dash-best-badge">Top {products.length > 0 ? Math.min(4, products.length) : 0}</span>
                    </div>

                    <div className="dash-best-list">
                        {bestSellers.length > 0 ? bestSellers.map((product) => (
                            <div key={product.id} className="dash-best-item">
                                <div className="dash-best-row">
                                    <div className="dash-best-left">
                                        <div className="dash-best-rank">{product.id}</div>
                                        <div>
                                            <h3 className="dash-best-name">{product.name}</h3>
                                            <p className="dash-best-sold">{product.sold} hũ đã bán</p>
                                        </div>
                                    </div>
                                    <div className="dash-best-right">
                                        <p className="dash-best-revenue">{product.revenue}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p className="dash-section-sub">Chưa có dữ liệu sản phẩm</p>
                        )}
                    </div>

                    {/* Xem tất cả link */}
                    <div className="dash-viewall-footer">
                        <a href="/admin/products" className="dash-viewall-link">Xem tất cả ›</a>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="dash-card dash-orders-card">
                <div className="dash-orders-header">
                    <div>
                        <h2 className="dash-section-title">Đơn Hàng Gần Đây</h2>
                        <p className="dash-section-sub">Danh sách các giao dịch phát sinh gần nhất</p>
                    </div>
                    <a href="/admin/orders" className="dash-orders-link">
                        Xem tất cả đơn <span className="arrow">›</span>
                    </a>
                </div>

                <table className="dash-orders-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Sản phẩm</th>
                            <th className="text-right">Tổng tiền</th>
                            <th className="text-center">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                            <tr key={idx}>
                                <td className="order-id">{order.id}</td>
                                <td className="customer">{order.customer}</td>
                                <td className="product">{order.product}</td>
                                <td className="total">{order.total}</td>
                                <td className="status">
                                    <span className={`dash-status ${order.statusType}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: 20, color: '#999' }}>
                                    Chưa có đơn hàng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
