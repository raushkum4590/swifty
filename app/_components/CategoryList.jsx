// app/components/CategoryList.jsx
"use client"; // Ensure this is at the top of the file

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import GlobalApi from '../_Utils/GlobalApi'; // Adjust the import path as necessary
import { ArrowLeft, ArrowRight } from 'lucide-react';
 // For arrow icons

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null); // Ref to target the scrollable div

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await GlobalApi.GetCategory(); // Call the API function
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Scroll function to handle left and right arrow clicks
  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === 'left') {
      current.scrollLeft -= 200; // Scroll 200px to the left
    } else {
      current.scrollLeft += 200; // Scroll 200px to the right
    }
  };

  return (
    <div className="relative p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Categories</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full"
          >
            <ArrowLeft />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-scroll scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }} // Smooth scrolling
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`} // Create a link to the category page
                >
                  <div className="min-w-[150px] bg-white rounded-lg p-4 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer text-center">
                    {/* Display the icon or image */}
                    {category.icon ? (
                      <img
                        src={category.icon.url}
                        alt={category.name}
                        className="mx-auto w-16 h-16 object-contain mb-2"
                      />
                    ) : (
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 flex items-center justify-center rounded-full">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-600">No categories available</p>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full"
          >
            <ArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
