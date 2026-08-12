import { FaHeart } from 'react-icons/fa';
import { BsDroplet, BsStars } from 'react-icons/bs';
import { MdAddShoppingCart } from "react-icons/md";
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function ProductCardV2({ product }: { product: any }) {
  const cartContext = useContext(CartContext) as any;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartContext?.addToCart) {
      cartContext.addToCart(product, 1);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  // Tạm thời lấy tag từ origin hoặc tạo tag giả định
  // let tag = product.origin === 'EU' ? 'EU' : 'VN';
  // if (product.name?.toLowerCase().includes('manuka')) tag = 'BEST SELLER';

  // Lấy 1 icon dựa vào category hoặc tên
  const renderDescIcon = () => {
    if (product.category?.toLowerCase().includes('sáp')) return <BsStars size={12} />;
    return <BsDroplet size={12} />;
  };

  // Cắt bớt description làm mô tả ngắn
  const shortDesc = product.description
    ? (product.description.length > 30 ? product.description.substring(0, 30) + '...' : product.description)
    : 'Lỏng & Trong trẻo';

  const resolveImageUrl = (url: string) => {
    if (!url || url === '/images/sample.jpg') return 'https://placehold.co/400x400?text=No+Image';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  const imageUrl = resolveImageUrl(product.images && product.images.length > 0 ? product.images[0] : '');
  return (
    <Link to={`/products/${product._id}`} className="product-card-v2-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
      <div className="product-card-v2">
        <div className="pcv2-image-area">
          {/* {tag && (
          <span className={`pcv2-tag ${tag === 'BEST SELLER' ? 'tag-best-seller' : 'tag-normal'}`}>
            {tag}
          </span>
        )} */}
          <img
            src={imageUrl}
            alt={product.name}
            className="pcv2-img"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=No+Image';
            }}
          />
        </div>

        <div className="pcv2-info-area">
          <div className="pcv2-header">
            <h3 className="pcv2-title" title={product.name}>{product.name}</h3>
            <button className="pcv2-fav-btn" aria-label="Yêu thích">
              <FaHeart size={16} />
            </button>
          </div>

          <div className="pcv2-desc">
            {renderDescIcon()}
            <span>{shortDesc}</span>
          </div>

          <div className="pcv2-footer">
            <div className="pcv2-price">{formatPrice(product.price)}</div>
            <button className="pcv2-add-btn" onClick={handleAddToCart}>
              Thêm <MdAddShoppingCart size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCardV2;
