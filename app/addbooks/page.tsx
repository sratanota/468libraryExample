
import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import LibrarianLogin from '../../components/LibrarianLogin';

async function addBookAction(formData: FormData) {
    'use server';

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const coverFile = formData.get('cover') as File;
    const isbn = formData.get('isbn') as string;
    let coverUrl: string | null = null;

    // Handle file upload
    if (coverFile && coverFile.size > 0) {
        const filePath = `${isbn}/${Date.now()}-${coverFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('book-covers')
            .upload(filePath, coverFile);

        if (uploadError) {
            return redirect(`/error?message=Cover image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('book-covers')
            .getPublicUrl(filePath);
        
        coverUrl = publicUrl;
    }

    const bookData = {
        isbn: isbn,
        title: formData.get('title') as string,
        publisher: formData.get('publisher') as string,
        pubyear: Number(formData.get('pubyear')),
        language: formData.get('language') as string,
        cover: coverUrl,
    };

    // First, upsert the book. If it exists, it will be updated. If not, created.
    const { error: bookError } = await supabase.from('book').upsert(bookData, { onConflict: 'isbn' });

    if (bookError) {
        return redirect(`/error?message=Failed to add book: ${bookError.message}`);
    }

    const copyData = {
        isbn: bookData.isbn,
        barcode: formData.get('barcode') as string,
        acquisitiondate: formData.get('acquisitiondate') as string || new Date().toISOString(),
        condition: formData.get('condition') as string,
        location: formData.get('location') as string,
        status: formData.get('status') as string,
    };

    // Then, insert the new book copy.
    const { error: copyError } = await supabase.from('bookcopy').insert(copyData);

    if (copyError) {
        return redirect(`/error?message=Failed to add book copy: ${copyError.message}`);
    }

    revalidatePath('/addbooks');
    return redirect('/addbooks?success=true');
}

export default async function AddBooksPage({ searchParams }: { searchParams: { success?: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <LibrarianLogin />;
    }

    const { data: librarian, error } = await supabase
        .from('librarian')
        .select('librarianid')
        .eq('user_id', user.id)
        .single();

    if (error || !librarian) {
        console.log("Get Librarian error",error);
        return redirect('/error?message=Access Denied: You must be a librarian to access this page.');
    }

    const success = searchParams?.success === 'true';

    return (
        <section className="container py-12">
            <div className="bg-white p-8 rounded-md max-w-2xl mx-auto shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
                {success && (
                    <div className="mb-4 p-3 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                        Book and copy added successfully!
                    </div>
                )}
                <form action={addBookAction} className="space-y-6">
                    {/* Book Details */}
                    <div className="p-4 border rounded-md">
                        <h2 className="text-xl font-semibold mb-4">Book Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">ISBN</label>
                                <input type="text" id="isbn" name="isbn" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            </div>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                <input type="text" id="title" name="title" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            </div>
                            <div>
                                <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">Publisher</label>
                                <input type="text" id="publisher" name="publisher" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="pubyear" className="block text-sm font-medium text-gray-700">Publication Year</label>
                                <input type="number" id="pubyear" name="pubyear" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                                <input type="text" id="language" name="language" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="cover" className="block text-sm font-medium text-gray-700">Cover Image</label>
                                <input type="file" id="cover" name="cover" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ddct-orange file:text-white hover:file:bg-ddct-orange/80"/>
                            </div>
                        </div>
                    </div>

                    {/* Book Copy Details */}
                    <div className="p-4 border rounded-md">
                        <h2 className="text-xl font-semibold mb-4">Book Copy Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Barcode</label>
                                <input type="text" id="barcode" name="barcode" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                            </div>
                            <div>
                                <label htmlFor="acquisitiondate" className="block text-sm font-medium text-gray-700">Acquisition Date</label>
                                <input type="date" id="acquisitiondate" name="acquisitiondate" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
                                <input type="text" id="condition" name="condition" defaultValue="Good" disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <input type="text" id="location" name="location" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <input type="text" id="status" name="status"  defaultValue="Available" disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-ddct-orange text-white py-3 px-4 rounded-md hover:bg-ddct-orange/90 font-semibold">Add Book and Copy</button>
                </form>
            </div>
        </section>
    );
}
