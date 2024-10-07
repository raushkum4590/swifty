"use client"; // This marks the component as a Client Component

import React, { useState, useEffect } from 'react';
import Header from '@/app/_components/Header'; // Import the Header component
import Cart from '@/app/_components/Cart'; // Import the Cart component

const CheckoutPage = ({ params }) => {
  const { slug } = params;
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Load cart from local storage when the component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart)); // Parse the cart data and set it to state
    }
  }, []);

  // Calculate the total price whenever the cart changes
  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cart]);

  const placeOrder = () => {
    // Logic to handle order placement (e.g., API call to process the order)
    setOrderPlaced(true);
    setCart([]); // Clear the cart after placing the order
    localStorage.removeItem('cart'); // Remove the cart from local storage
  };

  const removeFromCart = (id) => {
    setCart((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
      return updatedCart;
    });
  };

  return (
    <div>
      <Header cartItems={cart} setCart={setCart} slug={slug} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Checkout for {slug}</h1>

        {/* Cart Summary */}
        <div className="bg-white p-4 shadow-md rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
          <Cart cartItems={cart} removeFromCart={removeFromCart} />
          <hr className="my-4" />
          <div className="text-right font-bold">Total: ${totalPrice.toFixed(2)}</div>
        </div>

        {/* Checkout Form */}
        {!orderPlaced && cart.length > 0 && (
          <div className="bg-white p-4 shadow-md rounded-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Checkout Form</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700">Name:</label>
                <input type="text" className="w-full p-2 border rounded-md" placeholder="Your Name" required />
              </div>
              <div>
                <label className="block text-gray-700">Address:</label>
                <input type="text" className="w-full p-2 border rounded-md" placeholder="Your Address" required />
              </div>
              <div>
                <label className="block text-gray-700">Payment Method:</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Credit Card</option>
                  <option>PayPal</option>
                  <option>Cash on Delivery</option>
                </select>
              </div>
            </form>
            <button 
              onClick={placeOrder} 
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md"
            >
              Place Order
            </button>
          </div>
        )}

        {/* Order Confirmation */}
        {orderPlaced && (
          <div className="bg-green-100 p-4 shadow-md rounded-md text-green-800">
            <h2 className="text-xl font-semibold mb-4">Order Placed Successfully!</h2>
            <p>Thank you for your order. Your food will be delivered soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
