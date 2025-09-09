// src/contexts/CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item => item._id === action.payload._id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item._id === action.payload._id
                            ? { ...item, cartQuantity: (item.cartQuantity || 1) + 1 }
                            : item
                    )
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, cartQuantity: 1 }]
            };

        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)
            };

        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item._id === action.payload.id
                        ? { ...item, cartQuantity: Math.max(1, action.payload.quantity) }
                        : item
                )
            };

        case 'CLEAR_CART':
            return {
                ...state,
                items: []
            };

        case 'LOAD_CART':
            return {
                ...state,
                items: action.payload || []
            };

        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('orphanageCart');
        if (savedCart) {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('orphanageCart', JSON.stringify(state.items));
    }, [state.items]);

    const addToCart = (item) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
    };

    const removeFromCart = (itemId) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    };

    const updateQuantity = (itemId, quantity) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartTotal = () => {
        return state.items.reduce((total, item) => total + (item.cartQuantity || 1), 0);
    };

    const getCartItemsCount = () => {
        return state.items.length;
    };

    const submitRequest = async (cartItems) => {
        try {
            // Validate that TOTAL quantity is >= 5 (sum of all cartQuantity)
            const totalRequestedQuantity = cartItems.reduce((total, item) => {
                return total + (item.cartQuantity || 1);
            }, 0);

            if (totalRequestedQuantity < 5) {
                throw new Error(`Total requested quantity must be at least 5 pieces. Current: ${totalRequestedQuantity}`);
            }

            // Validate that no item exceeds available stock
            const overstockItems = cartItems.filter(item => (item.cartQuantity || 1) > item.quantity);
            if (overstockItems.length > 0) {
                const itemNames = overstockItems.map(item => item.title).join(", ");
                throw new Error(`The following items exceed available stock: ${itemNames}`);
            }

            // Prepare items for API request
            const requestItems = cartItems.map(item => ({
                donation: item._id,
                requestedQuantity: item.cartQuantity || 1,
                title: item.title,
                category: item.category,
                size: item.size,
                gender: item.gender,
                condition: item.condition,
                imageUrl: item.imageUrl,
            }));

            // Make API call to create request in MongoDB
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }

            const response = await fetch('http://localhost:5000/api/orphanage-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: requestItems,
                    notes: "Request from orphanage cart"
                })
            });

            // Get response text first to handle both JSON and text errors
            const responseText = await response.text();
            
            if (!response.ok) {
                let errorMessage = `Server error: ${response.status} ${response.statusText}`;
                
                // Try to parse as JSON, otherwise use raw text
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || responseText;
                } catch {
                    errorMessage = responseText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }

            // Parse successful response as JSON
            const requestData = JSON.parse(responseText);
            console.log('Request submitted successfully:', requestData);

            // Clear cart after successful submission
            clearCart();

            return {
                success: true,
                message: "Request submitted successfully!",
                data: requestData
            };
        } catch (error) {
            console.error('Error submitting request:', error);
            throw error;
        }
    };

    const fetchMyRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('http://localhost:5000/api/orphanage-requests/my-requests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Get response text first
            const responseText = await response.text();
            
            if (!response.ok) {
                let errorMessage = `Server error: ${response.status}`;
                
                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || responseText;
                } catch {
                    errorMessage = responseText || errorMessage;
                }
                
                throw new Error(errorMessage);
            }

            // Parse successful response
            return JSON.parse(responseText);
        } catch (error) {
            console.error('Error fetching requests:', error);
            throw error;
        }
    };

    return (
        <CartContext.Provider value={{
            cart: state.items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartItemsCount,
            submitRequest,
            fetchMyRequests
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};