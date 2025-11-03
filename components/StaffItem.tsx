import React from 'react';


export default function StaffItem({ staff }: { staff: any }) {
return (
<div className="flex gap-4 items-center bg-white p-4 rounded-md shadow-sm">
<img src={staff.photo} alt={staff.name} className="h-16 w-16 rounded-full object-cover" />
<div>
<div className="font-semibold">{staff.name}</div>
<div className="text-sm text-gray-600">{staff.position}</div>
</div>
</div>
);
}