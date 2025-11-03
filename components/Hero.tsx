'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] flex items-center justify-start bg-gray-900 overflow-hidden">
      {/* Background image */}
      <Image
        src="/assets/heroBg.png"
        alt="DDCT Library hero background"
        fill
        className="object-cover opacity-80"
        priority
      />

      {/* Overlay content */}
      <div className="relative z-10 max-w-xl ml-12 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Discover, Read, and Learn.
        </h1>
        <p className="text-lg text-gray-200 mb-6">
          Explore our amazing collection of artbooks and textbooks.
        </p>

        {/* Search bar */}
        <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md w-[400px]">
          <input
            type="text"
            placeholder="Search by title, author, or keyword"
            className="flex-grow px-4 py-2 text-gray-800 focus:outline-none"
          />
          <button className="bg-ddct-orange text-white px-4 py-2 hover:bg-ddct-yellow transition-colors">
            🔍
          </button>
        </div>
      </div>

      {/* Optional overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent" />
    </section>
  );
}