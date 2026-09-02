import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import { FaSearch, FaChevronRight } from 'react-icons/fa';

const sanitizeContent = (html: string) => {
    // Replace &nbsp; (non-breaking spaces) with regular spaces
    // so the browser can wrap text naturally at word boundaries
    return html
        .replace(/&nbsp;/g, ' ')
        .replace(/\u00A0/g, ' ');
};

const NewsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState<any>(null);
    const [recentNews, setRecentNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/news/${id}`);
                setNews(data);

                // Fetch recent news for sidebar
                const recentRes = await api.get('/news');
                const activeRecent = recentRes.data
                    .filter((item: any) => item.isActive && item._id !== id)
                    .slice(0, 4);
                setRecentNews(activeRecent);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    const resolveImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/400x250?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
        return `${baseUrl}${url}`;
    };

    const formatDateStr = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Đang tải tin tức...</div>;
    if (!news) return <div style={{ padding: '100px', textAlign: 'center' }}>Không tìm thấy bài viết</div>;

    return (
        <div className="home-page">
            <Header />

            {/* Breadcrumb */}
            <div className="pdp-breadcrumb-wrapper" style={{ marginTop: '20px' }}>
                <div className="pdp-breadcrumb container" style={{ paddingLeft: '20px' }}>
                    <Link to="/">Home</Link>
                    <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
                    <Link to="/">Tin tức</Link>
                    <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
                    <span className="pdp-breadcrumb-current">{news.title}</span>
                </div>
            </div>

            <div className="news-detail-container container">
                <div className="news-detail-main">
                    <div className="news-detail-header">
                        <h1 className="news-detail-title">{news.title}</h1>
                        {/* <p className="news-detail-meta">
                            Đăng bởi <strong>haravan</strong> ngày {formatDateStr(news.createdAt)}
                        </p> */}
                    </div>

                    <hr className="news-detail-divider" />

                    <div
                        className="news-detail-content"
                        dangerouslySetInnerHTML={{ __html: sanitizeContent(news.content) }}
                    />

                    <hr className="news-detail-divider" />

                    <div className="news-detail-nav">
                        {recentNews.length > 0 && (
                            <span className="news-nav-link" onClick={() => navigate(`/news/${recentNews[0]._id}`)}>
                                Mới hơn →
                            </span>
                        )}
                    </div>
                </div>

                <aside className="news-sidebar">
                    <div className="sidebar-widget">
                        <h3 className="sidebar-widget-title">Tìm kiếm</h3>
                        <div className="sidebar-search-box">
                            <input type="text" placeholder="Tìm kiếm bài viết..." />
                            <button><FaSearch /></button>
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3 className="sidebar-widget-title">Bài viết mới</h3>
                        <div className="sidebar-recent-list">
                            {recentNews.map(item => (
                                <Link to={`/news/${item._id}`} key={item._id} className="sidebar-recent-item">
                                    <div className="sidebar-recent-img">
                                        <img src={resolveImageUrl(item.image)} alt={item.title} />
                                    </div>
                                    <div className="sidebar-recent-info">
                                        <h4 className="sidebar-recent-title">{item.title}</h4>
                                        <span className="sidebar-recent-date">{formatDateStr(item.createdAt)}</span>
                                    </div>
                                </Link>
                            ))}
                            {recentNews.length === 0 && <p style={{ fontSize: '0.85rem' }}>Chưa có bài viết khác.</p>}
                        </div>
                    </div>
                </aside>
            </div>

            <Footer />
            <FloatingButtons />
        </div>
    );
};

export default NewsDetailPage;
