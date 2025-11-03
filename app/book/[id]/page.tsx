import React from 'react';
import { getBookById } from '../../../lib/books';


type Props = { params: { id: string } };


export default function BookPage({ params }: Props) {
const book = getBookById(params.id);
if (!book) return <div className="container py-12">Book not found</div>;
return (
<section className="container py-12 grid md:grid-cols-3 gap-8">
<img src={book.cover} alt={book.title} className="w-full h-auto" />
<div className="md:col-span-2">
<h1 className="text-3xl font-bold">{book.title}</h1>
<p className="text-gray-700 mt-4">{book.description}</p>
</div>
</section>
);
}