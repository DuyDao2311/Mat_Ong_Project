import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FiUser, FiPhone, FiLock } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        setIsLoading(true);
        // Default register as 'client'
        const result = await register(name, email, phone, password, 'client');
        setIsLoading(false);

        if (result.success) {
            toast.success('Đăng ký thành công!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="login-page-wrapper" style={{ minHeight: '100vh', height: 'auto', padding: '40px 20px', overflowY: 'auto' }}>
            <div className="login-card">
                <h1 className="login-brand-title" style={{ marginBottom: '15px' }}>NGỌC TRANG</h1>
                <p className="login-subtitle" style={{ marginBottom: '25px' }}>
                    Khám phá tinh túy mật ong từ cao nguyên đá Đồng Văn
                </p>

                <form onSubmit={submitHandler}>
                    <div className="register-field">
                        <label className="register-label">Họ và Tên</label>
                        <div className="login-form-group register-group">
                            <FiUser className="login-input-icon" />
                            <input
                                type="text"
                                required
                                className="login-input register-input"
                                placeholder="Nguyễn Văn A"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="register-field">
                        <label className="register-label">Email</label>
                        <div className="login-form-group register-group">
                            <MdOutlineMailOutline className="login-input-icon" />
                            <input
                                type="email"
                                required
                                className="login-input register-input"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="register-field">
                        <label className="register-label">Số Điện Thoại</label>
                        <div className="login-form-group register-group">
                            <FiPhone className="login-input-icon" />
                            <input
                                type="tel"
                                required
                                className="login-input register-input"
                                placeholder="0912 345 678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="register-field">
                        <label className="register-label">Mật Khẩu</label>
                        <div className="login-form-group register-group">
                            <FiLock className="login-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                className="login-input register-input"
                                placeholder="........"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                                className="login-input-eye"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </div>
                        </div>
                    </div>

                    <div className="register-field">
                        <label className="register-label">Xác Nhận Mật Khẩu</label>
                        <div className="login-form-group register-group">
                            <FiLock className="login-input-icon" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                className="login-input register-input"
                                placeholder="........"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <div
                                className="login-input-eye"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="login-submit-btn"
                        style={{ marginTop: '10px' }}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
                    </button>
                </form>

                <div className="login-divider">
                    Hoặc đăng ký bằng
                </div>

                <div className="login-social-group">
                    <button className="login-social-btn" type="button" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                        <FcGoogle style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Google
                    </button>
                    <button className="login-social-btn" type="button" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                        <FaFacebook style={{ color: '#1877F2', marginRight: '8px', fontSize: '1.2rem' }} /> Facebook
                    </button>
                </div>

                <div className="login-register-text" style={{ marginTop: '10px' }}>
                    Bạn đã có tài khoản?{' '}
                    <Link to="/login" className="login-register-link" style={{ fontWeight: 500, color: '#666', textDecoration: 'none' }}>
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
