import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function Profile() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: patron, error: patronError } = await supabase
    .from('patron')
    .select('*')
    .eq('userid', user.id)
    .single();

  if (patronError && patronError.code !== 'PGRST116') { // PGRST116: no rows found
    return redirect(`/error?message=${patronError.message}`);
  }

  if (!patron) {
    return redirect('/error?message=Profile is only for patrons');
  }

  const updateProfile = async (formData: FormData) => {
    'use server';

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const avatarFile = formData.get('avatar') as File;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');

    const { data: existingPatron, error: existingPatronError } = await supabase
      .from('patron')
      .select('*')
      .eq('userid', user.id)
      .single();

    if (existingPatronError || !existingPatron) {
      return redirect('/error?message=Patron not found. Cannot update profile.');
    }

    let avatar_url = existingPatron.avatar_url;

    if (avatarFile && avatarFile.size > 0) {
      const fileName = avatarFile.name;
      const extension = fileName.split('.').pop()?.toLowerCase() || ''
      const filePath = `${user.id}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from('profimg')
        .upload(filePath, avatarFile, {
          upsert: true
        });

      if (uploadError) {
        return redirect(`/error?message=Image upload failed: ${uploadError.message}`);
      }

      avatar_url = filePath;
    }

    const { error: updateError } = await supabase
      .from('patron')
      .update({ name, phone, address, avatar_url })
      .eq('userid', user.id);

    if (updateError) {
      return redirect(`/error?message=${updateError.message}`);
    }

    revalidatePath('/profile');
    return redirect('/profile/success');
  };
  let url = "";
  console.log(patron.avatar_url);

  if (patron.avatar_url) {

    const { data, error } = await supabase.storage
      .from('profimg')
      .createSignedUrl(patron.avatar_url, 60 * 60); // valid 1 hour

    url = data?.signedUrl;


    if (error) {
      console.error('Error downloading image:', error.message);
    }

  }




  return (
    <section className="container py-12">
      <div className="bg-white p-6 rounded-md max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        <form>
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={url || '/assets/noImg.png'}
              alt="picture"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">New Profile Picture</label>
              <input type="file" id="avatar" name="avatar" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ddct-orange file:text-white hover:file:bg-ddct-orange/80" />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email || ''}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-gray-100"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={patron?.name || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              defaultValue={patron?.phone || ''}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              id="address"
              name="address"
              defaultValue={patron?.address || ''}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="patrontype" className="block text-sm font-medium text-gray-700">Patron Type</label>
            <input
              type="text"
              id="patrontype"
              name="patrontype"
              value={patron?.patrontype || ''}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-gray-100"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="membershipstart" className="block text-sm font-medium text-gray-700">Membership Start</label>
            <input
              type="date"
              id="membershipstart"
              name="membershipstart"
              value={patron?.membershipstart || ''}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-gray-100"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="membershipend" className="block text-sm font-medium text-gray-700">Membership End</label>
            <input
              type="date"
              id="membershipend"
              name="membershipend"
              value={patron?.membershipend || ''}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm bg-gray-100"
            />
          </div>
          <div className="mt-6">
            <button
              formAction={updateProfile}
              className="w-full bg-ddct-orange text-white py-2 px-4 rounded"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}