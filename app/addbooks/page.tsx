
import { cookies } from 'next/headers';
import { createClient } from '../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import LibrarianLogin from '../../components/LibrarianLogin';
import AddBookForm from '../../components/AddBookForm';

async function addBookAction(formData: FormData) {
    'use server';

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const coverFile = formData.get('cover') as File;
    const isbn = formData.get('isbn') as string;
    let coverUrl: string | null = null;

    // Handle file upload
    if (coverFile && coverFile.size > 0) {
        const extension = coverFile.name.split('.').pop()?.toLowerCase() || '';
        const filePath = `${isbn}.${extension}`;
        const { error: uploadError } = await supabase.storage
            .from('bookimage')
            .upload(filePath, coverFile, { upsert: true });

        if (uploadError) {
            return redirect(`/error?message=Cover image upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
            .from('bookimage')
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

    const { error: bookError } = await supabase.from('book').upsert(bookData, { onConflict: 'isbn' });

    if (bookError) {
        return redirect(`/error?message=Failed to add book: ${bookError.message}`);
    }

    // Handle Authors
    const authors = JSON.parse(formData.get('authors') as string);
    const authorIds: number[] = [];

    for (const author of authors) {
        if (author.name) {
            // Check if author exists
            let { data: existingAuthor, error: selectError } = await supabase
                .from('author')
                .select('authorid')
                .eq('name', author.name)
                .single();

            if (selectError && selectError.code !== 'PGRST116') { // PGRST116: no rows found
                return redirect(`/error?message=Error checking for author: ${selectError.message}`);
            }

            if (existingAuthor) {
                authorIds.push(existingAuthor.authorid);
            } else {
                // Create new author
                const { data: newAuthor, error: insertError } = await supabase
                    .from('author')
                    .insert({ name: author.name })
                    .select('authorid')
                    .single();

                if (insertError) {
                    return redirect(`/error?message=Failed to create author: ${insertError.message}`);
                }
                if (newAuthor) {
                    authorIds.push(newAuthor.authorid);
                }
            }
        }
    }

    // Link authors to book
    if (authorIds.length > 0) {
        const bookAuthorLinks = authorIds.map(authorid => ({
            isbn: bookData.isbn,
            authorid: authorid,
        }));

        const { error: bookAuthorError } = await supabase.from('bookauthor').insert(bookAuthorLinks);

        if (bookAuthorError) {
            return redirect(`/error?message=Failed to link authors to book: ${bookAuthorError.message}`);
        }
    }

    const copyData = {
        isbn: bookData.isbn,
        barcode: formData.get('barcode') as string,
        acquisitiondate: formData.get('acquisitiondate') as string || new Date().toISOString(),
        condition: 'Good',
        location: formData.get('location') as string,
        status: 'Available',
    };

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

    const { data: librarian, error: librarianError } = await supabase
        .from('librarian')
        .select('librarianid')
        .eq('user_id', user.id)
        .single();

    if (librarianError || !librarian) {
        return redirect('/error?message=Access Denied: You must be a librarian to access this page.');
    }

    const { data: allAuthors, error: authorsError } = await supabase.from('author').select('authorid, name');

    if (authorsError) {
        return redirect(`/error?message=Could not fetch authors: ${authorsError.message}`);
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
                    <AddBookForm allAuthors={allAuthors || []} />
                </form>
            </div>
        </section>
    );
}

