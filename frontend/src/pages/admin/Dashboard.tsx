import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { FaBoxOpen, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useContext(AuthContext) as any;
    const [stats, setStats] = useState({ users: 0, products: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const [usersRes, productsRes] = await Promise.all([
                    api.get('/users', config),
                    api.get('/products') // Public route
                ]);

                setStats({
                    users: usersRes.data.length,
                    products: productsRes.data.length
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-page-title">Tổng quan</h1>
            </div>
            <div className="admin-stats-grid">

                <div className="admin-stat-card users">
                    <div className="admin-stat-icon-wrapper">
                        <FaUsers />
                    </div>
                    <div className="admin-stat-info">
                        <h3>Tổng số User</h3>
                        <p>{stats.users}</p>
                    </div>
                </div>

                <div className="admin-stat-card products">
                    <div className="admin-stat-icon-wrapper">
                        <FaBoxOpen />
                    </div>
                    <div className="admin-stat-info">
                        <h3>Tổng số Sản phẩm</h3>
                        <p>{stats.products}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
