import { useContext } from 'react';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaThLarge, FaUsers, FaSignOutAlt, FaShoppingBag, FaCubes, FaClipboardList } from 'react-icons/fa';
import { FaImage } from "react-icons/fa6";
import '../pages/admin/Admin.css';

const AdminLayout = () => {
    const { logout } = useContext(AuthContext) as any;
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <div className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <Link to="/admin/dashboard" className="admin-sidebar-logo">MẬT ONG</Link>
                </div>
                <nav className="admin-nav">
                    <Link to="/admin/dashboard" className={`admin-nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                        <span className="admin-icon-box"><FaThLarge className="admin-nav-icon" /></span> <span className="admin-nav-text">Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className={`admin-nav-item ${isActive('/admin/products') ? 'active' : ''}`}>
                        <span className="admin-icon-box"><FaShoppingBag className="admin-nav-icon" /></span> <span className="admin-nav-text">Sản phẩm</span>
                    </Link>
                    <Link to="/admin/categories" className={`admin-nav-item ${isActive('/admin/categories') ? 'active' : ''}`}>
                        <span className="admin-icon-box"><FaCubes className="admin-nav-icon" /></span> <span className="admin-nav-text">Danh mục</span>
                    </Link>
                    <Link to="/admin/banners" className={`admin-nav-item ${isActive('/admin/banners') ? 'active' : ''}`}>
                        <span className="admin-icon-box"><FaImage className="admin-nav-icon" /></span> <span className="admin-nav-text">Banners</span>
                    </Link>
                    <Link to="/admin/orders" className={`admin-nav-item ${isActive('/admin/orders') ? 'active' : ''}`}>
                        <span className="admin-icon-box"><FaClipboardList className="admin-nav-icon" /></span> <span className="admin-nav-text">Đơn hàng</span>
                    </Link>
                    <Link to="/admin/users" className={`admin-nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
                        <span className="admin-icon-box"><FaUsers className="admin-nav-icon" /></span> <span className="admin-nav-text">Người dùng</span>
                    </Link>
                </nav>
                <div className="admin-sidebar-footer">
                    <button
                        onClick={handleLogout}
                        className="admin-btn-logout"
                    >
                        <span className="admin-icon-box logout"><FaSignOutAlt className="admin-nav-icon" /></span> <span className="admin-nav-text">Đăng xuất</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                {/* <header className="admin-header">
                    <h2 className="admin-header-title">QUẢN TRỊ HỆ THỐNG</h2>
                </header> */}
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
