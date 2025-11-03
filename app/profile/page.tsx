import React from 'react';


export default function Profile() {
const user = { name: 'Student User', email: 'student@kmutt.ac.th' };
return (
<section className="container py-12">
<div className="bg-white p-6 rounded-md">
<h2 className="text-xl font-bold">{user.name}</h2>
<p className="text-sm text-gray-600">{user.email}</p>
</div>
</section>
);
}