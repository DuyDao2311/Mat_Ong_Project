import bannerImg from '../../image/logo/BannerPro.png';

function HeroBanner() {
  return (
    <section className="hero-banner" id="hero-banner">
      <img
        src={bannerImg}
        alt="Mật Ong Núi Đá - Thiên Nhiên Tinh Khiết"
        className="hero-banner-img"
      />
    </section>
  );
}

export default HeroBanner;
