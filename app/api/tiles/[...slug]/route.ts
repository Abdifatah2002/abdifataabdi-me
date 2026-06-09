import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const [z, x, y] = slug;
  const url = `https://a.basemaps.cartocdn.com/dark_matter_nolabels/${z}/${x}/${y}@2x.png`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'chapis.me portfolio' },
  });

  if (!res.ok) return new NextResponse(null, { status: res.status });
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}