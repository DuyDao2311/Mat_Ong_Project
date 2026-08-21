import { FaHome, FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { Link } from 'react-router-dom';
import logoImg from '../../image/logo/613326243_4319054925046133_8782869459334492277_n.jpg';
import logoCongThuong from '../../image/logo/Logo_Công_thương-removebg-preview.png';

function Footer() {
  return (
    <footer className="footer-new" id="footer">
      <div className="footer-top-line"></div>
      <div className="footer-inner-new container">
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo" style={{ textDecoration: 'none' }} onClick={() => window.scrollTo(0, 0)}>
            <span className="logo-icon"><img src={logoImg} alt="Mật Ong Núi Đá Logo" /></span>
            <div className="logo-text-wrap">
              <span className="logo-text">MẬT ONG NÚI ĐÁ ĐỒNG VĂN</span>
              <span className="logo-subtitle">Chất Lượng Vàng • Từ Thiên Nhiên</span>
            </div>
          </Link>
          <ul className="contact-list">
            <li><FaHome size={20} />&nbsp;Địa chỉ: Thôn Đồng Thanh, Xã Đồng Văn, Tỉnh Tuyên Quang</li>
            <li><FaPhoneAlt size={20} />&nbsp;Tổng đài hỗ trợ: 091.234.5678</li>
            <li><IoMdMail size={20} />&nbsp;Email: info@matongtunhien.com</li>
          </ul>
          <div style={{ marginTop: '45px' }}>
            <img src={logoCongThuong} alt="Đã thông báo Bộ Công Thương" style={{ maxWidth: '280px' }} />
          </div>
          {/* <div className="footer-badges">
            <div className="badge-placeholder blue">
              <span>✔</span> ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
            </div>
            <div className="badge-placeholder red">
              <span>✔</span> ĐÃ ĐĂNG KÝ BỘ CÔNG THƯƠNG
            </div>
          </div> */}
        </div>

        <div className="footer-col links-col">
          <h3 className="footer-heading">CHÍNH SÁCH</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#" className="text-orange">Sản phẩm</a></li>
            <li><a href="#">Chính sách</a></li>
            <li><a href="#">Thông tin Cổ đông</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>

        <div className="footer-col links-col">
          <h3 className="footer-heading">HỖ TRỢ</h3>
          <ul>
            <li><a href="#">Tìm kiếm</a></li>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Điều khoản dịch vụ</a></li>
            <li><a href="#">Tư vấn sử dụng</a></li>
          </ul>
        </div>

        <div className="footer-col fanpage-col">
          <h3 className="footer-heading">FANPAGE FACEBOOK</h3>
          <div className="fanpage-placeholder">
            <a href="https://www.facebook.com/profile.php?id=61586230476406" target="_blank" rel="noopener noreferrer" className="fanpage-header" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="logo-mini">🐝</span>
              <div>
                <div className="fanpage-name">Mật ong núi đá Đồng Văn - Ngọc Trang</div>
                {/* <div className="fanpage-likes">Theo dõi Trang</div> */}
              </div>
            </a>
          </div>
        </div>
      </div>
      {/* <div className="footer-bottom-new">
        <p>Copyrights © 1964 by CÔNG TY CỔ PHẦN ONG TRUNG ƯƠNG</p>
      </div> */}
    </footer>
  );
}

export default Footer;
