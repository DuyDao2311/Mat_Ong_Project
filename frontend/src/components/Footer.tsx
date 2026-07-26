function Footer() {
  return (
    <footer className="footer-new" id="footer">
      <div className="footer-top-line"></div>
      <div className="footer-inner-new container">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <span className="logo-icon">🐝</span>
            <div className="logo-text-wrap">
              <span className="logo-text">MẬT ONG</span>
              <span className="logo-subtitle">Ong Trung Ương - Since 1964</span>
            </div>
          </div>
          <ul className="contact-list">
            <li>🏠 Địa Chỉ: 19 Trúc Khê, phường Láng Hạ, quận Đống Đa, Hà Nội</li>
            <li>📞 Tổng đài hỗ trợ: 091.234.5678</li>
            <li>✉️ Email: info@matongtunhien.com</li>
          </ul>
          <div className="footer-badges">
            <div className="badge-placeholder blue">
              <span>✔</span> ĐÃ THÔNG BÁO BỘ CÔNG THƯƠNG
            </div>
            <div className="badge-placeholder red">
              <span>✔</span> ĐÃ ĐĂNG KÝ BỘ CÔNG THƯƠNG
            </div>
          </div>
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
            <div className="fanpage-header">
               <span className="logo-mini">🐝</span>
               <div>
                 <div className="fanpage-name">Mật Ong Nguyên Chất...</div>
                 <div className="fanpage-likes">f Theo dõi Trang 4k người theo dõi</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom-new">
        <p>Copyrights © 1964 by CÔNG TY CỔ PHẦN ONG TRUNG ƯƠNG</p>
      </div>
    </footer>
  );
}

export default Footer;
