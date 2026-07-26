function BrandBanner() {
  return (
    <section className="brand-banner" id="brand-banner">
      <div className="brand-banner-bg" style={{
        backgroundImage: 'url(/background1.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}></div>
      <div className="brand-banner-flowers"></div>
      <div className="brand-banner-content">
        <h2 className="brand-banner-name">NGỌC TRANG</h2>
        <p className="brand-banner-tagline">Thương hiệu bán lẻ Mật ong hàng đầu Việt Nam</p>
      </div>
    </section>
  );
}

export default BrandBanner;
