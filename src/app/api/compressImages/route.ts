// app/api/upload/route.ts

import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
 function middleware(req:NextRequest){
  const newHeaders = new Headers(req.headers);
  newHeaders.set("Content-Type", "image/jpeg");
  newHeaders.set(
    "Content-Disposition",
    'attachment; filename="compressed-image.jpg"'
  );
  return NextResponse.next({
    request: {
      // New request headers
      headers: newHeaders,
    },
  },);
 }
export async function POST(req: NextRequest,res:NextApiResponse) {
  const formData = await req.formData();

  // Remember to enforce type here and after use some lib like zod.js to check it
  const files = formData.getAll("image") as File[];

  // Thats it, you have your files
  console.log(files);
  const imageBuffer = await files[0].arrayBuffer();
  const compressedImage = await sharp(imageBuffer).resize(1200, 900).toBuffer();
  console.log(compressedImage);
  const newHeaders = new Headers(req.headers);
  newHeaders.set("Content-Type", "image/jpeg");
  newHeaders.set(
    "Content-Disposition",
    'attachment; filename="compressed-image.jpg"'
  );
  // And produce a response with the new headers
  

  /*
      returns [
        {
          name: 'test.jpg',
          type: 'image/jpg',
          size: 1024,
          ...other file props
        }
      ]
    */


  // supose you have your Supabase client initialized previously

  return NextResponse.json({ response:compressedImage });
}
