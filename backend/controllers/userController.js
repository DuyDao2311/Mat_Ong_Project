import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// --- Validation helpers ---
const NAME_REGEX = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])\S{8,64}$/;

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    // --- Backend validation for login ---
    if (!email || !email.trim()) {
        return res.status(400).json({ message: 'Vui lòng nhập Email' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
        return res.status(400).json({ message: 'Email không đúng định dạng' });
    }

    if (!password || password.length === 0) {
        return res.status(400).json({ message: 'Vui lòng nhập mật khẩu' });
    }

    try {
        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, phone, password, confirmPassword, role } = req.body;

    // --- Backend validation for register ---
    const errors = [];

    // Name validation
    if (!name || !name.trim()) {
        errors.push('Họ và tên là bắt buộc');
    } else {
        const trimmedName = name.trim();
        if (trimmedName.length < 2 || trimmedName.length > 50) {
            errors.push('Họ và tên phải có từ 2 đến 50 ký tự');
        } else if (!NAME_REGEX.test(trimmedName)) {
            errors.push('Họ và tên chỉ được chứa chữ cái và khoảng trắng');
        }
    }

    // Email validation
    if (!email || !email.trim()) {
        errors.push('Email là bắt buộc');
    } else {
        const normalizedEmail = email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            errors.push('Email không đúng định dạng');
        }
    }

    // Phone validation
    if (!phone || !phone.trim()) {
        errors.push('Số điện thoại là bắt buộc');
    } else {
        const trimmedPhone = phone.trim();
        if (!/^\d+$/.test(trimmedPhone)) {
            errors.push('Số điện thoại không đúng định dạng');
        } else if (!PHONE_REGEX.test(trimmedPhone)) {
            errors.push('Số điện thoại phải gồm 10 chữ số');
        }
    }

    // Password validation
    if (!password) {
        errors.push('Mật khẩu là bắt buộc');
    } else {
        if (/\s/.test(password)) {
            errors.push('Mật khẩu không được chứa khoảng trắng');
        } else if (password.length < 8) {
            errors.push('Mật khẩu phải có ít nhất 8 ký tự');
        } else if (!PASSWORD_REGEX.test(password)) {
            errors.push('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt');
        }
    }

    // Confirm password validation
    if (!confirmPassword) {
        errors.push('Vui lòng xác nhận mật khẩu');
    } else if (password && confirmPassword !== password) {
        errors.push('Mật khẩu xác nhận không khớp');
    }

    // Return all validation errors at once
    if (errors.length > 0) {
        return res.status(400).json({ message: errors[0] });
    }

    // Normalize data
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    try {
        // Check email duplicate
        const emailExists = await User.findOne({ email: normalizedEmail });
        if (emailExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Check phone duplicate
        const phoneExists = await User.findOne({ phone: trimmedPhone });
        if (phoneExists) {
            return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
        }

        // Tạo unique id (ví dụ)
        const id = 'U' + Date.now();

        const user = await User.create({
            id,
            name: trimmedName,
            email: normalizedEmail,
            phone: trimmedPhone,
            password,
            role: role || 'client', // Default to client if not specified
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Dữ liệu user không hợp lệ' });
        }
    } catch (error) {
        // Handle MongoDB duplicate key error (E11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            if (field === 'email') {
                return res.status(400).json({ message: 'Email đã được sử dụng' });
            }
            if (field === 'phone') {
                return res.status(400).json({ message: 'Số điện thoại đã được sử dụng' });
            }
            return res.status(400).json({ message: 'Dữ liệu đã tồn tại trong hệ thống' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            if (user.role === 'admin') {
                return res.status(400).json({ message: 'Không thể xóa Admin' });
            }
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'Đã xóa người dùng' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { authUser, registerUser, getUsers, deleteUser };
