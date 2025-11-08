import Link from 'next/link';

export default function AddBookSuccessPage() {
  return (
    <section className="container py-12 text-center">
      <div className="bg-white p-8 rounded-md max-w-md mx-auto shadow-lg">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Book Added Successfully!</h1>
        <p className="mb-6">The new book and its copy have been added to the library catalog.</p>
        <div className="flex justify-center gap-4">
            <Link href="/addbooks" className="text-white bg-ddct-orange hover:bg-ddct-orange/90 font-medium rounded-lg text-sm px-5 py-2.5">
                Add Another Book
            </Link>
            <Link href="/" className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 font-medium rounded-lg text-sm px-5 py-2.5">
                Go to Homepage
            </Link>
        </div>
      </div>
    </section>
  );
}