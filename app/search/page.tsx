import React from 'react';
import { searchBooks } from '../../lib/books';


type Props = { searchParams?: { q?: string } };


export default function SearchPage({ searchParams }: Props) {
const q = searchParams?.q || '';
const results = searchBooks(q);
return (
<section className="container py-12">
<h1 className="text-2xl font-bold">Results for "{q}"</h1>
<div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
{results.map(b => (
<div key={b.id} className="bg-white p-4 rounded shadow">
<h3 className="font-semibold">{b.title}</h3>
<p className="text-sm text-gray-600">{b.author}</p>
</div>
))}
</div>
</section>
);
}