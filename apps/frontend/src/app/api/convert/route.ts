import { NextResponse } from "next/server";
import { convertTextToTraditionalMongolian } from "@/app/lib/mongolian-script";

type ConvertRequest = {
  text?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ConvertRequest | null;
  const text = typeof body?.text === "string" ? body.text : "";

  if (!text.trim()) {
    return NextResponse.json(
      { error: "text is required" },
      { status: 400 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return NextResponse.json({
    result: convertTextToTraditionalMongolian(text),
  });
}
