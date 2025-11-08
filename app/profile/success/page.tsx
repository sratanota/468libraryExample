
import Link from 'next/link';

export default function ProfileUpdateSuccess() {
  return (
    <section className="container py-12 text-center">
      <div className="bg-white p-6 rounded-md max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Profile Updated Successfully!</h2>
        <p className="mb-6">Your profile information has been saved.</p>
        <Link href="/profile" className="text-white bg-ddct-orange hover:bg-ddct-orange/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            View Your Profile
        </Link>
      </div>
    </section>
  );
}
