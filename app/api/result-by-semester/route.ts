// app/api/result-by-semester/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const semesterId = searchParams.get('semesterId');

  if (!studentId || !semesterId) {
    return NextResponse.json({ error: 'Missing studentId or semesterId' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `http://peoplepulse.diu.edu.bd:8189/result?semesterId=${semesterId}&studentId=${studentId}`
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch result data' }, { status: 500 });
  }
}
