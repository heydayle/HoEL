import { NextRequest, NextResponse } from 'next/server';

/**
 * Xử lý POST request để chạy Dify Workflow
 * @param {NextRequest} request - Next.js request object
 * @returns {Promise<NextResponse>} JSON response từ Dify
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputs, user = "abc-123" } = body;

    const apiKey = process.env.API_SECRET_KEY_DIFY;
    const baseUrl = process.env.NEXT_PUBLIC_DIFY_BASE_URL;

    if (!apiKey) {
      return NextResponse.json({ error: "Dify API Key is missing." }, { status: 500 });
    }
    if (!baseUrl) {
      return NextResponse.json({ error: "Dify Base URL is missing." }, { status: 500 });
    }

    const response = await fetch(`${baseUrl}/workflows/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs,
        response_mode: "blocking",
        user,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return NextResponse.json(
        { error: `Dify API Error: ${response.status} - ${errorBody}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}