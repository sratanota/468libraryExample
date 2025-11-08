'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';

type Author = {
    authorid: number;
    name: string;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="w-full bg-ddct-orange text-white py-3 px-4 rounded-md hover:bg-ddct-orange/90 font-semibold disabled:bg-gray-400">
            {pending ? 'Adding Book...' : 'Add Book and Copy'}
        </button>
    );
}

export default function AddBookForm({ allAuthors }: { allAuthors: Author[] }) {
    const [authors, setAuthors] = useState<{ name: string }[]>([{ name: '' }]);
    // Removed: const [pending,setPending] = useState<boolean>(false);

    const handleAuthorChange = (index: number, value: string) => {
        const newAuthors = [...authors];
        newAuthors[index].name = value;
        setAuthors(newAuthors);
    };

    const addAuthor = () => {
        setAuthors([...authors, { name: '' }]);
    };

    const removeAuthor = (index: number) => {
        const newAuthors = authors.filter((_, i) => i !== index);
        setAuthors(newAuthors);
    };

    return (
        <>
            <input type="hidden" name="authors" value={JSON.stringify(authors)} />

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
                        <input type="file" id="cover" name="cover" accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ddct-orange file:text-white hover:file:bg-ddct-orange/80" />
                    </div>
                </div>
            </div>

            {/* Authors Section */}
            <div className="p-4 border rounded-md">
                <h2 className="text-xl font-semibold mb-4">Authors</h2>
                <div id="author-list" className="space-y-2">
                    {authors.map((author, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                list="author-datalist"
                                value={author.name}
                                onChange={(e) => handleAuthorChange(index, e.target.value)}
                                placeholder={`Author ${index + 1} Name`}
                                className="block w-full rounded-md border-gray-300 shadow-sm"
                            />
                            <button type="button" onClick={() => removeAuthor(index)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">-</button>
                        </div>
                    ))}
                </div>
                <datalist id="author-datalist">
                    {allAuthors.map((author) => (
                        <option key={author.authorid} value={author.name} />
                    ))}
                </datalist>
                <button type="button" onClick={addAuthor} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Another Author</button>
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
                        <input type="text" id="condition" name="condition" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" id="location" name="location" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <input type="text" id="status" name="status" defaultValue="Available" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>
            </div>
            <SubmitButton />
        </>
    );
}