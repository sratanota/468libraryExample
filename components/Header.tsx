'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-ddct-black text-white shadow-md">
      <div className="flex items-center gap-3">
        <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="DDCT Library Logo"
            width={48}
            height={48}
            className="rounded-md"
            priority
          />
        </Link>
        <Link href="/" className="text-2xl font-bold tracking-tight">
          DDCT Library
        </Link>
      </div>

      <nav className="flex gap-6 text-lg">
        <Link href="/profile" className="hover:text-ddct-yellow">Profile</Link>
        <Link href="/login" className="hover:text-ddct-yellow">Login</Link>
      </nav>
    </header>
  );
}
