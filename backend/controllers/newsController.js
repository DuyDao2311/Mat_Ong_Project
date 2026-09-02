import News from '../models/News.js';

// @desc    Get all news
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res) => {
    try {
        const news = await News.find({}).sort({ createdAt: -1 });
        res.json(news);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single news
// @route   GET /api/news/:id
// @access  Public
export const getNewsById = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);
        if (news) {
            res.json(news);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a news article
// @route   POST /api/news
// @access  Private/Admin
export const createNews = async (req, res) => {
    try {
        const { title, image, content, link, isActive } = req.body;
        
        const news = new News({
            title,
            image,
            content,
            link,
            isActive
        });

        const createdNews = await news.save();
        res.status(201).json(createdNews);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a news article
// @route   PUT /api/news/:id
// @access  Private/Admin
export const updateNews = async (req, res) => {
    try {
        const { title, image, content, link, isActive } = req.body;
        
        const news = await News.findById(req.params.id);

        if (news) {
            news.title = title || news.title;
            news.image = image || news.image;
            news.content = content || news.content;
            news.link = link !== undefined ? link : news.link;
            news.isActive = isActive !== undefined ? isActive : news.isActive;

            const updatedNews = await news.save();
            res.json(updatedNews);
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
export const deleteNews = async (req, res) => {
    try {
        const news = await News.findById(req.params.id);

        if (news) {
            await news.deleteOne();
            res.json({ message: 'Đã xóa bài viết' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
