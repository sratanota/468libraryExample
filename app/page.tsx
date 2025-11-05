import React from 'react';
import Hero from '../components/Hero';
import FeaturedBooks from '../components/FeaturedBooks';
import StaffList from '../components/StaffList';
import { getFeaturedBooks, getStaff } from '../lib/books';

import { createClient } from '../lib/supabase/server';
import { cookies } from "next/headers";

export default async function Home() {

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);


    const {data: newestBooks, error:error1 } = await supabase. from ('newest_bookcopies')
        .select(`*`);

    if (error1){
        console.log("Error fetching newest book: ", error1);
    }

    const {data: popBook, error:error2} = await supabase.from('borrowstats')
    .select(`isbn, borrowcount, book(title, author(name))`)
    .order("borrowcount", {ascending:false})
    .limit(6);
    if (error2){
        console.log("Error fetching newest book: ", error2);
    }
    const popularBooks = popBook.map((b)=>{
        let book:any = b.book;
        let names = book.author.map(a=>a.name).join(", ");
        return {isbn:b.isbn, title:book.title, authors:names};
    });

return (
<>
<Hero />
<FeaturedBooks books={newestBooks} sectionName="New Books" />
<FeaturedBooks books={popularBooks} sectionName="Popular Books" />
</>
);
}