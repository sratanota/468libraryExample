export async function mockLogin(email: string, pass: string) {
// trivial mock — change for real auth
return email === 'student@kmutt.ac.th' && pass === '1234';
}