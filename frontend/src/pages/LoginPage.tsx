import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FiLock } from 'react-icons/fi';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext) as any;
    const navigate = useNavigate();

    const submitHandler = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(email, password);
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

    return (
        <div className="login-page-wrapper">
            <div className="login-card">
                <h1 className="login-brand-title">NGỌC TRANG</h1>
                <h2 className="login-welcome">Chào mừng bạn trở lại</h2>
                <p className="login-subtitle">
                    Tiếp tục hành trình khám phá tinh túy mật ong Ngọc Trang
                </p>

                <form onSubmit={submitHandler}>
                    <div className="login-form-group">
                        <MdOutlineMailOutline className="login-input-icon" />
                        <input
                            type="email"
                            required
                            className="login-input"
                            placeholder="Email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login-form-group">
                        <FiLock className="login-input-icon" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="login-input"
                            placeholder="Mật khẩu"
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

                    <div className="login-options">
                        <label className="login-checkbox-group">
                            <input type="checkbox" />
                            Ghi nhớ đăng nhập
                        </label>
                        <Link to="#" className="login-forgot-link">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="login-submit-btn"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>

                <div className="login-divider">
                    Hoặc tiếp tục với
                </div>

                <div className="login-social-group">
                    <button className="login-social-btn" type="button">
                        <FcGoogle />
                    </button>
                    <button className="login-social-btn" type="button">
                        <FaFacebook style={{ color: '#1877F2' }} />
                    </button>
                </div>

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
