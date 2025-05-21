// app/api/student-info/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json({ error: "Missing studentId" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `http://peoplepulse.diu.edu.bd:8189/result/studentInfo?studentId=${studentId}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching student info:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
