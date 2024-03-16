import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div>
      <nav className="bg-white border-b border-gray-200 fixed-top p-3">
        <div className="container mx-auto flex items-center">
          <Link href="/" className="text-2xl  text-gray-900">
            Sentiment Dashboard
          </Link>
          <div className="flex space-x-4 ps-8">
            <Link href="/" className="text-gray-400 hover:text-gray-500">
              Home
            </Link>
            <Link href="/compare" className="text-gray-400 hover:text-gray-500">
              Compare
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
