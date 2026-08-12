import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: false },
    subtitle: { type: String, required: false },
    highlight: { type: String, required: false },
    image: { type: String, required: true },
    position: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
