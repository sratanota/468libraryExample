'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function SearchBar() {
const router = useRouter();
const [q, setQ] = useState('');
return (
<form
onSubmit={e => {
e.preventDefault();
router.push(`/search?q=${encodeURIComponent(q)}`);
}}
className="flex gap-2"
>
<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by title, author, or ISBN" className="flex-1 rounded-md p-2" />
<button type="submit" className="bg-ddct-bluegray text-white px-4 rounded-md">Search</button>
</form>
);
}