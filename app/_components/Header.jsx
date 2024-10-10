import React from 'react';
import Image from 'next/image';
import { Search, ShoppingCart } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Cart from './Cart';

const Header = ({ cartItems = [], setCart }) => {
  const removeFromCart = (id) => {
    setCart((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  // Calculate the total price of the items in the cart
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Function to handle Stripe checkout redirection
  const handleCheckout = async () => {
    if (cartItems.length > 0) {
      try {
        const response = await fetch('/api/checkout_sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: cartItems, // Passing cart items to the backend
          }),
        });

        const session = await response.json();
        if (session.url) {
          // Redirect to Stripe checkout page
          window.location.href = session.url;
        } else {
          console.error('Error creating session:', session.error);
        }
      } catch (error) {
        console.error('Error creating Stripe session:', error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 md:px-20 shadow-sm bg-white">
      <div className="flex-shrink-0 mb-4 md:mb-0">
        <Image src="/logo.jpg" alt="Logo" width={100} height={50} />
      </div>
      <div className="flex items-center border p-2 rounded-lg bg-gray-200 w-full md:w-96 mb-4 md:mb-0">
        <input type="text" className="flex-grow bg-transparent outline-none px-2" placeholder="Search..." />
        <Search className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex gap-5 items-center">
        <Popover>
          <PopoverTrigger>
            <div className="flex gap-2 items-center cursor-pointer">
              <ShoppingCart />
              <label className="p-1 px-2 rounded-full bg-slate-200">{cartItems.length || 0}</label>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="p-4">
              <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
            </div>
          </PopoverContent>
        </Popover>
        <UserButton showName />
      </div>

      {/* Checkout button with total amount reflected */}
      <div>
        {cartItems.length > 0 ? (
          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Checkout (${totalAmount.toFixed(2)}) {/* Display total amount */}
          </button>
        ) : (
          <button disabled className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed">
            Cart is Empty
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
