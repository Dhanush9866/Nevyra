import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-blue-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center border border-blue-100">
        <div className="flex flex-col items-center mb-6">
          <span className="text-7xl font-extrabold text-blue-500 mb-2 drop-shadow-lg">
            404
          </span>
          <span className="inline-block w-16 h-1 bg-blue-200 rounded mb-2"></span>
        </div>
        <h1 className="text-2xl font-semibold mb-2 text-gray-800">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow hover:bg-blue-600 transition-colors duration-200"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
