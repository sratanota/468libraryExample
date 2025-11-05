'use client';

import Image from 'next/image';
import { createClient } from '../lib/supabase/client';
import { useRef, useState } from "react";


export default function Hero() {
  const supabase = createClient();

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = async () => {
    console.log("handle upload");
    if (selectedFile) {
      const filename = "test";

      const { data, error } = await supabase.storage
        .from("bookimage")
        .upload(
          `${filename}.${selectedFile.name.split(".").pop()}`,
          selectedFile
        );

      if (error) {
        console.error("Error uploading file:", error.message);
      } else {
        const { data: file } = await supabase.storage
          .from("nextsupabase")
          .getPublicUrl(data?.path);
        console.log(file.publicUrl);
        setUploaded(file?.publicUrl);
      }
    }
  };

  return (
    <section className="relative w-full h-[500px] flex items-center justify-start bg-gray-900 overflow-hidden">
      {/* Background image */}
      <Image
        src="/assets/heroBg.png"
        alt="DDCT Library hero background"
        fill
        className="object-cover opacity-80"
        priority
      />

      {/* Overlay content */}
      <div className="relative z-10 max-w-xl ml-12 text-white">
        <h1 className="text-4xl font-bold mb-4">
          Discover, Read, and Learn.
        </h1>
        <p className="text-lg text-gray-200 mb-6">
          Explore our amazing collection of artbooks and textbooks.
        </p>


        <input
          type="file"
          ref={inputRef}
          onChange={(e) => {
            setSelectedFile(e?.target?.files?.[0]);
          }}
        />
        <button
          className="mt-5 bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
          type="button"
          onClick={handleUpload}
        >         Upload File
        </button>


        {/* Search bar */}
        <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md w-[400px]">
          <input
            type="text"
            placeholder="Search by title, author, or keyword"
            className="flex-grow px-4 py-2 text-gray-800 focus:outline-none"
          />
          <button className="bg-ddct-orange text-white px-4 py-2 hover:bg-ddct-yellow transition-colors">
            🔍
          </button>
          
        </div>
      </div>

      {/* Optional overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-transparent" />
    </section>
  );
}