import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '709fa152';
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!/^\d+$/.test(id))
    return NextResponse.json({ error: 'Invalid track id' }, { status: 400 });
  const u = new URL('https://api.jamendo.com/v3.0/tracks/file/');
  u.searchParams.set('client_id', CLIENT_ID);
  u.searchParams.set('id', id);
  u.searchParams.set('action', 'stream');
  u.searchParams.set('audioformat', 'mp32');
  const r = await fetch(u, { redirect: 'manual' });
  const loc = r.headers.get('location');
  if (!loc)
    return NextResponse.json(
      { error: 'Track unavailable for streaming' },
      { status: 404 }
    );
  return NextResponse.redirect(loc, 302);
}
