import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaTimes } from "react-icons/fa";
import { TfiSearch } from "react-icons/tfi";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../services/api';
import logoImg from '../../image/logo/613326243_4319054925046133_8782869459334492277_n.jpg';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: any[]; banners: any[]; totalProducts: number; totalBanners: number }>({
    products: [],
    banners: [],
    totalProducts: 0,
    totalBanners: 0,
  });
  const [isSearching, setIsSearching] = useState(false);

  const authContext = useContext(AuthContext) as any;
  const user = authContext?.user;
  const logout = authContext?.logout;
  const cartContext = useContext(CartContext) as any;
  const cartCount = cartContext?.cartItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
  const location = useLocation();
  const navigate = useNavigate();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

  // Close search when navigating
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults({ products: [], banners: [], totalProducts: 0, totalBanners: 0 });
  }, [location.pathname]);

  // Debounced search
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults({ products: [], banners: [], totalProducts: 0, totalBanners: 0 });
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const { data } = await api.get(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ products: [], banners: [], totalProducts: 0, totalBanners: 0 });
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Debounce search requests
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleOpenSearch = () => {
    setSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults({ products: [], banners: [], totalProducts: 0, totalBanners: 0 });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleCloseSearch();
    }
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      handleCloseSearch();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (img.startsWith('http')) return img;
      return `${API_BASE}${img}`;
    }
    return '/images/sample.jpg';
  };

  const getBannerImage = (banner: any) => {
    if (banner.image) {
      if (banner.image.startsWith('http')) return banner.image;
      return `${API_BASE}${banner.image}`;
    }
    return '/images/sample.jpg';
  };

  const hasResults = searchResults.products.length > 0 || searchResults.banners.length > 0;
  const showResults = searchQuery.trim().length > 0;

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
            <span className="logo-text">MẬT ONG NÚI ĐÁ ĐỒNG VĂN</span>
            <span className="logo-subtitle">Chất Lượng Vàng • Từ Thiên Nhiên</span>
          </div>
        </Link>

        <nav className={`header-nav ${mobileOpen ? 'mobile-open' : ''}`}>
          {/* Mobile Search Input */}
          <div className="mobile-menu-search md:hidden">
            <button className="mobile-menu-search-icon" onClick={() => {
              if (searchQuery.trim()) {
                navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                setMobileOpen(false);
                setSearchQuery('');
              }
            }}>
              <TfiSearch size={18} />
            </button>
            <input
              type="text"
              className="mobile-menu-search-input"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  setMobileOpen(false);
                  setSearchQuery('');
                }
              }}
            />
          </div>

          {/* Search Results in Mobile Menu */}
          {searchQuery && showResults && mobileOpen && (
            <div className="mobile-menu-search-results md:hidden">
              {isSearching ? (
                <div className="search-loading" style={{ padding: '10px' }}>
                  <div className="search-loading-spinner" />
                  <span>Đang tìm kiếm...</span>
                </div>
              ) : !hasResults ? (
                <div className="search-no-results" style={{ padding: '10px' }}>
                  <span>Không tìm thấy kết quả cho "{searchQuery}"</span>
                </div>
              ) : (
                <div className="mobile-search-results-list">
                  {searchResults.products.length > 0 && (
                    <div className="search-section">
                      <div className="search-section-header" style={{ padding: '5px 5px' }}>
                        <span className="search-section-title">Sản phẩm</span>
                        <Link
                          to={`/products?search=${encodeURIComponent(searchQuery)}`}
                          className="search-section-more"
                          onClick={() => setMobileOpen(false)}
                        >
                          Xem thêm({searchResults.totalProducts})
                        </Link>
                      </div>
                      <div className="search-section-list">
                        {searchResults.products.slice(0, 3).map((product) => (
                          <Link
                            key={product._id}
                            to={`/products/${product._id}`}
                            className="search-product-item"
                            onClick={() => setMobileOpen(false)}
                            style={{ padding: '8px 10px' }}
                          >
                            <div className="search-product-img" style={{ width: '40px', height: '40px' }}>
                              <img src={getProductImage(product)} alt={product.name} />
                            </div>
                            <div className="search-product-info">
                              <div className="search-product-name" style={{ fontSize: '0.85rem' }}>{product.name}</div>
                              <div className="search-product-price" style={{ fontSize: '0.8rem' }}>
                                {formatPrice(product.discountPrice || product.price)} ₫
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.banners.length > 0 && (
                    <div className="search-section">
                      <div className="search-section-header" style={{ padding: '8px 10px' }}>
                        <span className="search-section-title">Bài viết</span>
                        <span className="search-section-more">
                          Xem thêm({searchResults.totalBanners})
                        </span>
                      </div>
                      <div className="search-section-list">
                        {searchResults.banners.slice(0, 2).map((banner) => (
                          <Link
                            key={banner._id}
                            to={banner.link || '#'}
                            className="search-banner-item"
                            onClick={() => setMobileOpen(false)}
                            style={{ padding: '8px 10px' }}
                          >
                            <div className="search-banner-img" style={{ width: '40px', height: '40px' }}>
                              <img src={banner.image} alt={banner.title} />
                            </div>
                            <div className="search-banner-info">
                              <div className="search-banner-title" style={{ fontSize: '0.85rem' }}>{banner.title}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
          <button
            className="header-action-btn hidden md:flex"
            aria-label="Tìm kiếm"
            id="search-btn"
            onClick={handleOpenSearch}
          >
            <FaSearch size={20} />
          </button>
          <Link to="/cart" className="header-action-btn" aria-label="Giỏ hàng" id="cart-btn" style={{ textDecoration: 'none' }}>
            <FaShoppingCart size={20} />
            <span className="cart-badge">{cartCount}</span>
          </Link>
        </div>
      </div>

      {/* Desktop Search Overlay */}
      {searchOpen && (
        <div className="search-overlay" id="search-overlay">
          <div className="search-overlay-backdrop" onClick={handleCloseSearch} />
          <div className="search-overlay-container">
            {/* Search Input Bar */}
            <div className="search-input-bar">
              <button className="search-input-icon" onClick={() => {
                if (searchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  handleCloseSearch();
                }
              }}>
                <FaSearch size={18} />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
                id="search-input"
              />
              <button className="search-close-btn" onClick={handleCloseSearch} aria-label="Đóng">
                <FaTimes size={18} />
              </button>
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="search-results-dropdown" id="search-results">
                {isSearching ? (
                  <div className="search-loading">
                    <div className="search-loading-spinner" />
                    <span>Đang tìm kiếm...</span>
                  </div>
                ) : !hasResults ? (
                  <div className="search-no-results">
                    <span>Không tìm thấy kết quả cho "{searchQuery}"</span>
                  </div>
                ) : (
                  <>
                    {/* Products Section */}
                    {searchResults.products.length > 0 && (
                      <div className="search-section">
                        <div className="search-section-header">
                          <span className="search-section-title">Sản phẩm</span>
                          <Link
                            to={`/products?search=${encodeURIComponent(searchQuery)}`}
                            className="search-section-more"
                            onClick={handleCloseSearch}
                          >
                            Xem thêm({searchResults.totalProducts})
                          </Link>
                        </div>
                        <div className="search-section-list">
                          {searchResults.products.slice(0, 3).map((product) => (
                            <Link
                              key={product._id}
                              to={`/products/${product._id}`}
                              className="search-product-item"
                              onClick={handleCloseSearch}
                            >
                              <div className="search-product-img">
                                <img src={getProductImage(product)} alt={product.name} />
                              </div>
                              <div className="search-product-info">
                                <div className="search-product-name">{product.name}</div>
                                <div className="search-product-price">
                                  {formatPrice(product.discountPrice || product.price)} ₫
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Banners/Blog Section */}
                    {searchResults.banners.length > 0 && (
                      <div className="search-section">
                        <div className="search-section-header">
                          <span className="search-section-title">Bài viết</span>
                          <span className="search-section-more">
                            Xem thêm({searchResults.totalBanners})
                          </span>
                        </div>
                        <div className="search-section-list">
                          {searchResults.banners.slice(0, 2).map((banner) => (
                            <div key={banner._id} className="search-banner-item">
                              <div className="search-banner-img">
                                <img src={getBannerImage(banner)} alt={banner.title || ''} />
                              </div>
                              <div className="search-banner-info">
                                <div className="search-banner-title">{banner.title || 'Bài viết'}</div>
                                <div className="search-banner-desc">
                                  {banner.subtitle
                                    ? banner.subtitle.length > 60
                                      ? banner.subtitle.substring(0, 60) + '...'
                                      : banner.subtitle
                                    : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
