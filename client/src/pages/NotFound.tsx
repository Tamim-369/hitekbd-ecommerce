import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-4xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-4 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
