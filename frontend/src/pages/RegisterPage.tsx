import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FiUser, FiPhone, FiLock } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import { FcGoogle } from 'react-icons/fc';
// import { FaFacebook } from 'react-icons/fa';

// --- Validation helpers ---
const NAME_REGEX = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])\S{8,64}$/;

interface FormErrors {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const { register } = useContext(AuthContext)!;
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        };
        let isValid = true;

        // Name validation
        const trimmedName = name.trim();
        if (!trimmedName) {
            newErrors.name = 'Họ và tên là bắt buộc';
            isValid = false;
        } else if (trimmedName.length < 2 || trimmedName.length > 50) {
            newErrors.name = 'Họ và tên phải có từ 2 đến 50 ký tự';
            isValid = false;
        } else if (!NAME_REGEX.test(trimmedName)) {
            newErrors.name = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
            isValid = false;
        }

        // Email validation
        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            newErrors.email = 'Email là bắt buộc';
            isValid = false;
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            newErrors.email = 'Email không đúng định dạng';
            isValid = false;
        }

        // Phone validation
        const trimmedPhone = phone.trim();
        if (!trimmedPhone) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
            isValid = false;
        } else if (!/^\d+$/.test(trimmedPhone)) {
            newErrors.phone = 'Số điện thoại không đúng định dạng';
            isValid = false;
        } else if (!PHONE_REGEX.test(trimmedPhone)) {
            newErrors.phone = 'Số điện thoại phải gồm 10 chữ số';
            isValid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
            isValid = false;
        } else if (/\s/.test(password)) {
            newErrors.password = 'Mật khẩu không được chứa khoảng trắng';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
            isValid = false;
        } else if (!PASSWORD_REGEX.test(password)) {
            newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt';
            isValid = false;
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
            isValid = false;
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        // Default register as 'client'
        const result = await register(name.trim(), email.trim().toLowerCase(), phone.trim(), password, confirmPassword, 'client');
        setIsLoading(false);

        if (result.success) {
            toast.success('Đăng ký thành công!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    // Clear error when user starts typing in a field
    const handleFieldChange = (
        field: keyof FormErrors,
        value: string,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(value);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="login-page-wrapper" style={{ minHeight: '100vh', height: 'auto', padding: '40px 20px', overflowY: 'auto' }}>
            <div className="login-card">
                <h1 className="login-brand-title" style={{ marginBottom: '15px' }}>NGỌC TRANG</h1>
                <p className="login-subtitle" style={{ marginBottom: '25px' }}>
                    Khám phá tinh túy mật ong từ cao nguyên đá Đồng Văn
                </p>

                <form onSubmit={submitHandler} noValidate>
                    <div className="register-field">
                        <label className="register-label">Họ và Tên</label>
                        <div className="login-form-group register-group">
                            <FiUser className="login-input-icon" />
                            <input
                                type="text"
                                className={`login-input register-input${errors.name ? ' input-error' : ''}`}
                                placeholder="Nguyễn Văn A"
                                value={name}
                                onChange={(e) => handleFieldChange('name', e.target.value, setName)}
                            />
                        </div>
                        {errors.name && <p className="field-error-text">{errors.name}</p>}
                    </div>

                    <div className="register-field">
                        <label className="register-label">Email</label>
                        <div className="login-form-group register-group">
                            <MdOutlineMailOutline className="login-input-icon" />
                            <input
                                type="email"
                                className={`login-input register-input${errors.email ? ' input-error' : ''}`}
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                            />
                        </div>
                        {errors.email && <p className="field-error-text">{errors.email}</p>}
                    </div>

                    <div className="register-field">
                        <label className="register-label">Số Điện Thoại</label>
                        <div className="login-form-group register-group">
                            <FiPhone className="login-input-icon" />
                            <input
                                type="tel"
                                className={`login-input register-input${errors.phone ? ' input-error' : ''}`}
                                placeholder="0912345678"
                                value={phone}
                                maxLength={10}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    handleFieldChange('phone', digits, setPhone);
                                }}
                            />
                        </div>
                        {errors.phone && <p className="field-error-text">{errors.phone}</p>}
                    </div>

                    <div className="register-field">
                        <label className="register-label">Mật Khẩu</label>
                        <div className="login-form-group register-group">
                            <FiLock className="login-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`login-input register-input${errors.password ? ' input-error' : ''}`}
                                placeholder="........"
                                value={password}
                                onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                            />
                            <div
                                className="login-input-eye"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </div>
                        </div>
                        {errors.password && <p className="field-error-text">{errors.password}</p>}
                    </div>

                    <div className="register-field">
                        <label className="register-label">Xác Nhận Mật Khẩu</label>
                        <div className="login-form-group register-group">
                            <FiLock className="login-input-icon" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`login-input register-input${errors.confirmPassword ? ' input-error' : ''}`}
                                placeholder="........"
                                value={confirmPassword}
                                onChange={(e) => handleFieldChange('confirmPassword', e.target.value, setConfirmPassword)}
                            />
                            <div
                                className="login-input-eye"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </div>
                        </div>
                        {errors.confirmPassword && <p className="field-error-text">{errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="login-submit-btn"
                        style={{ marginTop: '10px' }}
                    >
                        {isLoading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
                    </button>
                </form>

                {/* <div className="login-divider">
                    Hoặc đăng ký bằng
                </div> */}

                {/* <div className="login-social-group">
                    <button className="login-social-btn" type="button" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                        <FcGoogle style={{ marginRight: '8px', fontSize: '1.2rem' }} /> Google
                    </button>
                    <button className="login-social-btn" type="button" style={{ fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
                        <FaFacebook style={{ color: '#1877F2', marginRight: '8px', fontSize: '1.2rem' }} /> Facebook
                    </button>
                </div> */}

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
