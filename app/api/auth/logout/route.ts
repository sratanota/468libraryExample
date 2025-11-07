import { NextRequest, NextResponse } from "next/server";

import { createClient } from "../../../../lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function GET(req:NextRequest){
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {error} = await supabase.auth.signOut();

    if (error){
        console.log("Error logging out: ", error);
        return NextResponse.json({error: error.message}, {status:500});
    }else{
        console.log ("user log out successfully");
        revalidatePath('/','layout');
    }
    return NextResponse.json({status:200});

}