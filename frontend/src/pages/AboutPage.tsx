import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

function AboutPage() {
  return (
    <div className="about-page-container">
      <Header />

      {/* Breadcrumb */}
      <div className="pdp-breadcrumb-wrapper">
        <div className="pdp-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
          <span className="pdp-breadcrumb-current">Giới thiệu</span>
        </div>
      </div>

      <main className="about-main-content">
        <div className="about-section">
          <h1 className="about-title">Mật ong núi đá Đồng Văn – Ngọc Trang</h1>

          <div className="about-description">
            <p>
              Mật ong núi đá Đồng Văn – Ngọc Trang ra đời với mong muốn gìn giữ và lan tỏa hương vị mật ong đặc trưng của vùng cao nguyên đá Đồng Văn. Những giọt mật được tạo nên từ nguồn hoa tự nhiên giữa núi rừng, mang vị ngọt thanh, hương thơm dịu nhẹ và đậm đà bản sắc miền cao nguyên Hà Giang.
            </p>
            <p>
              Với sự trân trọng dành cho thiên nhiên và nghề nuôi ong, Ngọc Trang cung cấp các sản phẩm mật ong núi đá nguyên chất cùng những sản phẩm kết hợp từ mật ong như mật ong ngâm hoa đu đủ đực. Sản phẩm được lựa chọn và đóng gói cẩn thận nhằm giữ trọn hương vị tự nhiên, đáp ứng nhu cầu sử dụng hằng ngày và làm quà tặng cho người thân.
            </p>
            <p>
              Ngọc Trang luôn chú trọng chất lượng sản phẩm, sự minh bạch về nguồn gốc và trải nghiệm của khách hàng. Mỗi sản phẩm không chỉ mang đến vị ngọt từ thiên nhiên mà còn chứa đựng nét đẹp văn hóa, con người và sản vật của vùng cao nguyên đá Đồng Văn.
            </p>
          </div>

          <div className="about-values">
            <div className="value-item">
              <h3>Tầm nhìn</h3>
              <p>Trở thành địa chỉ đáng tin cậy chuyên cung cấp mật ong núi đá Đồng Văn và các sản phẩm từ mật ong đến từ thiên nhiên, góp phần đưa đặc sản vùng cao đến gần hơn với người tiêu dùng.</p>
            </div>

            <div className="value-item">
              <h3>Tiêu chí hoạt động</h3>
              <p>Chất lượng trong từng giọt mật – Tận tâm trong từng sản phẩm – Uy tín với mỗi khách hàng.</p>
            </div>

            <div className="value-item">
              <h3>Mục tiêu</h3>
              <p>Mang hương vị tinh túy của núi rừng Đồng Văn đến với mọi gia đình, đồng thời góp phần quảng bá và nâng cao giá trị đặc sản địa phương.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;
