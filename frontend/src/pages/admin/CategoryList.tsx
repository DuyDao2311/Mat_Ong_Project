import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';

const CategoryList = () => {
    const { user } = useContext(AuthContext) as any;
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '', description: ''
    });

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error: any) {
            toast.error('Lỗi khi tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn xóa danh mục này?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await api.delete(`/categories/${id}`, config);
                toast.success('Đã xóa danh mục');
                fetchCategories();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Lỗi khi xóa');
            }
        }
    };

    const handleCreate = () => {
        setEditId(null);
        setFormData({ name: '', description: '' });
        setShowModal(true);
    };

    const handleEdit = (category: any) => {
        setEditId(category._id);
        setFormData({ name: category.name, description: category.description || '' });
        setShowModal(true);
    };

    const submitHandler = async (e: any) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editId) {
                await api.put(`/categories/${editId}`, formData, config);
                toast.success('Cập nhật thành công');
            } else {
                await api.post('/categories', formData, config);
                toast.success('Thêm mới thành công');
            }
            setShowModal(false);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi lưu danh mục');
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản lý Danh Mục</h2>
                <button onClick={handleCreate} className="admin-btn-primary">
                    <FaPlus /> Thêm mới
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Tên danh mục</th>
                            <th>Mô tả</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c: any) => (
                            <tr key={c._id}>
                                <td>{c.name}</td>
                                <td>{c.description}</td>
                                <td>
                                    <div className="admin-action-btns">
                                        <button onClick={() => handleEdit(c)} className="admin-btn-icon edit" title="Sửa"><FaEdit /></button>
                                        <button onClick={() => deleteHandler(c._id)} className="admin-btn-icon delete" title="Xóa"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <form onSubmit={submitHandler} className="admin-modal">
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">
                                {editId ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
                            </h2>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div className="admin-form-group">
                                    <label className="admin-label">Tên danh mục</label>
                                    <input type="text" required className="admin-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="admin-form-group">
                                    <label className="admin-label">Mô tả</label>
                                    <textarea className="admin-input" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button type="button" onClick={() => setShowModal(false)} className="admin-btn-secondary">Hủy</button>
                            <button type="submit" className="admin-btn-primary">{editId ? 'Lưu thay đổi' : 'Thêm mới'}</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CategoryList;
