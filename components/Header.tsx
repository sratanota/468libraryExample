
import Image from 'next/image';
import Link from 'next/link';

import { cookies } from "next/headers";
import { createClient } from "../lib/supabase/server";

export default async function Header() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();
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
        {user ? (<a href="/api/auth/logout" className="hover:text-ddct-yellow">Log Out</a>)
          : (<Link href="/login" className="hover:text-ddct-yellow">Login</Link>)
        }

      </nav>
    </header>
  );
}
