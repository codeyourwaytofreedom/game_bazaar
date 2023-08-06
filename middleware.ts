import { NextResponse,NextRequest } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';


export async function middleware(request: NextApiRequest) {
/*   try {
    const referringURL = request.headers.referer;
    const queryParams = new URLSearchParams(referringURL);
    const steamID = queryParams.get('openid.identity');

    if (!steamID) {
        return NextResponse.redirect(new URL("/", request.url));
    }

  } catch (error) {
    console.log(error)
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next()
  return response */

}

export const config = {
  matcher: '/market/tm2/:path*',
}