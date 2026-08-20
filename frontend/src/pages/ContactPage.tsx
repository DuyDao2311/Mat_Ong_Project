import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaArrowRight } from 'react-icons/fa';
import logo from '../../image/logo/image.png';
import '../index.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    alert('Tin nhắn đã được gửi!');
  };

  return (
    <>
      <Header />
      <div className="contact-page">
        <div className="contact-container">

          {/* Top Contact Info Cards */}
          <div className="contact-info-cards">
            <div className="contact-info-grid">

              {/* Address */}
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <h3 className="contact-info-label">ĐỊA CHỈ:</h3>
                  <p className="contact-info-text">
                    Thôn Đồng Thanh, Xã Đồng Văn, Tỉnh Tuyên Quang
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <FaEnvelope size={20} />
                </div>
                <div>
                  <h3 className="contact-info-label">EMAIL:</h3>
                  <p className="contact-info-text">
                    info@vinapi.com.vn
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="contact-info-item">
                <div className="contact-icon-wrapper">
                  <FaPhoneAlt size={20} />
                </div>
                <div>
                  <h3 className="contact-info-label">TỔNG ĐÀI HỖ TRỢ:</h3>
                  <p className="contact-info-text">
                    0912831964
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Section */}
          <div className="contact-bottom-section">

            {/* Left Content */}
            <div className="contact-left-content">
              <div>
                <h1 className="contact-title">
                  NGỌC TRANG
                </h1>
                <h2 className="contact-subtitle">
                  XIN CHÀO
                </h2>
              </div>
              <p className="contact-description">
                Nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào, hoặc chỉ muốn chào hỏi, vui lòng liên hệ với nhóm hỗ trợ thân thiện của chúng tôi.
              </p>
              <div className="contact-image-wrapper">
                <img
                  src={logo}
                  alt="Mật ong"
                />
              </div>
            </div>

            {/* Right Form */}
            <div className="contact-form-wrapper">
              <form onSubmit={handleSubmit} className="contact-form">

                <div className="contact-form-group">
                  <label htmlFor="name" className="contact-form-label">
                    Họ tên của bạn
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên..."
                    className="contact-form-input"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="email" className="contact-form-label">
                    Địa chỉ email của bạn
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Nhập địa chỉ email..."
                    className="contact-form-input"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="phone" className="contact-form-label">
                    Số điện thoại của bạn
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại..."
                    className="contact-form-input"
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label htmlFor="message" className="contact-form-label">
                    Nội dung
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hãy cho chúng tôi biết bạn đang nghĩ gì..."
                    rows={4}
                    className="contact-form-textarea"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="contact-submit-btn"
                >
                  GỬI TIN NHẮN <FaArrowRight className="contact-submit-icon" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
