import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({
    verify: (req, res, buf) => {
        // Lưu raw body cho webhook route để xác minh HMAC signature
        if (req.url === '/sepay/webhook' || req.originalUrl === '/api/payments/sepay/webhook') {
            req.rawBody = buf.toString('utf8');
        }
    }
}));

import Product from './models/Product.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/news', newsRoutes);
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Route test để tạo dữ liệu giả nhằm khởi tạo Database trên MongoCompass
app.get('/api/seed', async (req, res) => {
    try {
        const sampleProduct = new Product({
            name: 'Mật ong rừng nguyên chất (Test)',
            price: 500000,
            description: 'Đây là dữ liệu test để khởi tạo database'
        });
        const createdProduct = await sampleProduct.save();
        res.status(201).json({ message: 'Đã tạo thành công dữ liệu!', data: createdProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
