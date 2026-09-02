import { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCardV2 from '../components/ProductCardV2';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

function ProductListPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Filter states
  const location = useLocation();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryQuery = searchParams.get('category');
    const searchQuery = searchParams.get('search');
    if (categoryQuery) {
      setSelectedCategories([categoryQuery]);
    } else {
      setSelectedCategories([]);
    }
    setSearchKeyword(searchQuery || '');
    setCurrentPage(1);
  }, [location.search]);
  // const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState('Mới nhất');
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange]);

  const [categories, setCategories] = useState<any[]>([]);
  // const flavors = ['Ngọt Dịu', 'Đậm Đà', 'Thảo Mộc', 'Chua Nhẹ', 'Trái Cây'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  // const handleFlavorToggle = (flavor: string) => {
  //   setSelectedFlavors(prev =>
  //     prev.includes(flavor)
  //       ? prev.filter(f => f !== flavor)
  //       : [...prev, flavor]
  //   );
  //   setCurrentPage(1);
  // };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    // setSelectedFlavors([]);
    setCurrentPage(1);
  };

  // Lọc sản phẩm (giả lập trên client vì backend chưa có API lọc chi tiết)
  const filteredProducts = Array.isArray(products) ? products.filter((product) => {
    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      const name = (product.name || '').toLowerCase();
      const description = (product.description || '').toLowerCase();
      const category = (product.category || '').toLowerCase();
      if (!name.includes(keyword) && !description.includes(keyword) && !category.includes(keyword)) {
        return false;
      }
    }

    // Lọc theo danh mục
    if (selectedCategories.length > 0) {
      if (!product.category || !selectedCategories.includes(product.category)) {
        return false;
      }
    }

    // Lọc theo khoảng giá
    const price = product.price || 0;
    const minPrice = priceRange.min !== '' ? Number(priceRange.min) : 0;
    const maxPrice = priceRange.max !== '' ? Number(priceRange.max) : Infinity;

    if (price < minPrice || price > maxPrice) {
      return false;
    }

    return true;
  }) : [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Giá từ thấp đến cao') {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortOption === 'Giá từ cao đến thấp') {
      return (b.price || 0) - (a.price || 0);
    }
    if (sortOption === 'Bán chạy nhất') {
      return (b.sold || 0) - (a.sold || 0);
    }
    if (sortOption === 'Mới nhất') {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }
    return 0; // Default fallback
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const currentProducts = sortedProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="product-list-page-container">
      <Header />

      {/* Breadcrumb */}
      <div className="pdp-breadcrumb-wrapper">
        <div className="pdp-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
          <span className="pdp-breadcrumb-current">Sản phẩm</span>
        </div>
      </div>

      <div className="plp-layout">
        {/* SIDEBAR */}
        <aside className="plp-sidebar">
          <div className="plp-sidebar-header">
            <h2 className="plp-filter-title">Bộ lọc</h2>
            <div className="plp-filter-subtitle">Tinh chỉnh tìm kiếm</div>
          </div>

          <div className="plp-filter-group">
            <h3 className="plp-filter-heading">LOẠI MẬT ONG</h3>
            <div className="plp-checkbox-list">
              {categories.map(cat => (
                <label key={cat._id || cat.name} className="plp-checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.name)}
                    onChange={() => handleCategoryChange(cat.name)}
                  />
                  <span className="plp-checkbox-text">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="plp-filter-group">
            <h3 className="plp-filter-heading">KHOẢNG GIÁ</h3>
            <div className="plp-price-range">
              <input
                type="number"
                placeholder="Từ"
                value={priceRange.min}
                onChange={e => setPriceRange({ ...priceRange, min: e.target.value })}
              />
              <span className="plp-price-separator">-</span>
              <input
                type="number"
                placeholder=" Đến"
                value={priceRange.max}
                onChange={e => setPriceRange({ ...priceRange, max: e.target.value })}
              />
            </div>
          </div>

          {/* <div className="plp-filter-group">
            <h3 className="plp-filter-heading">HƯƠNG VỊ</h3>
            <div className="plp-flavor-chips">
              {flavors.map(flavor => (
                <button
                  key={flavor}
                  className={`plp-flavor-chip ${selectedFlavors.includes(flavor) ? 'active' : ''}`}
                  onClick={() => handleFlavorToggle(flavor)}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div> */}

          <button className="plp-clear-btn" onClick={handleClearFilters}>
            Xóa Bộ lọc
          </button>
        </aside>

        {/* MAIN CONTENT */}
        <main className="plp-main">
          <div className="plp-main-header">
            <div className="plp-count">
              <span className="plp-count-title">
                {searchKeyword ? `Kết quả tìm kiếm: "${searchKeyword}"` : 'Sản phẩm'}
              </span>
              <span className="plp-count-number">({filteredProducts.length})</span>
            </div>
            <div className="plp-sort">
              Sắp xếp:
              <div
                className="plp-sort-dropdown"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                {sortOption} <FaChevronDown size={10} className="ml-1 text-gray-500" />
              </div>

              {isSortOpen && (
                <>
                  <div
                    className="plp-sort-overlay"
                    onClick={() => setIsSortOpen(false)}
                  ></div>
                  <div className="plp-sort-menu">
                    {['Mới nhất', 'Bán chạy nhất', 'Giá từ thấp đến cao', 'Giá từ cao đến thấp'].map(option => (
                      <div
                        key={option}
                        className={`plp-sort-option ${sortOption === option ? 'active' : ''}`}
                        onClick={() => {
                          setSortOption(option);
                          setIsSortOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="plp-loading">Đang tải sản phẩm...</div>
          ) : (
            <>
              <div className="plp-grid">
                {currentProducts.map(product => (
                  <ProductCardV2 key={product.id || product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="plp-pagination">
                  <button
                    className="plp-page-btn nav-btn"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  ><FaAngleLeft /></button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`plp-page-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >{page}</button>
                  ))}

                  <button
                    className="plp-page-btn nav-btn"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  ><FaAngleRight /></button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default ProductListPage;
