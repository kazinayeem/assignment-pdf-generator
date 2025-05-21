// app/api/result-list/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
  }

  try {
    const response = await fetch(`http://peoplepulse.diu.edu.bd:8189/result/resultList?studentId=${studentId}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch  {
    return NextResponse.json({ error: 'Failed to fetch result list' }, { status: 500 });
  }
}
