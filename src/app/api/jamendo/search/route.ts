import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.JAMENDO_CLIENT_ID || '';
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q') || '';
  const p = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    limit: '24',
    audioformat: 'mp32',
    imagesize: '600',
    type: 'single albumtrack',
  });
  if (query.trim()) p.set('namesearch', query.trim());
  try {
    const r = await fetch(`https://api.jamendo.com/v3.0/tracks/?${p}`, {
      next: { revalidate: 60 },
    });
    const d = await r.json();
    if (!r.ok || d?.headers?.status !== 'success')
      return NextResponse.json(
        { error: d?.headers?.error_message || 'Jamendo request failed' },
        { status: 502 }
      );
    return NextResponse.json(d.results ?? []);
  } catch {
    return NextResponse.json(
      { error: 'Could not reach Jamendo' },
      { status: 502 }
    );
  }
}

