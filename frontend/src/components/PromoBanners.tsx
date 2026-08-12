import { useEffect, useState } from 'react';
import api from '../services/api';

function PromoBanners() {
  const [banners, setBanners] = useState<any[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await api.get('/banners');
        setBanners(data);
      } catch (error) {
        console.error('Lỗi khi tải banners:', error);
      }
    };
    fetchBanners();
  }, []);

  const resolveImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  const getBannerForPosition = (pos: number) => {
    return banners.find(b => b.position === pos);
  };

  const defaultBanners = [
    {
      pos: 1,
      className: 'promo-banner-1',
      title: 'Mật ong HOA BẠC HÀ',
      subtitle: 'Đặc sản vùng cao Đồng Văn'
    },
    {
      pos: 2,
      className: 'promo-banner-2',
      highlight: 'SỐ 1',
      subtitleTop: 'Thức uống',
      subtitleBottom: 'cho mùa hè'
    },
    {
      pos: 3,
      className: 'promo-banner-3',
      title: 'STRESS',
      subtitleTop: '“Xóa tan”',
      subtitleBottom: 'cùng mật ong thiên nhiên'
    }
  ];

  return (
    <section className="promo-banners" id="promo-banners">
      {[1, 2, 3].map((pos) => {
        const dynamicBanner = getBannerForPosition(pos);
        const fallback = defaultBanners.find(d => d.pos === pos);

        if (dynamicBanner) {
          return (
            <div
              key={`dynamic-${pos}`}
              className={`promo-banner promo-banner-${pos}`}
              style={{
                background: `url(${resolveImageUrl(dynamicBanner.image)})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Dynamic banner only shows image, no text */}
            </div>
          );
        } else if (fallback) {
          return (
            <div key={`fallback-${pos}`} className={`promo-banner ${fallback.className}`}>
              <div className="promo-banner-decoration"></div>
              <div className="promo-banner-content">
                {fallback.subtitleTop && <div className="promo-banner-subtitle">{fallback.subtitleTop}</div>}
                {fallback.title && <div className="promo-banner-title">{fallback.title}</div>}
                {fallback.highlight && <span className="promo-banner-highlight">{fallback.highlight}</span>}
                {(fallback.subtitleBottom || fallback.subtitle) && (
                  <div className="promo-banner-subtitle">{fallback.subtitleBottom || fallback.subtitle}</div>
                )}
              </div>
            </div>
          );
        }
        return null;
      })}
    </section>
  );
}

export default PromoBanners;
