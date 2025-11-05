
import { createClient } from "../../../lib/supabase/server";
import { cookies } from "next/headers";

export default async function BookPage({ params }: { params: { id: string } }) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: book, error } = await supabase
        .from('book')
        .select(`
            *,
            language,
            author (name)
        `)
        .eq('isbn', params.id)
        .single();

    if (error) {
        console.error('Error fetching book:', error);
        return <div>Error loading book.</div>;
    }

    if (!book) {
        return <div>Book not found.</div>;
    }

    const authorList = book.author.map((aut: any) => aut.name).join(", ");

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">No Cover</div>
                <div className="p-6 flex-grow">
                    <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                    <p className="text-lg text-gray-700 mb-4">by {authorList}</p>
                    <div className="text-md text-gray-600">
                        <p className="mb-2"><strong>Publisher:</strong> {book.publisher}</p>
                        <p className="mb-2"><strong>Publication Year:</strong> {book.pubyear}</p>
                        <p><strong>Language:</strong> {book.language}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
