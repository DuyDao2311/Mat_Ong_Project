import Banner from '../models/Banner.js';

// @desc    Lấy danh sách banners public
// @route   GET /api/banners
// @access  Public
export const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Lấy tất cả banners cho Admin
// @route   GET /api/banners/admin
// @access  Private/Admin
export const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ createdAt: -1 });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// @desc    Tạo banner mới
// @route   POST /api/banners
// @access  Private/Admin
export const createBanner = async (req, res) => {
    const { title, subtitle, highlight, image, position, isActive } = req.body;

    try {
        const banner = new Banner({
            title,
            subtitle,
            highlight,
            image,
            position,
            isActive
        });

        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        res.status(400).json({ message: 'Không thể tạo banner', error: error.message });
    }
};

// @desc    Cập nhật banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
export const updateBanner = async (req, res) => {
    const { title, subtitle, highlight, image, position, isActive } = req.body;

    try {
        const banner = await Banner.findById(req.params.id);

        if (banner) {
            banner.title = title !== undefined ? title : banner.title;
            banner.subtitle = subtitle !== undefined ? subtitle : banner.subtitle;
            banner.highlight = highlight !== undefined ? highlight : banner.highlight;
            banner.image = image || banner.image;
            banner.position = position !== undefined ? position : banner.position;
            banner.isActive = isActive !== undefined ? isActive : banner.isActive;

            const updatedBanner = await banner.save();
            res.json(updatedBanner);
        } else {
            res.status(404).json({ message: 'Không tìm thấy banner' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Lỗi cập nhật banner', error: error.message });
    }
};

// @desc    Xóa banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (banner) {
            await banner.deleteOne();
            res.json({ message: 'Đã xóa banner' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy banner' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa banner', error: error.message });
    }
};
