"use client"; // Ensure this is at the top to mark the component as a Client Component

import GlobalApi from '@/app/_Utils/GlobalApi';
import RestroTabs from '@/app/RestroTabs';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importing useRouter to navigate to the cart
import Header from '@/app/_components/Header'; // Import the Header component

const ResturentPage = ({ params }) => {
  const { slug } = params; // Extract the slug from the URL parameters
  const [resturent, setResturent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]); // State for cart items
  const router = useRouter(); // Hook to navigate to other pages

  useEffect(() => {
    const fetchResturent = async () => {
      try {
        const foundResturent = await GlobalApi.GetResturentDetails(slug);
        setResturent(foundResturent);
        initializeQuantities(foundResturent.menu); // Initialize quantity state
      } catch (error) {
        console.error('Error fetching resturent:', error);
        setError('Failed to fetch restaurant details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResturent();
  }, [slug]);

  // Initialize quantities for each menu item
  const initializeQuantities = (menu) => {
    const initialQuantities = {};
    menu?.forEach(({ menuItem }) => {
      menuItem.forEach(({ id }) => {
        initialQuantities[id] = 1; // Set default quantity to 1
      });
    });
    setQuantities(initialQuantities);
  };

  // Handle increment/decrement of quantity
  const handleQuantityChange = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta), // Ensure quantity doesn't go below 1
    }));
  };

  // Add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart((prev) => 
        prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantities[item.id] }
            : cartItem
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item, quantity: quantities[item.id] }]);
    }
    alert(`${item.name} added to cart!`); // Alert to confirm addition
  };

  // Count items in the cart
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!resturent) return <p>Resturent not found</p>;

  const { name, banner, about, address, restroType, workingHour, menu } = resturent;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <Header cartItems={cart} setCart={setCart} slug={slug} /> {/* Pass cart and setCart to Header */}
      
      <img src={banner.url} alt={name} className="w-full h-64 object-cover rounded-lg mb-6 shadow-md" />
      <p className="text-gray-700 text-lg mb-4">{about}</p>
      <p className="text-gray-500 mb-2"><strong>Address:</strong> {address}</p>
      <p className="text-gray-500 mb-2"><strong>Type:</strong> {restroType}</p>
      <p className="text-gray-500 mb-6"><strong>Working Hours:</strong> {workingHour}</p>

      <h3 className="text-2xl font-semibold mt-6 mb-4">Menu</h3>
      <RestroTabs resturent={resturent} />

      {(!menu || !menu.length) ? (
        <p>No menu items available.</p>
      ) : (
        <div className="menu-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu.map(({ id, category, menuItem }) => (
            <div key={id} className="menu-category p-4 border rounded-lg shadow-sm bg-white">
              <h4 className="text-xl font-semibold mb-4 text-indigo-600">{category}</h4>
              <ul>
                {menuItem.map(({ id, name, price, productImage }) => (
                  <li key={id} className="menu-item flex items-center justify-between mb-4">
                    <div className="item-details flex items-center">
                      <div>
                        <p className="text-lg font-medium">{name}</p>
                        <p className="text-gray-500">${price}</p>
                      </div>
                    </div>

                    <div className="quantity-controls flex items-center ml-4">
                      <button
                        onClick={() => handleQuantityChange(id, -1)}
                        className="px-2 py-1 border rounded-l-md text-gray-700 bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b text-gray-700">{quantities[id] || 1}</span>
                      <button
                        onClick={() => handleQuantityChange(id, 1)}
                        className="px-2 py-1 border rounded-r-md text-gray-700 bg-gray-200"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => addToCart({ id, name, price, productImage, quantity: quantities[id] })} 
                      className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded-md"
                    >
                      Add to Cart
                    </button>

                    {productImage && (
                      <img
                        src={productImage.url}
                        alt={name}
                        className="w-16 h-16 object-cover rounded-lg ml-4 shadow-md"
                      />
                    )}
                  </li>
                ))} 
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResturentPage;
