'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockLogin } from '../../lib/auth';


export default function Login() {
const router = useRouter();
const [email, setEmail] = useState('');
const [pass, setPass] = useState('');


async function submit(e: React.FormEvent) {
e.preventDefault();
const ok = await mockLogin(email, pass);
if (ok) router.push('/profile');
else alert('Invalid login');
}


return (
<section className="container py-12">
<form onSubmit={submit} className="bg-white p-6 rounded-md max-w-md mx-auto">
<h2 className="text-xl font-bold mb-4">Login</h2>
<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 mb-3 rounded" />
<input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Password" className="w-full border p-2 mb-3 rounded" />
<button type="submit" className="bg-ddct-orange text-white py-2 w-full rounded">Sign in</button>
</form>
</section>
);
}