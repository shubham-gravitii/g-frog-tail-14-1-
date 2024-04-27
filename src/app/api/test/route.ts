import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers';

export const GET=(req:NextRequest)=>{
    const headersList = headers();
    const middlewareData = JSON.parse(headersList.get('userData') || '');
    return NextResponse.json({message:"This a test api",
        middlewareData:middlewareData
    }, { status: 200 })
}