import { useEffect, useState, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ContactList = () => {
    const { user } = useContext(AuthContext) as any;
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const fetchContacts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await api.get('/contacts', config);
            setContacts(data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách liên hệ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchContacts();
    }, [user]);

    const handleReply = async () => {
        if (!replyMessage.trim()) {
            toast.error('Vui lòng nhập nội dung phản hồi.');
            return;
        }

        setIsSending(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await api.post(`/contacts/${selectedContact._id}/reply`, { replyMessage }, config);
            toast.success('Phản hồi đã được gửi thành công đến email khách hàng.');
            setSelectedContact(null);
            setReplyMessage('');
            fetchContacts();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Gửi phản hồi thất bại.');
        } finally {
            setIsSending(false);
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Chưa phản hồi';
            case 'RESPONDED': return 'Đã phản hồi';
            default: return status;
        }
    };

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'PENDING': return 'admin-badge user';
            case 'RESPONDED': return 'admin-badge admin';
            default: return 'admin-badge';
        }
    };

    return (
        <div>
            <div className="admin-page-header">
                <h2 className="admin-page-title">Quản lý Liên Hệ</h2>
            </div>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Thời gian</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((c: any, index: number) => (
                            <tr key={c._id} onClick={() => { setSelectedContact(c); setReplyMessage(''); }} style={{ cursor: 'pointer' }} className="admin-table-row-hover">
                                <td>{index + 1}</td>
                                <td>{new Date(c.createdAt).toLocaleString('vi-VN')}</td>
                                <td>{c.name}</td>
                                <td>{c.email}</td>
                                <td>{c.phone}</td>
                                <td>
                                    <span className={getStatusClass(c.status)}>
                                        {getStatusText(c.status)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {contacts.length === 0 && <div style={{ textAlign: 'center', padding: '20px' }}>Chưa có liên hệ nào.</div>}
            </div>

            {/* Chi tiết tin nhắn (Modal) */}
            {selectedContact && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        background: '#fff', padding: '30px', borderRadius: '8px',
                        width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <h3 style={{ margin: 0, color: '#333' }}>Chi tiết tin nhắn</h3>
                            <button onClick={() => setSelectedContact(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>&times;</button>
                        </div>

                        <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px' }}>
                            <strong>Người gửi:</strong> <span>{selectedContact.name}</span>
                            <strong>Email:</strong> <span>{selectedContact.email}</span>
                            <strong>Số điện thoại:</strong> <span>{selectedContact.phone}</span>
                            <strong>Thời gian:</strong> <span>{new Date(selectedContact.createdAt).toLocaleString('vi-VN')}</span>
                            <strong>Trạng thái:</strong>
                            <span>
                                <span className={getStatusClass(selectedContact.status)}>
                                    {getStatusText(selectedContact.status)}
                                </span>
                            </span>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            <strong>Nội dung:</strong>
                            <div style={{
                                background: '#f9f9f9', padding: '15px', marginTop: '10px',
                                borderRadius: '4px', borderLeft: '4px solid #f59e0b',
                                whiteSpace: 'pre-wrap', lineHeight: '1.6'
                            }}>
                                {selectedContact.message}
                            </div>
                        </div>

                        {/* Phần trả lời */}
                        {selectedContact.status !== 'RESPONDED' && (
                            <div style={{ marginTop: '20px' }}>
                                <strong>Phản hồi cho khách hàng:</strong>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Nhập nội dung phản hồi..."
                                    rows={4}
                                    style={{
                                        width: '100%', marginTop: '10px', padding: '12px',
                                        borderRadius: '4px', border: '1px solid #ddd',
                                        fontSize: '0.95rem', lineHeight: '1.5', resize: 'vertical',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        )}

                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedContact(null)}
                                style={{ padding: '8px 16px', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Đóng
                            </button>
                            {selectedContact.status !== 'RESPONDED' && (
                                <button
                                    onClick={handleReply}
                                    disabled={isSending}
                                    style={{
                                        padding: '8px 16px', background: isSending ? '#93c5fd' : '#3b82f6', color: 'white',
                                        border: 'none', borderRadius: '4px',
                                        cursor: isSending ? 'not-allowed' : 'pointer', fontWeight: 'bold'
                                    }}
                                >
                                    {isSending ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactList;
