import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaArrowRight, FaChevronRight, FaDirections, FaExternalLinkAlt } from 'react-icons/fa';
import Map, { Marker } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
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

      <div className="contact-page" style={{ marginTop: '0', paddingTop: '0' }}>
        {/* Breadcrumb */}
        <div className="pdp-breadcrumb-wrapper" style={{ background: 'transparent', marginBottom: '1rem' }}>
          <div className="pdp-breadcrumb">
            <Link to="/">Trang chủ</Link>
            <FaChevronRight className="pdp-breadcrumb-sep" size={10} />
            <span className="pdp-breadcrumb-current">Liên hệ</span>
          </div>
        </div>

        <div className="contact-container">

          {/* Map Section */}
          <div className="contact-map-section">
            <Map
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
              initialViewState={{
                longitude: 105.361374,
                latitude: 23.278082,
                zoom: 15
              }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
            >
              <Marker longitude={105.361374} latitude={23.278082} color="red" />
            </Map>

            {/* Map Info Overlay */}
            <div className="contact-map-overlay">
              <div className="contact-map-overlay-header">
                <h3 className="contact-map-overlay-name">Mật Ong Ngọc Trang</h3>
                <div className="contact-map-overlay-actions-top">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=23.278082,105.361374"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-map-overlay-icon-btn"
                    title="Xem đường đi"
                  >
                    <FaDirections />
                  </a>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=23.278082,105.361374"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-map-overlay-icon-btn"
                    title="Mở trong Google Maps"
                  >
                    <FaExternalLinkAlt size={13} />
                  </a>
                </div>
              </div>
              <p className="contact-map-overlay-address">
                Thôn Đồng Thanh, Xã Đồng Văn, Tỉnh Tuyên Quang
              </p>
              {/* <div className="contact-map-overlay-rating">
                <span className="contact-map-overlay-rating-score">4.8</span>
                <div className="contact-map-overlay-stars">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                </div>
                <span className="contact-map-overlay-review-count">(12)</span>
              </div> */}
              {/* <div className="contact-map-overlay-buttons">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=23.278082,105.361374"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-overlay-btn contact-map-overlay-btn-directions"
                >
                  <FaDirections /> Xem đường đi
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=23.278082,105.361374"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-overlay-btn contact-map-overlay-btn-open"
                >
                  <FaExternalLinkAlt size={12} /> Mở Google Maps
                </a>
              </div> */}
            </div>
          </div>

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
                    096 325 8186
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
