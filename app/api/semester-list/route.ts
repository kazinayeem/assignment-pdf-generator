// app/api/semester-list/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://peoplepulse.diu.edu.bd:8189/result/semesterList');
    const data = await response.json();
    return NextResponse.json(data);
  } catch  {
    return NextResponse.json({ error: 'Failed to fetch semester list' }, { status: 500 });
  }
}
