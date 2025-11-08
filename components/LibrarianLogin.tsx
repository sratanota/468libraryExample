
'use client';
import { useState } from 'react';
import { createClient } from '../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LibrarianLogin() {
    const router = useRouter();
    const supabase = createClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            router.refresh();
        }
    };

    return (
        <section className="container py-12">
            <div className="bg-white p-8 rounded-md max-w-md mx-auto shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Librarian Login</h1>
                <p className="mb-6 text-gray-600">You must be logged in as a librarian to add books.</p>
                <form onSubmit={handleLogin}>
                    {error && <p className="mb-4 text-red-500">{error}</p>}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-ddct-orange text-white py-2 px-4 rounded-md hover:bg-ddct-orange/90">
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
}
