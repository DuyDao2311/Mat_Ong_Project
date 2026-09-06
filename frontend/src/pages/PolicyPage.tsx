import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

function PolicyPage() {
  return (
    <div className="policy-page-container">
      <Header />
      
      {/* Breadcrumb */}
      <div className="pdp-breadcrumb-wrapper">
        <div className="pdp-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
          <span className="pdp-breadcrumb-current">Chính sách</span>
        </div>
      </div>

      <main className="policy-main-content">
        <div className="policy-section">
          <h1 className="policy-title">CHÍNH SÁCH ĐỔI TRẢ</h1>
          
          <div className="policy-content">
            <h3>1. Điều kiện đổi trả</h3>
            <p>Quý khách vui lòng kiểm tra tình trạng sản phẩm ngay khi nhận hàng. Mật ong núi đá Đồng Văn – Ngọc Trang hỗ trợ đổi trả trong các trường hợp sau:</p>
            <ul>
              <li>Sản phẩm giao không đúng loại hoặc số lượng đã đặt.</li>
              <li>Sản phẩm bị vỡ, rò rỉ, bung nắp hoặc hư hỏng trong quá trình vận chuyển.</li>
              <li>Sản phẩm có dấu hiệu bất thường hoặc không bảo đảm chất lượng khi nhận hàng.</li>
              <li>Sản phẩm còn hạn sử dụng nhưng phát sinh lỗi từ phía nhà sản xuất.</li>
            </ul>
            <p>Để được hỗ trợ, Quý khách vui lòng cung cấp hình ảnh hoặc video mở kiện hàng, kèm theo mã đơn hàng và thông tin liên quan.</p>
            <p>Sản phẩm đổi trả cần được giữ nguyên hiện trạng. Chúng tôi không hỗ trợ đổi trả đối với sản phẩm đã qua sử dụng, bị hư hỏng do bảo quản không đúng hướng dẫn hoặc đổi trả vì lý do cá nhân.</p>

            <h3>2. Thời gian thông báo đổi trả</h3>
            <ul>
              <li>Quý khách cần liên hệ trong vòng 48 giờ kể từ thời điểm nhận hàng.</li>
              <li>Sau khi tiếp nhận thông tin, Ngọc Trang sẽ kiểm tra và phản hồi phương án xử lý phù hợp.</li>
              <li>Sản phẩm thay thế sẽ được gửi sau khi yêu cầu đổi trả được xác nhận.</li>
            </ul>

            <h3>3. Chi phí đổi trả</h3>
            <ul>
              <li>Ngọc Trang chịu chi phí vận chuyển nếu sản phẩm bị lỗi, hư hỏng, giao sai loại hoặc thiếu số lượng.</li>
              <li>Trường hợp đổi sản phẩm theo nhu cầu cá nhân và được cửa hàng chấp thuận, Quý khách vui lòng thanh toán chi phí vận chuyển phát sinh.</li>
            </ul>

            <h3>4. Phương thức hoàn tiền</h3>
            <p>Nếu không còn sản phẩm phù hợp để đổi, Ngọc Trang sẽ hoàn lại số tiền tương ứng bằng hình thức chuyển khoản. Thời gian xử lý hoàn tiền dự kiến từ 3–7 ngày làm việc kể từ khi yêu cầu được xác nhận.</p>

            <div className="policy-contact">
              <p>Mọi thắc mắc hoặc yêu cầu đổi trả, Quý khách vui lòng liên hệ:</p>
              <p><strong>Điện thoại:</strong> 096 325 81 86</p>
              <p><strong>Email:</strong> levanngocvphu@gmail.com</p>
              <p><strong>Facebook:</strong> Mật ong núi đá Đồng Văn – Ngọc Trang</p>
            </div>
            
            <p style={{ marginTop: '20px', fontStyle: 'italic', color: 'var(--dark-light)' }}>
              Ngọc Trang luôn trân trọng ý kiến đóng góp của Quý khách và cam kết hỗ trợ nhanh chóng, tận tâm để bảo đảm quyền lợi của khách hàng.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PolicyPage;
