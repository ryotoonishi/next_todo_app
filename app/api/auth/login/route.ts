import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const redirectTo = searchParams.get('redirectTo') || '/';

    // EASY_AUTH login path (App Service Easy Auth)
    const loginPath = process.env.EASY_AUTH_LOGIN_PATH || '/.auth/login/aad';

    const target = `${loginPath}?post_login_redirect_url=${encodeURIComponent(
        redirectTo,
    )}`;

    return NextResponse.redirect(target);
}
