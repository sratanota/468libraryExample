import { NextRequest, NextResponse } from "next/server";

import { createClient } from "../../../../lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(req:NextRequest){
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const data = {
        email: 'oe@gmail.com',
        password: 'pass123456',
    }

    const {error} = await supabase.auth.signUp(data);

    if (error){
        console.log("Error signing up: ", error);
        return NextResponse.json({error: error.message}, {status:500});
    }
    console.log ("sign up successfully");

    return NextResponse.json({status:200});

}