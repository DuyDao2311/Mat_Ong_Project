import { Link } from 'react-router-dom';
import ProductCardV2 from './ProductCardV2';

interface ProductSectionProps {
  title: string;
  products: any[];
  id?: string;
}

function ProductSection({ title, products, id }: ProductSectionProps) {
  return (
    <section className="product-section" id={id}>
      <div className="section-title-wrapper">
        <h2 className="section-title">{title}</h2>
        <div className="section-title-divider">
          <span className="divider-ornament">✦</span>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product: any) => (
          <ProductCardV2 key={product._id || product.id} product={product} />
        ))}
      </div>

      <div className="product-actions-row">
        <div className="product-action-line"></div>
        <Link to="/products" className="view-more-btn">Xem thêm</Link>
        <div className="product-action-line"></div>
      </div>
    </section>
  );
}

export default ProductSection;
