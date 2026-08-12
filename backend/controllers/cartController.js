import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to calculate total price
const calculateTotalPrice = async (items) => {
    let total = 0;
    for (let item of items) {
        const product = await Product.findById(item.product);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        
        if (!cart) {
            // Create empty cart if it doesn't exist
            cart = await Cart.create({
                user: req.user._id,
                items: [],
                totalPrice: 0
            });
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }
        
        // Check if item already exists in cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        
        if (itemIndex > -1) {
            // Item exists, update quantity
            cart.items[itemIndex].quantity += (quantity || 1);
        } else {
            // Item does not exist, add it
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }
        
        cart.totalPrice = await calculateTotalPrice(cart.items);
        await cart.save();
        
        cart = await cart.populate('items.product');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const productId = req.params.productId;
    
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            cart.totalPrice = await calculateTotalPrice(cart.items);
            await cart.save();
            
            cart = await cart.populate('items.product');
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Product not in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
    const productId = req.params.productId;
    
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.totalPrice = await calculateTotalPrice(cart.items);
        await cart.save();
        
        cart = await cart.populate('items.product');
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
