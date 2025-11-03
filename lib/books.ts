export const books = [
{ id: '1', title: 'Intro to Design', author: 'A. Author', cover: '/assets/book1.jpg', description: 'Introduction to design principles.' },
{ id: '2', title: 'Creative Coding', author: 'B. Author', cover: '/assets/book2.jpg', description: 'Coding creatively for artists and designers.' },
{ id: '3', title: 'Creative Coding', author: 'B. Author', cover: '/assets/book2.jpg', description: 'Coding creatively for artists and designers.' },
{ id: '4', title: 'Creative Coding', author: 'B. Author', cover: '/assets/book2.jpg', description: 'Coding creatively for artists and designers.' },
{ id: '5', title: 'Creative Coding', author: 'B. Author', cover: '/assets/book2.jpg', description: 'Coding creatively for artists and designers.' }
];


export function getFeaturedBooks() { return books; }
export function getBookById(id: string) { return books.find(b => b.id === id) ?? null; }
export function searchBooks(q: string) {
if (!q) return books;
const s = q.toLowerCase();
return books.filter(b => b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s));
}
export function getStaff() {
return [
{ id: 's1', name: 'Dr. Example', position: 'Program Chair', photo: '/assets/staff1.jpg' },
{ id: 's2', name: 'Ms. Tutor', position: 'Librarian', photo: '/assets/staff2.jpg' },
{ id: 's3', name: 'Ms. Tutor', position: 'Librarian', photo: '/assets/staff2.jpg' },
{ id: 's4', name: 'Ms. Tutor', position: 'Librarian', photo: '/assets/staff2.jpg' },
{ id: 's5', name: 'Ms. Tutor', position: 'Librarian', photo: '/assets/staff2.jpg' }
];
}