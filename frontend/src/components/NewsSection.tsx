import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function NewsSection() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await api.get('/news');
        // Filter only active news and limit to 3 items for the home page
        const activeNews = data.filter((item: any) => item.isActive).slice(0, 3);
        setNewsList(activeNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  const resolveImageUrl = (url: string) => {
    if (!url) return 'https://placehold.co/400x250?text=No+Image';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${url}`;
  };

  const formatDateToBadge = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.getMonth() + 1;
    return {
      day: day,
      month: `Thg ${month}`
    };
  };

  return (
    <section className="news-section">
      <div className="section-title-wrapper">
        <h2 className="section-title">TIN TỨC</h2>
        <div className="section-title-divider">
          <span className="divider-ornament">✦</span>
        </div>
      </div>

      <div className="news-grid container">
        {newsList.map(news => {
          const dateBadge = formatDateToBadge(news.createdAt || Date.now());
          return (
            <div key={news._id} className="news-card">
              <div className="news-image-wrapper" onClick={() => navigate(`/news/${news._id}`)}>
                <div className="news-date-badge">
                  <span className="date-day">{dateBadge.day}</span>
                  <span className="date-month">{dateBadge.month}</span>
                </div>
                <img src={resolveImageUrl(news.image)} alt={news.title} className="news-image" />
              </div>
              <div className="news-content">
                <h3 className="news-title">{news.title}</h3>
                <button
                  className="news-btn"
                  onClick={() => navigate(`/news/${news._id}`)}
                >XEM THÊM</button>
              </div>
            </div>
          );
        })}
      </div>

      {newsList.length > 0 && (
        <div className="actions-row-simple">
          <button className="nav-arrow-small">‹</button>
          <span className="view-more-text">Xem thêm</span>
          <button className="nav-arrow-small">›</button>
        </div>
      )}
    </section>
  );
}

export default NewsSection;
