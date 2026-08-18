import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaChevronRight } from 'react-icons/fa';

function CheckoutPage() {
  const navigate = useNavigate();
  const cartContext = useContext(CartContext) as any;
  const authContext = useContext(AuthContext) as any;
  const { cartItems, totalPrice, clearCart } = cartContext;
  const { user } = authContext;

  // Validation regex (same as RegisterPage)
  const NAME_REGEX = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^0\d{9}$/;

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    district: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch provinces
    fetch('https://provinces.open-api.vn/api/p/')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Error fetching provinces:", err));
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    const provinceName = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, city: provinceName, district: '' });

    if (provinceCode) {
      fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts))
        .catch(err => console.error("Error fetching districts:", err));
    } else {
      setDistricts([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: digits });
    if (fieldErrors.phone) {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  // Validate fields (same rules as RegisterPage)
  const validateFields = (): boolean => {
    const newErrors = { fullName: '', email: '', phone: '' };
    let isValid = true;

    const trimmedName = formData.fullName.trim();
    if (!trimmedName) {
      newErrors.fullName = 'Họ và tên là bắt buộc';
      isValid = false;
    } else if (trimmedName.length < 2 || trimmedName.length > 50) {
      newErrors.fullName = 'Họ và tên phải có từ 2 đến 50 ký tự';
      isValid = false;
    } else if (!NAME_REGEX.test(trimmedName)) {
      newErrors.fullName = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
      isValid = false;
    }

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Email không đúng định dạng';
      isValid = false;
    }

    const trimmedPhone = formData.phone.trim();
    if (!trimmedPhone) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
      isValid = false;
    } else if (!/^\d+$/.test(trimmedPhone)) {
      newErrors.phone = 'Số điện thoại không đúng định dạng';
      isValid = false;
    } else if (!PHONE_REGEX.test(trimmedPhone)) {
      newErrors.phone = 'Số điện thoại phải gồm 10 chữ số';
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const resolveImageUrl = (url: string) => {
    if (!url || url === '/images/sample.jpg') return 'https://placehold.co/100x100?text=No+Image';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    // Validate all fields
    if (!validateFields()) {
      return;
    }

    if (!formData.address || !formData.city || !formData.district) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    const orderItems = cartItems.map((item: any) => ({
      name: item.product.name,
      qty: item.quantity,
      image: item.product.images?.[0] || '',
      price: item.product.price,
      product: item.product._id
    }));

    const orderData = {
      orderItems,
      shippingAddress: formData,
      paymentMethod: 'COD',
      itemsPrice: totalPrice,
      shippingPrice: 0,
      totalPrice: totalPrice
    };

    try {
      await api.post('/orders', orderData);
      toast.success('Đặt hàng thành công!');
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra khi đặt hàng');
    }
  };

  return (
    <div className="checkout-page-wrapper">
      <Header />
      <main className="checkout-container">
        <form className="checkout-content" onSubmit={handleSubmit}>

          {/* LEFT COLUMN: FORM */}
          <div className="checkout-left">
            <div className="pdp-breadcrumb" style={{ padding: 0, marginBottom: '20px' }}>
              <Link to="/cart">Giỏ hàng</Link>
              <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
              <span className="pdp-breadcrumb-current" style={{ color: '--orange-light', fontWeight: 500 }}>Thông tin vận chuyển</span>
              <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
              <span className="pdp-breadcrumb-current" style={{ color: 'var(--dark-light)', fontWeight: 400 }}>Phương thức thanh toán</span>
            </div>

            <h1 className="checkout-title">Thông tin thanh toán</h1>

            {!user && (
              <p className="checkout-login-prompt">
                Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
              </p>
            )}

            <div className="checkout-form-group full-width">
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`checkout-input${fieldErrors.fullName ? ' input-error' : ''}`}
              />
              {fieldErrors.fullName && <p className="field-error-text">{fieldErrors.fullName}</p>}
            </div>

            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`checkout-input${fieldErrors.email ? ' input-error' : ''}`}
                />
                {fieldErrors.email && <p className="field-error-text">{fieldErrors.email}</p>}
              </div>
              <div className="checkout-form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Điện thoại"
                  value={formData.phone}
                  maxLength={10}
                  onChange={handlePhoneChange}
                  className={`checkout-input${fieldErrors.phone ? ' input-error' : ''}`}
                />
                {fieldErrors.phone && <p className="field-error-text">{fieldErrors.phone}</p>}
              </div>
            </div>

            <div className="checkout-form-group full-width">
              <input
                type="text"
                name="address"
                placeholder="Địa chỉ"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="checkout-input"
              />
            </div>

            <div className="checkout-form-row">
              <div className="checkout-form-group">
                <label className="checkout-select-label">TỈNH</label>
                <select className="checkout-select" onChange={handleProvinceChange} required>
                  <option value="">Chọn tỉnh thành</option>
                  {provinces.map(p => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="checkout-form-group">
                <label className="checkout-select-label">QUẬN/HUYỆN</label>
                <select
                  className="checkout-select"
                  name="district"
                  onChange={(e) => {
                    const distName = e.target.options[e.target.selectedIndex].text;
                    setFormData({ ...formData, district: distName });
                  }}
                  required
                >
                  <option value="">Chọn Quận/Huyện</option>
                  {districts.map(d => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="checkout-actions">
              <Link to="/cart" className="checkout-back-link">&larr; Giỏ hàng</Link>
              <button type="submit" className="checkout-submit-btn">Phương thức thanh toán</button>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="checkout-right">
            <div className="checkout-summary-box">
              <div className="checkout-items">
                {cartItems.map((item: any) => (
                  <div key={item.product._id} className="checkout-item">
                    <div className="checkout-item-img-container">
                      <img src={resolveImageUrl(item.product.images?.[0])} alt={item.product.name} />
                      <span className="checkout-item-qty">{item.quantity}</span>
                    </div>
                    <div className="checkout-item-info">
                      <h4>{item.product.name}</h4>
                      <p>{item.product.weight || '500g'}</p>
                    </div>
                    <div className="checkout-item-price">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-discount">
                <input type="text" placeholder="Mã giảm giá" className="checkout-discount-input" />
                <button type="button" className="checkout-discount-btn" onClick={() => toast.info('Tính năng đang phát triển')}>Sử dụng</button>
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Phí ship</span>
                  <span>—</span>
                </div>
              </div>

              <div className="checkout-final-total">
                <span>Tổng tiền</span>
                <span className="final-price">
                  <span className="currency-code">VND</span> {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>

        </form>
      </main>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
