import { NextResponse,NextRequest } from 'next/server';


export async function middleware(req: NextRequest, res:NextResponse) {
  console.log(req.cookies)
  try {
    const ID = req.cookies.get('ID')?.value;
    if(!ID){
      return NextResponse.redirect(new URL("/", req.url));
    }

  } catch (error) {
    console.log(error)
    return NextResponse.redirect(new URL("/", req.url));
  }

  const response = NextResponse.next()
  return response

}

export const config = {
  matcher: '/(inventory|profile|balance|trades|market/:path*)',
};