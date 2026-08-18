import Product from '../models/Product.js';
import Banner from '../models/Banner.js';

// @desc    Search products and banners (blog posts) by keyword
// @route   GET /api/search?q=keyword
// @access  Public
const searchAll = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword || keyword.trim().length === 0) {
            return res.json({ products: [], banners: [] });
        }

        const regex = new RegExp(keyword.trim(), 'i');

        // Search products by name, description, category
        const products = await Product.find({
            $or: [
                { name: { $regex: regex } },
                { description: { $regex: regex } },
                { category: { $regex: regex } },
            ],
        }).limit(10);

        // Search banners (blog posts) by title, subtitle
        const banners = await Banner.find({
            isActive: true,
            $or: [
                { title: { $regex: regex } },
                { subtitle: { $regex: regex } },
            ],
        }).limit(10);

        res.json({
            products,
            banners,
            totalProducts: await Product.countDocuments({
                $or: [
                    { name: { $regex: regex } },
                    { description: { $regex: regex } },
                    { category: { $regex: regex } },
                ],
            }),
            totalBanners: await Banner.countDocuments({
                isActive: true,
                $or: [
                    { title: { $regex: regex } },
                    { subtitle: { $regex: regex } },
                ],
            }),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { searchAll };
