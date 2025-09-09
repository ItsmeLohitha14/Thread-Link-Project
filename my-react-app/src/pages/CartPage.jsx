// src/pages/CartPage.jsx
import React, { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { Trash2, Plus, Minus, ShoppingBag, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, submitRequest } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Validate TOTAL quantity is >= 5 (sum of all cartQuantity)
      const totalRequestedQuantity = cart.reduce((total, item) => {
        return total + (item.cartQuantity || 1);
      }, 0);

      if (totalRequestedQuantity < 5) {
        throw new Error(`Total requested quantity must be at least 5 pieces. Current total: ${totalRequestedQuantity} pieces`);
      }

      // Validate that no item exceeds available stock
      const overstockItems = cart.filter(item => (item.cartQuantity || 1) > item.quantity);
      if (overstockItems.length > 0) {
        const itemNames = overstockItems.map(item => item.title).join(", ");
        throw new Error(`The following items exceed available stock: ${itemNames}`);
      }

      await submitRequest(cart);
      alert("Request submitted successfully! Your items are now in 'My Requests'.");
      navigate("/orphanage-dashboard?tab=requests");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalRequestedQuantity = () => {
    return cart.reduce((total, item) => total + (item.cartQuantity || 1), 0);
  };

  const getOverstockItems = () => {
    return cart.filter(item => (item.cartQuantity || 1) > item.quantity);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some clothes to your cart to make requests</p>
          <button
            onClick={() => navigate("/orphanage-dashboard?tab=browse")}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Browse Clothes
          </button>
        </div>
      </div>
    );
  }

  const totalRequestedQuantity = getTotalRequestedQuantity();
  const overstockItems = getOverstockItems();
  const canSubmit = totalRequestedQuantity >= 5 && overstockItems.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 transition"
            >
              Clear All
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Warning for total quantity */}
          {totalRequestedQuantity < 5 && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                <strong>Minimum Quantity Requirement</strong>
              </div>
              <p className="text-sm">
                Total requested quantity must be at least 5 pieces.
                Current total: <strong>{totalRequestedQuantity}</strong> pieces.
              </p>
              <p className="text-sm mt-1">
                Add more items or increase quantities to meet the requirement.
              </p>
            </div>
          )}

          {/* Warning for overstock items */}
          {overstockItems.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5" />
                <strong>Stock Exceeded</strong>
              </div>
              <p className="text-sm">
                The following items exceed available stock:
              </p>
              <ul className="text-sm mt-2 list-disc list-inside">
                {overstockItems.map(item => (
                  <li key={item._id}>
                    {item.title} (Requested: {item.cartQuantity || 1}, Available: {item.quantity})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            {cart.map((item) => {
              const isOverstock = (item.cartQuantity || 1) > item.quantity;
              
              return (
                <div key={item._id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={item.imageUrl || "/placeholder-image.jpg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.category} • {item.gender}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className={`text-sm ${isOverstock ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                      Available: {item.quantity} pieces
                    </p>
                    {isOverstock && (
                      <p className="text-xs text-red-500 mt-1">
                        You're requesting more than available!
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls with + and - buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item._id, (item.cartQuantity || 1) - 1)}
                      className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                      disabled={(item.cartQuantity || 1) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-medium">
                      {item.cartQuantity || 1}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item._id, (item.cartQuantity || 1) + 1)}
                      className="p-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600">Total Items:</span>
                <p className="text-lg font-semibold">{getCartTotal()} items</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Total Quantity:</span>
                <p className={`text-lg font-semibold ${
                  totalRequestedQuantity >= 5 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {totalRequestedQuantity} pieces
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Minimum requirement (5 pieces):</span>
              <span className={`text-sm font-semibold ${totalRequestedQuantity >= 5 ? 'text-green-600' : 'text-red-600'}`}>
                {totalRequestedQuantity >= 5 ? '✓ Met' : '✗ Not met'}
              </span>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Stock validation:</span>
              <span className={`text-sm font-semibold ${overstockItems.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {overstockItems.length > 0 ? '✗ Issues found' : '✓ All good'}
              </span>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={!canSubmit || isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                canSubmit
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } ${isSubmitting ? 'opacity-50' : ''}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>

            {!canSubmit && (
              <p className="text-sm text-red-600 mt-2 text-center">
                {totalRequestedQuantity < 5 && `Total quantity must be at least 5 pieces (current: ${totalRequestedQuantity}). `}
                {overstockItems.length > 0 && 'Some items exceed available stock. '}
                Please adjust your request.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;