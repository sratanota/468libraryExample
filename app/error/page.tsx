'use client';

import { useSearchParams } from "next/navigation";

export default function ErrorPage(){
    const searchParam = useSearchParams();
    const errorMessage = searchParam.get('message');

    return(
        <section className="container py-12 text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p>Sorry, something went wrong.</p>
            {errorMessage && <p className="text-red-500 mt-4"> {errorMessage}</p> }
        </section>
    );
}