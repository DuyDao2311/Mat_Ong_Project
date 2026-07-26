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


const bestSellingProducts = [
  { id: 'b1', name: 'Bột nghệ vàng 250g', price: 60000, category: 'BỘT NGHỆ VÀNG', emoji: '🫙' },
  { id: 'b2', name: 'Mật ong bạc hà 530g', price: 210000, category: 'MẬT ONG HOA BẠC HÀ', emoji: '🍯' },
  { id: 'b3', name: 'Mật ong chanh vàng 1000g', price: 269000, category: 'MẬT ONG CHANH VÀNG', emoji: '🍋' },
  { id: 'b4', name: 'Mật ong đa hoa 900g', price: 121000, category: 'MẬT ONG ĐA HOA', emoji: '🍯' },
  { id: 'b5', name: 'Mật ong bạc hà 450g', price: 195000, category: 'MẬT ONG HOA BẠC HÀ', emoji: '🍯' },
  { id: 'b6', name: 'Mật ong bánh tổ 450g', price: 275000, category: 'MẬT ONG BÁNH TỔ', emoji: '🐝' },
  { id: 'b7', name: 'Mật ong chanh vàng 450g', price: 145000, category: 'MẬT ONG CHANH VÀNG', emoji: '🍋' },
  { id: 'b8', name: 'Mật ong hoa đu đủ 400gr', price: 165000, category: 'MẬT ONG HOA ĐU ĐỦ', emoji: '🍯' },
];

function HomePage() {
  const [latestProducts, setLatestProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const { data } = await api.get('/products');
        const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLatestProducts(sorted.slice(0, 4));
      } catch (error) {
        console.error('Error fetching latest products:', error);
      }
    };
    fetchLatestProducts();
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
