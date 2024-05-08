//@ts-nocheck
import {
  fetchAuthSession,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth/server";
import { NextRequest, NextResponse } from "next/server";
import { runWithAmplifyServerContext } from "./utils/amplifyServerUtils";
export async function middleware(request: NextRequest, response: NextResponse) {
  try {
    let data = {};
    const authenticated = await runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: async (contextSpec: any) => {
        try {
          const session = await fetchAuthSession(contextSpec);
          data = await getCurrentUser(contextSpec);
          let data1 = await fetchUserAttributes(contextSpec);
          data = Object.assign(data, data1);
          // console.log("user data from amplify");
          // console.log(data);
          // console.log(data)

          return session.tokens !== undefined;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
    });
    if (!authenticated) {
      // let isApi=false;
      // relativeEndpoint.split('/').forEach(element => {
      //   console.log(element)
      //   if(element==='api'){
      //     console.log(element)
      //     isApi=true;
      //   }
      // });
      // if(isApi){
      //   console.log("is api is true")
      //   NextResponse.json({"message":"Good try"},{status:400})
      //   console.log("json send")
      // }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const headers = new Headers(request.headers);

    headers.set("userData", JSON.stringify(data));
    return NextResponse.next({ request: { headers } });
  } catch (error:any) {
    console.log("Error in middleware")
    console.log(error.message)
    return NextResponse.json({error},{status:405})
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/private",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
  ],
};
