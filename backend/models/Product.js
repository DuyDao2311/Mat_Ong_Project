import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true, // Thường id nên là duy nhất
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        discountPrice: {
            type: Number,
            default: 0,
        },
        images: [
            {
                type: String,
                required: true,
            }
        ],
        category: {
            type: String,
            required: true,
        },
        origin: {
            type: String,
            required: true,
        },
        weight: {
            type: String,
            required: true,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
