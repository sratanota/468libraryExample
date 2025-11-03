import './global.css';
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';


export const metadata = {
title: 'DDCT Library',
description: 'Library for DDCT Program'
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body className="bg-white text-gray-800 min-h-screen">
<Header />
<main>{children}</main>
<Footer />
</body>
</html>
);
}