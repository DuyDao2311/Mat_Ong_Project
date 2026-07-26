import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (name: string, email: string, phone: string, password: string, role: string) => Promise<any>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Xóa localStorage cũ nếu còn
        if (localStorage.getItem('userInfo')) {
            localStorage.removeItem('userInfo');
        }

        // Kiểm tra xem đã lưu user trong sessionStorage chưa
        const storedUser = sessionStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post('/users/login', { email, password });
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true, user: data };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Đăng nhập thất bại'
            };
        }
    };

    const register = async (name: string, email: string, phone: string, password: string, role: string) => {
        try {
            const { data } = await api.post('/users/register', {
                name, email, phone, password, role
            });
            // Tự động đăng nhập
            setUser(data);
            sessionStorage.setItem('userInfo', JSON.stringify(data));
            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Đăng ký thất bại'
            };
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
