import { uploadToIpfs } from "../../../../../backend/lib/ipfs";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to upload data to IPFS via Pinata
 * @param request - The incoming request with data to upload
 * @returns Response with the IPFS CID and size
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();

    // Upload to IPFS
    const result = await uploadToIpfs(data);

    // Return the IPFS CID and size
    return NextResponse.json({ success: true, ...result }, { status: 200 });
  } catch (error) {
    console.error("Error in IPFS upload API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
