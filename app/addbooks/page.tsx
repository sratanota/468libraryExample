

import LibrarianLogin from '../../components/LibrarianLogin';
import AddBookForm from '../../components/AddBookForm';


export default async function AddBooksPage({ searchParams }: { searchParams: { success?: string } }) {
   let success:boolean = false;

    return (
        <section className="container py-12">
            <div className="bg-white p-8 rounded-md max-w-2xl mx-auto shadow-lg">
                <h1 className="text-3xl font-bold mb-6">Add New Book</h1>
                {success && (
                    <div className="mb-4 p-3 text-sm text-green-800 rounded-lg bg-green-50" role="alert">
                        Book and copy added successfully!
                    </div>
                )}
                <form  className="space-y-6">
                    <AddBookForm  />
                </form>
            </div>
        </section>
    );
}