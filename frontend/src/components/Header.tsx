import { useState, useContext } from 'react';
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import logoImg from '../../image/logo/613326243_4319054925046133_8782869459334492277_n.jpg';

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const authContext = useContext(AuthContext) as any;
  const user = authContext?.user;
  const logout = authContext?.logout;
  const cartContext = useContext(CartContext) as any;
  const cartCount = cartContext?.cartItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const location = useLocation();

  return (
    <header className="header" id="header">
      <div className="header-inner">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          id="mobile-menu-btn"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
        <Link to="/" className="header-logo" style={{ textDecoration: 'none' }}>
          <span className="logo-icon"><img src={logoImg} alt="Mật Ong Núi Đá Logo" /></span>
          <div className="logo-text-wrap">
            <span className="logo-text">MẬT ONG NÚI ĐÁ</span>
            <span className="logo-subtitle">Chất Lượng Vàng • Từ Thiên Nhiên</span>
          </div>
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? "active" : ""}>HOME</Link>
          <a href="#">GIỚI THIỆU</a>
          <Link to="/products" className={location.pathname === '/products' ? "active" : ""}>
            SẢN PHẨM
          </Link>
          <a href="#">CHÍNH SÁCH</a>
          <a href="#">LIÊN HỆ</a>

          {/* Mobile Auth Links */}
          {/* Mobile Auth Links */}
          {user ? (
            <>
              <span className="md:hidden flex items-center justify-center gap-2" style={{ padding: '12px 16px', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--amber-700)' }}>
                <FaUser /> {user.name}
              </span>
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="md:hidden"
                style={{ padding: '12px 16px', fontSize: '0.82rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--red-600)' }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="md:hidden" onClick={() => setMobileOpen(false)}>Đăng nhập</Link>
              <Link to="/register" className="md:hidden" onClick={() => setMobileOpen(false)}>Đăng ký</Link>
            </>
          )}
        </nav>

        <div className="header-actions flex items-center">
          {user ? (
            <div className="flex items-center gap-4 mr-4 hidden md:flex">
              <span className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <FaUser /> {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 mr-4 hidden md:flex">
              <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors">Đăng nhập</Link>
              <Link to="/register" className="text-sm font-medium bg-amber-600 text-white px-4 py-1.5 rounded-full hover:bg-amber-700 transition-colors">Đăng ký</Link>
            </div>
          )}
          <button className="header-action-btn hidden md:flex" aria-label="Tìm kiếm" id="search-btn">
            <FaSearch size={20} />
          </button>
          <Link to="/cart" className="header-action-btn" aria-label="Giỏ hàng" id="cart-btn" style={{textDecoration: 'none'}}>
            <FaShoppingCart size={20} />
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
