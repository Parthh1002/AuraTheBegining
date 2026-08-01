import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await fetchApi('/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Contact API Error' }, { status: 500 });
  }
}
