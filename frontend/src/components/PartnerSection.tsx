import { FaTruck } from "react-icons/fa6";
import { MdSupport } from "react-icons/md";
import { FaEnvira } from "react-icons/fa";

function PartnerSection() {
  // const partners = [
  //   { name: 'VinCommerce', logo: 'https://via.placeholder.com/150x60/ffffff/e74c3c?text=VinCommerce' },
  //   { name: 'Mega Market', logo: 'https://via.placeholder.com/150x60/ffffff/2980b9?text=Mega+Market' },
  //   { name: 'Sói Biển', logo: 'https://via.placeholder.com/150x60/ffffff/27ae60?text=Soi+Bien' },
  //   { name: 'Homefood', logo: 'https://via.placeholder.com/150x60/ffffff/e67e22?text=Homefood' },
  //   { name: 'PAN PACIFIC', logo: 'https://via.placeholder.com/150x60/ffffff/8e44ad?text=PAN+PACIFIC' },
  // ];

  return (
    <section className="partner-section">
      {/* <div className="section-title-wrapper">
        <h2 className="section-title">ĐỐI TÁC</h2>
        <div className="section-title-divider">
          <span className="divider-ornament">✦</span>
        </div>
      </div> */}

      {/* <div className="partner-logos container">
        {partners.map((partner, index) => (
          <div key={index} className="partner-logo-box">
             <img src={partner.logo} alt={partner.name} />
          </div>
        ))}
      </div> */}

      <div className="features-grid container">
        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <span className="feature-icon"><FaTruck size={30} style={{ transform: 'scaleX(-1)' }} /></span>
          </div>
          <h3 className="feature-title">VẬN CHUYỂN NHANH TIỆN LỢI</h3>
          <p className="feature-desc">Nhận được trong ngày</p>
        </div>
        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <span className="feature-icon"><MdSupport size={30} /></span>
          </div>
          <h3 className="feature-title">HỖ TRỢ 24/7</h3>
          <p className="feature-desc">Gọi điện - Zalo - iMessage - SMS</p>
        </div>
        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <span className="feature-icon"><FaEnvira size={30} /></span>
          </div>
          <h3 className="feature-title">NGON - BỔ - RẺ</h3>
          <p className="feature-desc">Cam kết hàng đầu</p>
        </div>
      </div>
    </section>
  );
}

export default PartnerSection;
