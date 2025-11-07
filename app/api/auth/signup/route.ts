 
 import { createClient } from "../../../../lib/supabase/server";
 import { revalidatePath } from 'next/cache'
 import { cookies } from "next/headers";
 import { NextRequest, NextResponse } from "next/server";
 
 export async function GET(req:NextRequest){
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);


  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: 'oe@gmail.com',
    password: 'pass123456',
  }


  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log("Error sing up", error);
    return NextResponse.json({error: error.message}, {status:500});
  }
  console.log ("login successfully");
  return NextResponse.json({status:200});

}