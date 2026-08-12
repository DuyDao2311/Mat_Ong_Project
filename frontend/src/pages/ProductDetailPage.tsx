import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaCheck, FaChevronRight } from 'react-icons/fa';
import { BsDroplet, BsFlower1 } from 'react-icons/bs';
import { IoCartOutline } from "react-icons/io5";
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCardV2 from '../components/ProductCardV2';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState('500g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const cartContext = useContext(CartContext) as any;

  const handleAddToCart = () => {
    if (cartContext?.addToCart) {
      cartContext.addToCart(product, quantity);
    }
  };

  const resolveImageUrl = (url: string) => {
    if (!url || url === '/images/sample.jpg') return 'https://placehold.co/600x600?text=No+Image';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setActiveImageIndex(0);

        // Set default weight from product data
        if (data.weight) {
          setSelectedWeight(data.weight);
        }

        // Fetch related products
        try {
          const { data: related } = await api.get(`/products/${id}/related`);
          setRelatedProducts(related);
        } catch {
          // If related endpoint fails, fetch all and filter
          const { data: allProducts } = await api.get('/products');
          const filtered = allProducts
            .filter((p: any) => p._id !== data._id && p.category === data.category)
            .slice(0, 4);
          setRelatedProducts(filtered);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="pdp-star filled" />);
    }
    if (hasHalf) {
      stars.push(<FaStarHalfAlt key="half" className="pdp-star filled" />);
    }
    const remaining = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < remaining; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="pdp-star" />);
    }
    return stars;
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const weightOptions = product?.weight ? [product.weight] : ['500ml'];

  if (loading) {
    return (
      <div className="pdp-container">
        <Header />
        <div className="pdp-loading">
          <div className="pdp-loading-spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-container">
        <Header />
        <div className="pdp-not-found">
          <h2>Không tìm thấy sản phẩm</h2>
          <Link to="/products" className="pdp-back-link">← Quay lại trang sản phẩm</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://placehold.co/600x600?text=No+Image'];

  return (
    <div className="pdp-container">
      <Header />

      {/* Breadcrumb */}
      <div className="pdp-breadcrumb-wrapper">
        <div className="pdp-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
          <Link to="/products">Sản phẩm</Link>
          <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
          <span className="pdp-breadcrumb-current">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <section className="pdp-main">
        <div className="pdp-main-inner">
          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-gallery-main">
              {product.origin && (
                <span className="pdp-origin-badge">{product.origin}</span>
              )}
              <img
                src={resolveImageUrl(images[activeImageIndex])}
                alt={product.name}
                className="pdp-gallery-main-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=No+Image';
                }}
              />
            </div>
            <div className="pdp-gallery-thumbs">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  className={`pdp-thumb ${index === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt={`${product.name} - ${index + 1}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image';
                    }}
                  />
                </button>
              ))}
              {images.length > 4 && (
                <button className="pdp-thumb-more">
                  <span>+{images.length - 4}</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="pdp-info">
            <h1 className="pdp-name">{product.name}</h1>

            <div className="pdp-rating-row">
              <div className="pdp-stars">
                {renderStars(product.rating || 4.5)}
              </div>
              <span className="pdp-review-count">({product.numReviews || 158} đánh giá)</span>
            </div>

            <div className="pdp-price">{formatPrice(product.price)}</div>

            <p className="pdp-short-desc">
              {product.description || 'Được thu hoạch từ những cánh rừng hoang sơ tại New Zealand, sản phẩm mật ong tự nhiên mang đến hương vị thuần khiết và giá trị dinh dưỡng cao.'}
            </p>

            {/* Weight Selector */}
            <div className="pdp-option-group">
              <label className="pdp-option-label">DUNG TÍCH</label>
              <div className="pdp-weight-options">
                {weightOptions.map(w => (
                  <button
                    key={w}
                    className={`pdp-weight-btn ${selectedWeight === w ? 'active' : ''}`}
                    onClick={() => setSelectedWeight(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart Row */}
            <div className="pdp-option-group">
              <label className="pdp-option-label">SỐ LƯỢNG</label>
              <div className="pdp-action-row">
                <div className="pdp-quantity-selector">
                  <button className="pdp-qty-btn" onClick={() => handleQuantityChange(-1)}>−</button>
                  <input
                    type="number"
                    className="pdp-qty-input"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button className="pdp-qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
                </div>

                {/* Add to Cart Button */}
                <button className="pdp-add-cart-btn" id="pdp-add-to-cart" onClick={handleAddToCart}>
                  THÊM VÀO GIỎ HÀNG <IoCartOutline className="pdp-cart-icon" />
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="pdp-features">
              <div className="pdp-feature-item">
                <div className="pdp-feature-icon">
                  <BsDroplet size={20} />
                </div>
                <div className="pdp-feature-text">
                  <span className="pdp-feature-title">KẾT CẤU</span>
                  <span className="pdp-feature-subtitle">Đặc sánh, mịn màng</span>
                </div>
              </div>
              <div className="pdp-feature-item">
                <div className="pdp-feature-icon">
                  <BsFlower1 size={20} />
                </div>
                <div className="pdp-feature-text">
                  <span className="pdp-feature-title">HƯƠNG VỊ</span>
                  <span className="pdp-feature-subtitle">Êm tím, hậu vị thanh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="pdp-tabs-section">
        <div className="pdp-tabs-inner">
          <div className="pdp-tabs-header">
            <button
              className={`pdp-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`pdp-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Thông số kỹ thuật
            </button>
            <button
              className={`pdp-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá <span className="pdp-tab-badge">{product.numReviews || 158}</span>
            </button>
          </div>

          <div className="pdp-tab-content">
            {activeTab === 'description' && (
              <div className="pdp-tab-description">
                <div className="pdp-desc-text">
                  <h2 className="pdp-desc-heading">Tinh hoa từ {product.origin || 'thiên nhiên'}</h2>
                  <p className="pdp-desc-paragraph">
                    {product.description || 'Mật ong của chúng tôi được thu hoạch thủ công từ những tổ ong đặt tại các khu rừng hoang dã, biệt lập. Quy trình khai thác bền vững với hệ sinh thái tự nhiên, đảm bảo từng giọt mật giữ trọn vẹn sự tinh khiết và hương vị nguyên bản.'}
                  </p>

                  <h3 className="pdp-desc-subheading">Sức mạnh của tự nhiên</h3>
                  <p className="pdp-desc-paragraph">
                    Sản phẩm là hợp chất tự nhiên tạo nên tính kháng khuẩn đặc biệt. Với chất lượng cao, sản phẩm mang đến giá trị dinh dưỡng vượt trội, hỗ trợ sức khỏe toàn diện cho người sử dụng.
                  </p>

                  <ul className="pdp-desc-benefits">
                    <li><FaCheck className="pdp-benefit-icon" /> Hỗ trợ tăng cường sức đề kháng</li>
                    <li><FaCheck className="pdp-benefit-icon" /> Làm dịu đau dạ dày và hỗ trợ tiêu hóa</li>
                    <li><FaCheck className="pdp-benefit-icon" /> Chăm sóc da tự nhiên</li>
                    <li><FaCheck className="pdp-benefit-icon" /> Nguồn năng lượng tự nhiên cho cơ thể</li>
                  </ul>
                </div>
                <div className="pdp-desc-image-card">
                  <div className="pdp-desc-card-inner">
                    <div className="pdp-desc-card-icon">
                      <BsFlower1 size={28} />
                    </div>
                    <h4>Thu hoạch thủ công</h4>
                    <p>Bảo vệ đàn ong và giữ nguyên giá trị dinh dưỡng trong từng giọt mật ong thiên nhiên.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="pdp-tab-specs">
                <table className="pdp-specs-table">
                  <tbody>
                    <tr>
                      <td className="pdp-spec-label">Tên sản phẩm</td>
                      <td className="pdp-spec-value">{product.name}</td>
                    </tr>
                    <tr>
                      <td className="pdp-spec-label">Xuất xứ</td>
                      <td className="pdp-spec-value">{product.origin || 'Việt Nam'}</td>
                    </tr>
                    <tr>
                      <td className="pdp-spec-label">Dung tích</td>
                      <td className="pdp-spec-value">{product.weight || '500ml'}</td>
                    </tr>
                    <tr>
                      <td className="pdp-spec-label">Danh mục</td>
                      <td className="pdp-spec-value">{product.category}</td>
                    </tr>
                    <tr>
                      <td className="pdp-spec-label">Hạn sử dụng</td>
                      <td className="pdp-spec-value">24 tháng kể từ ngày sản xuất</td>
                    </tr>
                    <tr>
                      <td className="pdp-spec-label">Bảo quản</td>
                      <td className="pdp-spec-value">Nơi khô ráo, thoáng mát, tránh ánh nắng trực tiếp</td>
                    </tr>
                    <tr>
                      <td className="pdp-spec-label">Tình trạng</td>
                      <td className="pdp-spec-value">
                        {product.countInStock > 0 ? (
                          <span className="pdp-in-stock">Còn hàng ({product.countInStock})</span>
                        ) : (
                          <span className="pdp-out-stock">Hết hàng</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pdp-tab-reviews">
                <div className="pdp-reviews-summary">
                  <div className="pdp-reviews-big-score">
                    <span className="pdp-big-number">{product.rating || 4.5}</span>
                    <span className="pdp-big-label">trên 5</span>
                  </div>
                  <div className="pdp-reviews-stars-summary">
                    {renderStars(product.rating || 4.5)}
                    <span className="pdp-total-reviews">{product.numReviews || 158} đánh giá</span>
                  </div>
                </div>
                <div className="pdp-reviews-empty">
                  <p>Chưa có đánh giá chi tiết nào cho sản phẩm này.</p>
                  <button className="pdp-write-review-btn">Viết đánh giá đầu tiên</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related-section">
          <div className="pdp-related-inner">
            <div className="pdp-related-header">
              <div>
                <h2 className="pdp-related-title">Sản phẩm liên quan</h2>
                <p className="pdp-related-subtitle">Khám phá thêm bộ sưu tập mật ong tinh khiết của chúng tôi.</p>
              </div>
              <Link to="/products" className="pdp-view-all-link">Xem tất cả →</Link>
            </div>
            <div className="pdp-related-grid">
              {relatedProducts.map((rp: any) => (
                <ProductCardV2 key={rp._id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default ProductDetailPage;
