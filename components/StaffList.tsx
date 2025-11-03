import React from 'react';
import StaffItem from './StaffItem';


export default function StaffList({ staff }: { staff: any[] }) {
return (
<section className="container py-12">
<h2 className="text-2xl font-bold">Staff</h2>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
{staff.map(s => (
<StaffItem key={s.id} staff={s} />
))}
</div>
</section>
);
}