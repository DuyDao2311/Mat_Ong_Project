function NewsSection() {
  const newsList = [
    {
      id: 1,
      title: 'Phấn Hoa Ong là gì ?',
      date: '08 Thg 8',
      image: 'https://via.placeholder.com/400x250/f0b12b/ffffff?text=Phan+Hoa',
    },
    {
      id: 2,
      title: 'Phấn Hoa Ong chứa hơn 250 chất hoạt tính sinh học',
      date: '07 Thg 7',
      image: 'https://via.placeholder.com/400x250/f0b12b/ffffff?text=Phan+Hoa',
    },
    {
      id: 3,
      title: 'Tại Sao Mật Ong Nguyên Chất Bị loãng vào mùa hè ???',
      date: '06 Thg 6',
      image: 'https://via.placeholder.com/400x250/1c3138/ffffff?text=Mat+Ong',
    }
  ];

  return (
    <section className="news-section">
      <div className="section-title-wrapper">
        <h2 className="section-title">TIN TỨC</h2>
        <div className="section-title-divider">
          <span className="divider-ornament">✦</span>
        </div>
      </div>

      <div className="news-grid container">
        {newsList.map(news => (
          <div key={news.id} className="news-card">
            <div className="news-image-wrapper">
              <div className="news-date-badge">
                <span className="date-day">{news.date.split(' ')[0]}</span>
                <span className="date-month">{news.date.split(' ').slice(1).join(' ')}</span>
              </div>
              <img src={news.image} alt={news.title} className="news-image" />
            </div>
            <div className="news-content">
              <h3 className="news-title">{news.title}</h3>
              <button className="news-btn">XEM THÊM</button>
            </div>
          </div>
        ))}
      </div>

      <div className="actions-row-simple">
        <button className="nav-arrow-small">‹</button>
        <span className="view-more-text">Xem thêm</span>
        <button className="nav-arrow-small">›</button>
      </div>
    </section>
  );
}

export default NewsSection;
