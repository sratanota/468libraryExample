import React from 'react';
import { getBookById } from '../../../lib/books';
import { createClient } from "../../../lib/supabase/server";
import { cookies } from "next/headers";

type Props = { params: { id: string } };


export default async function BookPage({ params }: Props) {

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);


    const {data: book, error:error1 } = await supabase. from ('book')
        .select(`*, author(name)`)
        .eq('isbn', params.id);

    if (error1){
        console.log("Error fetching  info: ", error1);
    }
    //console.log (book);

if (!book) return <div className="container py-12">Book not found</div>;

const aBook = book[0];
const authorList = aBook.author.map((aut:any)=>aut.name).join(", ");
//console.log (aBook.cover);
return (
<section className="container py-12 grid md:grid-cols-3 gap-8">
<img src={aBook.cover} alt={aBook.title} className="w-full h-auto" />
<div className="md:col-span-2">
<h1 className="text-3xl font-bold">{aBook.title}</h1>

<p className="text-gray-700 mt-4">{aBook.publisher}</p>
<p className="text-gray-700 mt-4">{aBook.pubyear}</p>
<p className="text-gray-700 mt-4">{authorList}</p>

</div>
</section>
);
}