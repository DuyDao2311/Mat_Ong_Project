import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCardV2 from '../components/ProductCardV2';
import api from '../services/api';
import { FaLock } from 'react-icons/fa';

function CartPage() {
  const cartContext = useContext(CartContext) as any;
  const { cartItems, totalPrice, updateQuantity, removeFromCart } = cartContext;
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    // Fetch some recommended products
    const fetchRecommended = async () => {
      try {
        const { data } = await api.get('/products');
        setRecommendedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching recommended products", error);
      }
    };
    fetchRecommended();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const resolveImageUrl = (url: string) => {
    if (!url || url === '/images/sample.jpg') return 'https://placehold.co/100x100?text=No+Image';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  const totalQuantity = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  return (
    <div className="cart-page-wrapper">
      <Header />

      <main className="cart-main-container">
        <div className="cart-header-section">
          <h1 className="cart-title">Giỏ hàng của bạn</h1>
          <p className="cart-subtitle">{totalQuantity} sản phẩm trong giỏ hàng</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Giỏ hàng của bạn đang trống.</p>
            <Link to="/products" className="cart-continue-shopping">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map((item: any) => (
                <div className="cart-item" key={item.product._id}>
                  <Link to={`/products/${item.product._id}`} className="cart-item-img-link">
                    <img src={resolveImageUrl(item.product.images?.[0])} alt={item.product.name} className="cart-item-img" />
                  </Link>

                  <div className="cart-item-details">
                    <Link to={`/products/${item.product._id}`} className="cart-item-name-link">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                    </Link>
                    <p className="cart-item-weight">{item.product.weight || '500g'}</p>

                    <div className="cart-item-actions">
                      <div className="cart-quantity-control">
                        <button onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-price-delete">
                    <button className="cart-item-delete" onClick={() => removeFromCart(item.product._id)}>✕</button>
                    <div className="cart-item-price-group">
                      <span className="cart-item-price">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-box">
              <h2 className="summary-title">Tóm tắt đơn hàng</h2>

              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              {/* <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span className="summary-free-shipping">Miễn phí</span>
              </div> */}

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Tổng cộng</span>
                <div className="summary-total-price">
                  <span>{formatPrice(totalPrice)}</span>
                  {/* <span className="summary-vat">(Đã bao gồm VAT)</span> */}
                </div>
              </div>

              <Link to="/checkout" className="summary-checkout-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                Tiến hành thanh toán →
              </Link>

              <div className="summary-secure">
                <FaLock /> <span>Thanh toán an toàn 100%</span>
              </div>
            </div>
          </div>
        )}

        <section className="cart-recommended">
          <h2 className="recommended-title">Có thể bạn sẽ thích</h2>
          <div className="recommended-grid">
            {recommendedProducts.map((product: any) => (
              <ProductCardV2 key={product._id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CartPage;
