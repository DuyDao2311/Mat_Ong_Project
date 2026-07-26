import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';

const UserList = () => {
    const { user } = useContext(AuthContext) as any;
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/users', config);
            setUsers(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchUsers();
    }, [user]);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await api.delete(`/users/${id}`, config);
                toast.success('Xóa người dùng thành công');
                fetchUsers();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Xóa thất bại');
            }
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản lý Người Dùng</h2>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u: any) => (
                            <tr key={u._id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <span className={`admin-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-action-btns">
                                        <button
                                            onClick={() => deleteHandler(u._id)}
                                            className="admin-btn-icon delete"
                                            title="Xóa"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
