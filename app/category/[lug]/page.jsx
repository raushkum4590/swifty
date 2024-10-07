"use client"; // Enable hooks

import React, { useEffect, useState } from 'react';
import GlobalApi from '../../_Utils/GlobalApi';
import Link from 'next/link';

const AllResturentsPage = () => {
  const [resturents, setResturents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResturents = async () => {
      try {
        const fetchedResturents = await GlobalApi.GetResturents(); // Fetch all restaurants
        setResturents(fetchedResturents);
      } catch (error) {
        console.error('Error fetching resturents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResturents();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">All Restaurants</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {resturents.length > 0 ? (
            resturents.map((resturent) => (
              <Link key={resturent.id} href={`/resturent/${resturent.slug}`}>
                <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="h-48 overflow-hidden">
                    {resturent.banner && (
                      <img
                        src={resturent.banner.url}
                        alt={resturent.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 truncate">
                      {resturent.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-2 truncate">
                      {resturent.about}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600">No restaurants available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllResturentsPage;
