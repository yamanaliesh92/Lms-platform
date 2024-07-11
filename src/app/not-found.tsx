import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
  return (
    <html>
      <body>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-6 dark:text-white">
              Oops! The page you're looking for doesn't exist.
            </p>
            <Link className="text-blue-500  font-bold" href="/">
              Back to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
