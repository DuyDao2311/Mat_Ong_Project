import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const BannerList = () => {
    const { user } = useContext(AuthContext) as any;
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        title: '', subtitle: '', highlight: '', image: '', position: 1, isActive: true
    });
    const [uploading, setUploading] = useState(false);

    const fetchBanners = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/banners/admin', config);
            setBanners(data);
        } catch (error: any) {
            toast.error('Lỗi khi tải danh sách Banner');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn xóa banner này?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await api.delete(`/banners/${id}`, config);
                toast.success('Đã xóa banner');
                fetchBanners();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Lỗi khi xóa banner');
            }
        }
    };

    const handleCreate = () => {
        setEditId(null);
        setFormData({
            title: '', subtitle: '', highlight: '', image: '', position: 1, isActive: true
        });
        setShowModal(true);
    };

    const handleEdit = (banner: any) => {
        setEditId(banner._id);
        setFormData(banner);
        setShowModal(true);
    };

    const uploadFileHandler = async (e: any) => {
        const file = e.target.files[0];
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        setUploading(true);

        try {
            const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const { data } = await axios.post(`${baseUrl}/api/upload`, formDataUpload, config);

            setFormData((prev: any) => ({ ...prev, image: data.image }));
            setUploading(false);
            toast.success('Upload ảnh thành công!');
        } catch (error: any) {
            console.error(error);
            setUploading(false);
            toast.error('Lỗi upload ảnh');
        }
    };

    const submitHandler = async (e: any) => {
        e.preventDefault();
        if (!formData.image) {
            toast.error('Vui lòng upload ảnh banner');
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editId) {
                await api.put(`/banners/${editId}`, formData, config);
                toast.success('Cập nhật banner thành công');
            } else {
                await api.post('/banners', formData, config);
                toast.success('Thêm banner mới thành công');
            }
            setShowModal(false);
            fetchBanners();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi lưu banner');
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    const resolveImageUrl = (url: string) => {
        if (!url) return 'https://placehold.co/400x200?text=No+Image';
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
        return `${baseUrl}${url}`;
    };

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản lý Banners</h2>
                <button onClick={handleCreate} className="admin-btn-primary">
                    <FaPlus /> Thêm mới
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Hình ảnh</th>
                            <th>Vị trí</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map((b: any) => (
                            <tr key={b._id}>
                                <td>
                                    {b.image && (
                                        <img src={resolveImageUrl(b.image)} alt={b.title || 'Banner'} style={{ width: '150px', height: 'auto', borderRadius: '4px' }} />
                                    )}
                                </td>
                                <td>{b.position || 1}</td>
                                <td>
                                    <span style={{ color: b.isActive ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {b.isActive ? 'Đang bật' : 'Đã tắt'}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-action-btns">
                                        <button onClick={() => handleEdit(b)} className="admin-btn-icon edit" title="Sửa"><FaEdit /></button>
                                        <button onClick={() => deleteHandler(b._id)} className="admin-btn-icon delete" title="Xóa"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {banners.length === 0 && <div style={{ padding: '20px', textAlign: 'center' }}>Chưa có banner nào.</div>}
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <form onSubmit={submitHandler} className="admin-modal" style={{ maxWidth: '600px' }}>
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">
                                {editId ? 'Cập nhật Banner' : 'Thêm Banner mới'}
                            </h2>
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-group">
                                <label className="admin-label">Hình ảnh (Upload)</label>
                                <input type="file" onChange={uploadFileHandler} className="admin-input" accept="image/*" />
                                {uploading && <p className="text-sm text-blue-500 mt-1">Đang upload...</p>}
                                {formData.image && (
                                    <div className="mt-2 text-sm text-green-600 font-medium">✓ Đã tải ảnh lên thành công</div>
                                )}
                                {formData.image && (
                                    <img src={resolveImageUrl(formData.image)} alt="Preview" style={{ marginTop: '10px', width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                )}
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-label">Vị trí (1, 2, hoặc 3)</label>
                                <select 
                                    className="admin-input" 
                                    value={formData.position} 
                                    onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
                                >
                                    <option value={1}>Vị trí 1 (Trái)</option>
                                    <option value={2}>Vị trí 2 (Giữa)</option>
                                    <option value={3}>Vị trí 3 (Phải)</option>
                                </select>
                            </div>
                            <div className="admin-form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '15px' }}>
                                <input 
                                    type="checkbox" 
                                    id="isActive" 
                                    checked={formData.isActive} 
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <label htmlFor="isActive" className="admin-label" style={{ marginBottom: 0 }}>Hiển thị Banner này</label>
                            </div>
                        </div>
                        <div className="admin-modal-footer">
                            <button type="button" onClick={() => setShowModal(false)} className="admin-btn-secondary">Hủy</button>
                            <button type="submit" className="admin-btn-primary" disabled={uploading}>
                                {editId ? 'Lưu thay đổi' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BannerList;
