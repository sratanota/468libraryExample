import React from 'react';
import Link from 'next/link';


export default function BookCard({ book }: { book: any }) {
    let authorList:string = '';
    authorList = book.author.map(aut=>aut.name).join(", ");
return (
<article className="border rounded-lg overflow-hidden bg-white">
<img src={book.cover} alt={book.title} className="h-44 w-full object-cover" />
<div className="p-3">
<h3 className="font-semibold">{book.title}</h3>
<p className="text-sm text-gray-600"> {authorList} </p>
<Link href={`/book/${book.isbn}`} className="inline-block mt-2 text-sm text-ddct-orange">View</Link>
</div>
</article>
);
}