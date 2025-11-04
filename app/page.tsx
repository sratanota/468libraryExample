import React from 'react';
import Hero from '../components/Hero';
import FeaturedBooks from '../components/FeaturedBooks';
import StaffList from '../components/StaffList';
import { getFeaturedBooks, getStaff } from '../lib/books';


export default function Home() {
const books = getFeaturedBooks();
const staff = getStaff();
return (
<>
<Hero />
<FeaturedBooks books={books} sectionName="New Books" />
<FeaturedBooks books={books} sectionName="Most Popular" />
</>
);
}