import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import axios from 'axios';

const ProductList = () => {
    const { user } = useContext(AuthContext) as any;
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Form state
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({
        name: '', price: '', description: '', category: '', origin: '', weight: '', countInStock: '', images: [] as string[]
    });
    const [uploading, setUploading] = useState(false);

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (error: any) {
            toast.error('Lỗi khi tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error: any) {
            console.error('Lỗi khi tải danh mục');
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const deleteHandler = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn xóa sản phẩm này?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await api.delete(`/products/${id}`, config);
                toast.success('Đã xóa sản phẩm');
                fetchProducts();
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Lỗi khi xóa');
            }
        }
    };

    const handleCreate = () => {
        setEditId(null);
        setFormData({
            name: '', price: '', description: '', category: '', origin: '', weight: '', countInStock: '', images: [] as string[]
        });
        setShowModal(true);
    };

    const handleEdit = (product: any) => {
        setEditId(product._id);
        setFormData(product);
        setShowModal(true);
    };

    const uploadFileHandler = async (e: any) => {
        const file = e.target.files[0];
        const formDataUpload = new FormData();
        formDataUpload.append('image', file);
        setUploading(true);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            // Ensure proper URL based on API base URL config
            const { data } = await axios.post('http://localhost:5000/api/upload', formDataUpload, config);

            // Set image URL
            setFormData((prev: any) => ({ ...prev, images: [data.image] }));
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
        try {
            const submitData = {
                ...formData,
                price: Number(formData.price),
                countInStock: Number(formData.countInStock)
            };
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (editId) {
                await api.put(`/products/${editId}`, submitData, config);
                toast.success('Cập nhật thành công');
            } else {
                await api.post('/products', submitData, config);
                toast.success('Thêm mới thành công');
            }
            setShowModal(false);
            fetchProducts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi lưu sản phẩm');
        }
    };

    // Lấy danh sách sản phẩm cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản lý Sản Phẩm</h2>
                <button onClick={handleCreate} className="admin-btn-primary">
                    <FaPlus /> Thêm mới
                </button>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Hình ảnh</th>
                            <th>Tên</th>
                            <th>Dung tích</th>
                            <th>Giá</th>
                            <th>Phân loại</th>
                            <th>Tồn kho</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.map((p: any, index: number) => (
                            <tr key={p._id}>
                                <td>{indexOfFirstProduct + index + 1}</td>
                                <td>
                                    {p.images?.length > 0 && (
                                        <img src={p.images[0].startsWith('http') ? p.images[0] : `http://localhost:5000${p.images[0]}`} alt={p.name} className="admin-product-img" />
                                    )}
                                </td>
                                <td>{p.name}</td>
                                <td>{p.weight || '500ml'}</td>
                                <td style={{ color: 'var(--admin-primary)', fontWeight: '600' }}>{p.price.toLocaleString()}đ</td>
                                <td>{p.category}</td>
                                <td>{p.countInStock}</td>
                                <td>
                                    <div className="admin-action-btns">
                                        <button onClick={() => handleEdit(p)} className="admin-btn-icon edit" title="Sửa"><FaEdit /></button>
                                        <button onClick={() => deleteHandler(p._id)} className="admin-btn-icon delete" title="Xóa"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="plp-pagination" style={{ margin: '20px auto 30px' }}>
                    <button
                        className="plp-page-btn nav-btn"
                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                    ><FaAngleLeft /></button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            className={`plp-page-btn ${currentPage === page ? 'active' : ''}`}
                            onClick={() => handlePageChange(page)}
                        >{page}</button>
                    ))}

                    <button
                        className="plp-page-btn nav-btn"
                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    ><FaAngleRight /></button>
                </div>
            )}

            {/* Edit Modal */}
            {showModal && (
                <div className="admin-modal-overlay">
                    <form onSubmit={submitHandler} className="admin-modal">
                        <div className="admin-modal-header">
                            <h2 className="admin-modal-title">
                                {editId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                            </h2>
                        </div>
                        <div className="admin-modal-body">
                                <div className="admin-form-grid">
                                    <div className="admin-form-group">
                                        <label className="admin-label">Tên sản phẩm</label>
                                        <input type="text" required className="admin-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Giá (VNĐ)</label>
                                        <input type="number" required className="admin-input" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Hình ảnh (Upload)</label>
                                        <input type="file" onChange={uploadFileHandler} className="admin-input" />
                                        {uploading && <p className="text-sm text-blue-500 mt-1">Đang upload...</p>}
                                        {formData.images?.length > 0 && (
                                            <div className="mt-2 text-sm text-green-600 font-medium">✓ Đã tải ảnh lên thành công</div>
                                        )}
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Danh mục</label>
                                        <select required className="admin-input" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="" disabled>-- Chọn danh mục --</option>
                                            {categories.map((c: any) => (
                                                <option key={c._id} value={c.name}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Xuất xứ</label>
                                        <input type="text" required className="admin-input" value={formData.origin} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Trọng lượng/Dung tích</label>
                                        <input type="text" required className="admin-input" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                                    </div>
                                    <div className="admin-form-group">
                                        <label className="admin-label">Tồn kho</label>
                                        <input type="number" required className="admin-input" value={formData.countInStock} onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })} />
                                    </div>
                                    <div className="admin-form-group full-width">
                                        <label className="admin-label">Mô tả</label>
                                        <textarea required className="admin-input" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
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

export default ProductList;
