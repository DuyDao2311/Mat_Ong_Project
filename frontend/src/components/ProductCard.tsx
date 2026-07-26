import { FaShoppingCart, FaEye } from "react-icons/fa";

function ProductCard({ product }: { product: any }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + '₫';
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-card-inner">
        {/* Card top - image area */}
        <div className="product-card-top">
          <div className="product-card-logo">
            <span className="logo-mini">🐝</span>
            MẬT ONG
          </div>
          <div className="product-card-category">{product.category}</div>
          <div className="product-card-image">
            <div className="product-pedestal"></div>
            <span className="product-emoji">{product.emoji}</span>
          </div>
        </div>

        {/* Hover overlay */}

      </div>
      <div className="product-card-overlay">
        <div className="product-card-overlay-actions">
          <button className="overlay-action-btn" aria-label="Xem nhanh"><FaEye size={16} /></button>
          <button className="overlay-buy-btn">MUA NGAY</button>
          <button className="overlay-action-btn" aria-label="Thêm vào giỏ"><FaShoppingCart size={16} /></button>
        </div>
      </div>
      {/* Card bottom - info */}
      <div className="product-card-bottom">
        <div className="product-card-name" title={product.name}>{product.name}</div>
        <div className="product-card-price">{formatPrice(product.price)}</div>
      </div>
    </div>
  );
}

export default ProductCard;
