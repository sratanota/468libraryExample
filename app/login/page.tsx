
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import { revalidatePath } from 'next/cache';


export default function Login() {
  const login = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/error?message=${error.message}`);
    }
    
    revalidatePath('/', 'layout');
    return redirect('/profile');
  };

  const signup = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return redirect(`/error?message=${error.message}`);
    }

    if (data.user) {
        const name = data.user.email?.split('@')[0] || 'New User';
        
        const today = new Date();
        const membershipStart = today.toISOString().split('T')[0]; // YYYY-MM-DD
        
        const twoYearsLater = new Date();
        twoYearsLater.setFullYear(today.getFullYear() + 2);
        const membershipEnd = twoYearsLater.toISOString().split('T')[0]; // YYYY-MM-DD
        console.log ("adding patron");
        const { error: insertError } = await supabase.from('patron').insert([
            { 
                userid: data.user.id, 
                email: data.user.email,
                name: name,
                patrontype: 'student',
                membershipstart: membershipStart,
                membershipend: membershipEnd
            }
        ]);
     
        if (insertError) {
            console.log ("insert error")
            return redirect(`/error?message=${insertError.message}`);
        }
    }

    revalidatePath('/', 'layout');
    
    return redirect('/profile');
  };

  return (
    <section className="container py-12">
      <form className="bg-white p-6 rounded-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Login or Sign Up</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <div className="flex justify-between">
          <button
            formAction={login}
            className="bg-ddct-orange text-white py-2 px-4 rounded"
          >
            Login
          </button>
          <button
            formAction={signup}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Sign Up
          </button>
        </div>
      </form>
    </section>
  );
}
