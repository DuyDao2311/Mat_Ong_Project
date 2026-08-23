import { useEffect } from 'react';
import { Link, } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

function OrderSuccessPage() {


  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="order-success-wrapper">
      <main className="order-success-container">
        <div className="order-success-card">
          <div className="order-success-icon-wrapper">
            <div className="order-success-icon-halo">
              <div className="order-success-icon-inner">
                <div className="order-success-icon-white">
                  <FaCheck className="order-success-icon-check" />
                </div>
              </div>
            </div>
          </div>

          <h1 className="order-success-title">Đặt hàng thành công!</h1>

          <p className="order-success-message">
            Cám ơn bạn đã mua sắm tại cửa hàng của chúng tôi.
            <br />
            Đơn hàng của bạn đã được hệ thống ghi nhận và đang được xử lý.
          </p>

          <div className="order-success-actions">
            <Link to="/products" className="order-success-btn primary-btn">
              Tiếp tục mua sắm
            </Link>
            <Link to="/" className="order-success-btn secondary-btn">
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrderSuccessPage;
