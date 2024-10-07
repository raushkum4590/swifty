"use client"; // Ensure this is at the top of the file

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import Next.js router
import GlobalApi from "../_Utils/GlobalApi"; // Adjust the import path if necessary
import { Star, StarHalf } from "lucide-react";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Error state
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    getRestaurantsList();
  }, []);

  const getRestaurantsList = async () => {
    try {
      const resp = await GlobalApi.GetResturents(); // Fetch the restaurants from the API
      setRestaurants(resp); // Set the restaurants directly as they are already in the desired format
      setLoading(false); // Stop loading when data is received
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setError("Failed to load restaurants. Please try again later.");
      setLoading(false); // Stop loading even if there's an error
    }
  };

  // Navigate to a dynamic route based on restaurant slug
  const navigateToRestaurant = (slug) => {
    router.push(`/resturent/${slug}`); // Adjusting for the dynamic slug route
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Popular Restaurants</h2>

      {loading ? (
        <p className="text-gray-600">Loading restaurants...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p> // Display error message if failed
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.length === 0 ? ( // Check if the restaurants array is empty
            <p className="text-gray-600">No restaurants found.</p>
          ) : (
            restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => navigateToRestaurant(restaurant.slug)} // Add click handler for navigation
                className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                {/* Banner */}
                {restaurant.banner && (
                  <img
                    src={restaurant.banner.url}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                {/* Restaurant Details */}
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">
                    {restaurant.name}
                  </h3>
                  {/* Star Rating */}
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                    <Star className="text-yellow-500" />
                    {/* Add additional stars or logic for half stars here if needed */}
                    <StarHalf className="text-yellow-500" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantsList;
