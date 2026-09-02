import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaChevronRight, FaMobileAlt, FaCopy, FaHourglassHalf } from 'react-icons/fa';

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const paymentCodeParam = searchParams.get('paymentCode');

  const cartContext = useContext(CartContext) as any;
  const authContext = useContext(AuthContext) as any;
  const { cartItems, totalPrice, clearCart } = cartContext;
  const { user } = authContext;

  // "Mua ngay" flow: use only the single product passed via navigation state
  const buyNowItem = (location.state as any)?.buyNowItem;
  const isBuyNow = !!buyNowItem;

  const checkoutItems = isBuyNow
    ? [{ product: buyNowItem.product, quantity: buyNowItem.quantity }]
    : cartItems;

  const checkoutTotal = isBuyNow
    ? buyNowItem.product.price * buyNowItem.quantity
    : totalPrice;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Đã copy!');
  };

  // Validation regex (same as RegisterPage)
  const NAME_REGEX = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^0\d{9}$/;

  const [paymentMethod, setPaymentMethod] = useState('SePay');
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [isProcessing, setIsProcessing] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    district: '',
  });

  useEffect(() => {
    // If we're logged in but don't have user info in form, initialize it
    if (user && !formData.fullName) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name,
        email: user.email,
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // Polling payment status
  useEffect(() => {
    let intervalId: any;

    const checkPaymentStatus = async (code: string) => {
      try {
        const res = await api.get(`/payments/${code}/status`);
        if (res.data?.success) {
          const newData = res.data.data;
          setPaymentInfo(newData);
          setPaymentStatus(newData.status);
        }
      } catch (err) {
        console.error("Error polling payment status", err);
      }
    };

    const codeToPoll = paymentCodeParam || paymentInfo?.paymentCode;

    if (codeToPoll && (paymentStatus === 'PENDING' || paymentStatus === 'PARTIALLY_PAID')) {
      // First check immediately if refreshed and no paymentInfo
      if (!paymentInfo && paymentCodeParam) {
        checkPaymentStatus(paymentCodeParam);
      }

      intervalId = setInterval(() => {
        checkPaymentStatus(codeToPoll);
      }, 3000); // Poll every 3 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [paymentCodeParam, paymentInfo?.paymentCode, paymentStatus]);

  // Navigate to success page when payment is successful
  useEffect(() => {
    if (paymentStatus === 'PAID' || paymentStatus === 'OVERPAID') {
      toast.success('Thanh toán thành công!');
      navigate('/order-success');
    }
  }, [paymentStatus, navigate]);

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch provinces
    fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
      .then(res => res.json())
      .then(res => {
        if (res.error === 0) {
          const formattedProvinces = res.data.map((p: any) => ({
            code: p.id,
            name: p.full_name
          }));
          setProvinces(formattedProvinces);
        }
      })
      .catch(err => console.error("Error fetching provinces:", err));
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    const provinceName = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, city: provinceName, district: '' });

    if (provinceCode) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${provinceCode}.htm`)
        .then(res => res.json())
        .then(res => {
          if (res.error === 0) {
            const formattedDistricts = res.data.map((d: any) => ({
              code: d.id,
              name: d.full_name
            }));
            setDistricts(formattedDistricts);
          }
        })
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

    if (checkoutItems.length === 0) {
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

    const orderItems = checkoutItems.map((item: any) => ({
      name: item.product.name,
      qty: item.quantity,
      image: item.product.images?.[0] || '',
      price: item.product.price,
      product: item.product._id
    }));

    const orderData = {
      orderItems,
      shippingAddress: formData,
      paymentMethod,
      itemsPrice: checkoutTotal,
      shippingPrice: 0,
      totalPrice: checkoutTotal
    };

    try {
      setIsProcessing(true);
      const res = await api.post('/orders', orderData);
      const createdOrder = res.data;

      if (paymentMethod === 'SePay') {
        try {
          const payRes = await api.post('/payments/create', { orderId: createdOrder._id });
          setPaymentInfo(payRes.data);
          // Thêm query string vào URL để f5 không bị mất
          window.history.pushState({}, '', `/checkout?paymentCode=${payRes.data.transferContent}`);
          if (!isBuyNow) clearCart();
          toast.success('Vui lòng quét mã QR để thanh toán');
        } catch (payErr: any) {
          console.error(payErr);
          toast.error(payErr.response?.data?.message || 'Lỗi tạo thanh toán SePay');
        }
      } else {
        toast.success('Đặt hàng thành công!');
        if (!isBuyNow) clearCart();
        navigate('/order-success');
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentInfo) {
    return (
      <div className="checkout-page-wrapper">
        <Header />
        <main className="checkout-payment-container">
          <div className="payment-receipt-card">

            <div className="payment-receipt-header">
              <h2 className="payment-receipt-title">THANH TOÁN ĐƠN HÀNG</h2>
              <p className="payment-receipt-subtitle">Mã đơn hàng: <strong>{paymentInfo.transferContent || 'DH12345678'}</strong></p>
            </div>

            <div className="payment-receipt-body">
              <div className="payment-qr-wrapper">
                <img src={paymentInfo.qrUrl} alt="QR Code" className="payment-qr-img" />
              </div>

              <div className="payment-scan-instruction">
                <FaMobileAlt /> Mở app ngân hàng và quét mã QR
              </div>

              <div className="payment-details-box">
                <div className="payment-detail-row payment-amount-row">
                  <span className="payment-detail-label">Số tiền</span>
                  <span className="payment-detail-value amount-highlight">{formatPrice(paymentInfo.amount)}</span>
                </div>

                <div className="payment-detail-row">
                  <span className="payment-detail-label">Ngân hàng</span>
                  <span className="payment-detail-value">{paymentInfo.bankCode}</span>
                </div>

                <div className="payment-detail-row">
                  <span className="payment-detail-label">Số TK</span>
                  <span className="payment-detail-value">
                    {paymentInfo.accountNumber} <button type="button" className="copy-btn" onClick={() => handleCopy(paymentInfo.accountNumber)}><FaCopy /></button>
                  </span>
                </div>

                <div className="payment-detail-row">
                  <span className="payment-detail-label">Chủ TK</span>
                  <span className="payment-detail-value">{paymentInfo.accountName}</span>
                </div>

                <div className="payment-detail-row">
                  <span className="payment-detail-label">Nội dung</span>
                  <span className="payment-detail-value">
                    <span className="payment-content-badge">{paymentInfo.transferContent}</span>
                    <button type="button" className="copy-btn" onClick={() => handleCopy(paymentInfo.transferContent)}><FaCopy /></button>
                  </span>
                </div>
              </div>

              <div className="payment-status-divider"></div>

              {paymentStatus === 'PARTIALLY_PAID' && (
                <div style={{ padding: '15px', backgroundColor: '#e20f0fff', color: '#000000ff', borderRadius: '8px', marginBottom: '15px', border: '1px solid #ffeeba', fontSize: '14px', textAlign: 'center' }}>
                  <strong>Cảnh báo:</strong> Hệ thống ghi nhận bạn đã chuyển thiếu <strong>{formatPrice(paymentInfo.amount - (paymentInfo.amountReceived || 0))}</strong>.<br />
                  Mã QR ở trên đã được tự động cập nhật với số tiền còn thiếu. Vui lòng quét lại để thanh toán nốt.
                </div>
              )}

              {paymentStatus === 'OVERPAID' && (
                <div style={{ padding: '15px', backgroundColor: '#cce5ff', color: '#004085', borderRadius: '8px', marginBottom: '15px', border: '1px solid #b8daff', fontSize: '14px', textAlign: 'center' }}>
                  <strong>Thanh toán dư:</strong> Đơn hàng đã được thanh toán thành công, tuy nhiên bạn đã chuyển dư <strong>{formatPrice((paymentInfo.amountReceived || 0) - paymentInfo.amount)}</strong>. Vui lòng liên hệ CSKH để được hoàn lại tiền thừa.
                </div>
              )}

              <div className="payment-status-text">
                <FaHourglassHalf /> {
                  paymentStatus === 'PENDING' ? 'Đang chờ thanh toán...' :
                    (paymentStatus === 'PAID' ? 'Thanh toán thành công' :
                      (paymentStatus === 'PARTIALLY_PAID' ? 'Chưa thanh toán đủ' :
                        (paymentStatus === 'OVERPAID' ? 'Thanh toán thành công (Chuyển dư)' : 'Giao dịch thất bại')))
                }
              </div>

              <div style={{ marginTop: '25px', textAlign: 'center' }}>
                <Link to="/order-success" className="checkout-payment-return-link" style={{ fontSize: '14px', textDecoration: 'underline' }}>Trở về trang chủ</Link>
              </div>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="checkout-page-wrapper">
      <Header />
      <main className="checkout-container">
        <form className="checkout-content" onSubmit={handleSubmit}>

          {/* LEFT COLUMN: FORM */}
          <div className="checkout-left">
            <div className="pdp-breadcrumb checkout-breadcrumb">
              <Link to="/cart">Giỏ hàng</Link>
              <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
              <span className="pdp-breadcrumb-current checkout-step-active">Thông tin vận chuyển</span>
              <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
              <span className="pdp-breadcrumb-current checkout-step-inactive">Phương thức thanh toán</span>
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

            <div className="checkout-form-group full-width checkout-payment-method-section">
              <h3 className="checkout-payment-method-title">Phương thức thanh toán</h3>
              <div className="checkout-payment-method-list">
                {/* <label className="checkout-payment-method-label">
                  <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="checkout-payment-method-radio" />
                  Thanh toán khi nhận hàng (COD)
                </label> */}
                <label className="checkout-payment-method-label">
                  <input type="radio" name="paymentMethod" value="SePay" checked={paymentMethod === 'SePay'} onChange={(e) => setPaymentMethod(e.target.value)} className="checkout-payment-method-radio" />
                  Chuyển khoản qua mã QR
                </label>
              </div>
            </div>

            <div className="checkout-actions checkout-actions-container">
              <Link to="/cart" className="checkout-back-link">&larr; Giỏ hàng</Link>
              <button type="submit" className="checkout-submit-btn" disabled={isProcessing}>
                {isProcessing ? 'Đang xử lý...' : (paymentMethod === 'SePay' ? 'Xác nhận & Chuyển khoản' : 'Hoàn tất đặt hàng')}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="checkout-right">
            <div className="checkout-summary-box">
              <div className="checkout-items">
                {checkoutItems.map((item: any) => (
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
                  <span>{formatPrice(checkoutTotal)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Phí ship</span>
                  <span className="checkout-free-shipping">Free</span>
                </div>
              </div>

              <div className="checkout-final-total">
                <span>Tổng tiền</span>
                <span className="final-price">
                  <span className="currency-code">VND</span> {formatPrice(checkoutTotal)}
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
