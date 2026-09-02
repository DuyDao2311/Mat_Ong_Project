import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FiLock } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
// import { FcGoogle } from 'react-icons/fc';
// import { FaFacebook } from 'react-icons/fa';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LoginErrors {
    email: string;
    password: string;
}

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({
        email: '',
        password: '',
    });

    const { login } = useContext(AuthContext) as any;
    const navigate = useNavigate();

    const validateForm = (): boolean => {
        const newErrors: LoginErrors = {
            email: '',
            password: '',
        };
        let isValid = true;

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            newErrors.email = 'Vui lòng nhập Email';
            isValid = false;
        } else if (!EMAIL_REGEX.test(trimmedEmail)) {
            newErrors.email = 'Email không đúng định dạng';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const submitHandler = async (e: any) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        const result = await login(email.trim().toLowerCase(), password);
        setIsLoading(false);

        if (result.success) {
            toast.success('Đăng nhập thành công!');
            if (result.user?.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } else {
            toast.error(result.message);
        }
    };

    const handleFieldChange = (
        field: keyof LoginErrors,
        value: string,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(value);
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <Link to="/" ><h1 className="login-brand-title">NGỌC TRANG</h1></Link>
                <h2 className="login-welcome">Chào mừng bạn trở lại</h2>
                <p className="login-subtitle">
                    Tiếp tục hành trình khám phá tinh túy mật ong Ngọc Trang
                </p>

                <form onSubmit={submitHandler} noValidate>
                    <div className="login-field-wrapper">
                        <div className="login-form-group">
                            <MdOutlineMailOutline className="login-input-icon" />
                            <input
                                type="email"
                                className={`login-input${errors.email ? ' input-error' : ''}`}
                                placeholder="Email của bạn"
                                value={email}
                                onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                            />
                        </div>
                        {errors.email && <p className="field-error-text">{errors.email}</p>}
                    </div>

                    <div className="login-field-wrapper">
                        <div className="login-form-group">
                            <FiLock className="login-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`login-input${errors.password ? ' input-error' : ''}`}
                                placeholder="Mật khẩu"
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

                    {/* <div className="login-options">
                        <label className="login-checkbox-group">
                            <input type="checkbox" />
                            Ghi nhớ đăng nhập
                        </label>
                        <Link to="#" className="login-forgot-link">
                            Quên mật khẩu?
                        </Link>
                    </div> */}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="login-submit-btn"
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>

                {/* <div className="login-divider">
                    Hoặc tiếp tục với
                </div>

                <div className="login-social-group">
                    <button className="login-social-btn" type="button">
                        <FcGoogle />
                    </button>
                    <button className="login-social-btn" type="button">
                        <FaFacebook style={{ color: '#1877F2' }} />
                    </button>
                </div> */}

                <div className="login-register-text">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="login-register-link">
                        Đăng ký ngay
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
