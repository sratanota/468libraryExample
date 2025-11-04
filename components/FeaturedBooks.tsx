"use client"
import React, { useState } from 'react';
import BookCard from './BookCard';

export default function FeaturedBooks({ books, sectionName }: { books: any[]; sectionName: string }) {
    if (!books) {
        return null;
    }
    const [currentPage, setCurrentPage] = useState(0);
    const booksPerPage = 4;
    const totalPages = Math.ceil(books.length / booksPerPage);

    const next = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prev = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <section className="container py-12">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{sectionName}</h2>
                <div className="flex gap-2">
                    <button onClick={prev} className="bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button onClick={next} className="bg-gray-800 text-white p-2 rounded-full shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
            <div className="relative overflow-hidden mt-6">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentPage * 100}%)` }}>
                    {Array.from({ length: totalPages }).map((_, pageIndex) => (
                        <div key={pageIndex} className="min-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {books.slice(pageIndex * booksPerPage, (pageIndex + 1) * booksPerPage).map((b) => (
                                <BookCard book={b.book} key={b.copyid} />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}