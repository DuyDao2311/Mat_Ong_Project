import { useEffect, useState } from 'react';
import Header from '../components/Header';
import HeroBanner from '../components/HeroBanner';
import CategoryBar from '../components/CategoryBar';
import PromoBanners from '../components/PromoBanners';
import ProductSection from '../components/ProductSection';
import BrandBanner from '../components/BrandBanner';
import NewsSection from '../components/NewsSection';
import PartnerSection from '../components/PartnerSection';
import FloatingButtons from '../components/FloatingButtons';
import Footer from '../components/Footer';
import api from '../services/api';

function HomePage() {
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const { data } = await api.get('/products');
        
        // Latest products
        const sortedByDate = [...data].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLatestProducts(sortedByDate.slice(0, 4));

        // Best selling products
        const sortedBySold = [...data].sort((a: any, b: any) => (b.sold || 0) - (a.sold || 0));
        setBestSellingProducts(sortedBySold.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProductsData();
  }, []);

  return (
    <div className="home-page">
      <Header />
      <HeroBanner />
      <CategoryBar />
      <PromoBanners />
      <ProductSection
        title="SẢN PHẨM MỚI"
        products={latestProducts}
        id="new-products"
      />
      <BrandBanner />
      <ProductSection title="SẢN PHẨM BÁN CHẠY" products={bestSellingProducts} id="best-selling" />
      <NewsSection />
      <PartnerSection />
      <Footer />
      <FloatingButtons />
    </div>
  );
}

export default HomePage;
