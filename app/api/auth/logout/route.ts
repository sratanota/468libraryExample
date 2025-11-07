 
 import { createClient } from "../../../../lib/supabase/server";
 import { revalidatePath } from 'next/cache'
 import { cookies } from "next/headers";
 import { NextRequest, NextResponse } from "next/server";
 
 export async function GET(req:NextRequest){
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);


  // type-casting here for convenience
  // in practice, you should validate your inputs
    const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    console.log('User signed out successfully.');
  }

  revalidatePath('/', 'layout')
 
  return NextResponse.json({status:200});

}