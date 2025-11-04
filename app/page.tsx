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

    const {data: newestBooks, error } = await supabase. from ('bookcopy')
        .select(`copyid,acquisitiondate , book ( isbn, title, publisher, pubyear, author (name))`)
        .order('acquisitiondate', {ascending:false})
        .limit(5);
    if (error){
        console.log("Error fetching newest book: ", error);
    }
return (
<>
<Hero />
<FeaturedBooks books={newestBooks} sectionName="New Books" />

</>
);
}