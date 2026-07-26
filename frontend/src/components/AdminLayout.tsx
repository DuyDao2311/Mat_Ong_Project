import { useContext } from 'react';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTachometerAlt, FaUsers, FaSignOutAlt, FaBox, FaTags } from 'react-icons/fa';

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
                        <FaTachometerAlt className="admin-nav-icon" /> Dashboard
                    </Link>
                    <Link to="/admin/products" className={`admin-nav-item ${isActive('/admin/products') ? 'active' : ''}`}>
                        <FaBox className="admin-nav-icon" /> Sản phẩm
                    </Link>
                    <Link to="/admin/categories" className={`admin-nav-item ${isActive('/admin/categories') ? 'active' : ''}`}>
                        <FaTags className="admin-nav-icon" /> Danh mục
                    </Link>
                    <Link to="/admin/users" className={`admin-nav-item ${isActive('/admin/users') ? 'active' : ''}`}>
                        <FaUsers className="admin-nav-icon" /> Người dùng
                    </Link>
                </nav>
                <div className="admin-sidebar-footer">
                    <button
                        onClick={handleLogout}
                        className="admin-btn-logout"
                    >
                        <FaSignOutAlt className="mr-2" /> Đăng xuất
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <h2 className="admin-header-title">QUẢN TRỊ HỆ THỐNG</h2>
                </header>
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
