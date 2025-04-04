import { NextRequest, NextResponse } from "next/server";

/**
 * API handler for Farcaster cast trigger
 * @param request - The incoming request
 * @returns Response with the processed results
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    const { fid, castHash } = body;

    // Log the trigger data
    console.log(`Cast trigger called by FID: ${fid}, Cast hash: ${castHash}`);

    // Return success response with URL to redirect to
    return NextResponse.json({
      success: true,
      redirectUrl: `/?from=cast&fid=${fid}&castHash=${castHash}`,
    });
  } catch (error) {
    console.error("Error processing cast trigger:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process trigger" },
      { status: 500 },
    );
  }
}

/**
 * API handler for OPTIONS requests (CORS preflight)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
