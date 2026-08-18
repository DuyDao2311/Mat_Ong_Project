import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export interface CartItem {
    product: any; // Mongoose populated product object
    quantity: number;
    _id?: string;
}

interface CartContextType {
    cartItems: CartItem[];
    totalPrice: number;
    addToCart: (product: any, quantity?: number) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // Fetch or Load Cart
    useEffect(() => {
        const fetchCart = async () => {
            if (user) {
                try {
                    // Sync local storage cart to backend on login
                    const localCart = localStorage.getItem('guestCart');
                    if (localCart) {
                        const parsedLocal = JSON.parse(localCart);
                        if (parsedLocal.length > 0) {
                            for (let item of parsedLocal) {
                                await api.post('/cart', { productId: item.product._id, quantity: item.quantity });
                            }
                            localStorage.removeItem('guestCart');
                        }
                    }

                    const { data } = await api.get('/cart');
                    setCartItems(data.items);
                    setTotalPrice(data.totalPrice);
                } catch (error) {
                    console.error("Error fetching cart", error);
                }
            } else {
                const localCart = localStorage.getItem('guestCart');
                if (localCart) {
                    const parsed = JSON.parse(localCart);
                    setCartItems(parsed);
                    calculateLocalTotal(parsed);
                } else {
                    setCartItems([]);
                    setTotalPrice(0);
                }
            }
        };
        fetchCart();
    }, [user]);

    const calculateLocalTotal = (items: CartItem[]) => {
        let total = 0;
        items.forEach(item => {
            total += (item.product.price || 0) * item.quantity;
        });
        setTotalPrice(total);
    };

    const addToCart = async (product: any, quantity: number = 1) => {
        if (user) {
            try {
                const { data } = await api.post('/cart', { productId: product._id, quantity });
                setCartItems(data.items);
                setTotalPrice(data.totalPrice);
                // toast.success('Đã thêm vào giỏ hàng!');
            } catch (error) {
                console.error("Add to cart error", error);
                toast.error('Lỗi khi thêm vào giỏ hàng');
            }
        } else {
            // Local Storage Logic
            const updatedCart = [...cartItems];
            const existingItem = updatedCart.find(item => item.product._id === product._id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                updatedCart.push({ product, quantity });
            }
            setCartItems(updatedCart);
            calculateLocalTotal(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
            // toast.success('Đã thêm vào giỏ hàng!');
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        if (user) {
            try {
                const { data } = await api.put(`/cart/${productId}`, { quantity });
                setCartItems(data.items);
                setTotalPrice(data.totalPrice);
            } catch (error) {
                console.error("Update quantity error", error);
            }
        } else {
            const updatedCart = cartItems.map(item =>
                item.product._id === productId ? { ...item, quantity } : item
            );
            setCartItems(updatedCart);
            calculateLocalTotal(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
    };

    const removeFromCart = async (productId: string) => {
        if (user) {
            try {
                const { data } = await api.delete(`/cart/${productId}`);
                setCartItems(data.items);
                setTotalPrice(data.totalPrice);
            } catch (error) {
                console.error("Remove from cart error", error);
            }
        } else {
            const updatedCart = cartItems.filter(item => item.product._id !== productId);
            setCartItems(updatedCart);
            calculateLocalTotal(updatedCart);
            localStorage.setItem('guestCart', JSON.stringify(updatedCart));
        }
    };

    const clearCart = async () => {
        if (user) {
            try {
                const { data } = await api.delete('/cart');
                setCartItems(data.items);
                setTotalPrice(data.totalPrice);
            } catch (error) {
                console.error("Clear cart error", error);
            }
        } else {
            setCartItems([]);
            setTotalPrice(0);
            localStorage.removeItem('guestCart');
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, totalPrice, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
