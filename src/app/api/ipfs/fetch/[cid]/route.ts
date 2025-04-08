import { fetchFromIpfs } from "../../../../../../backend/lib/ipfs";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route to fetch data from IPFS via Pinata using the CID
 * @param request - The incoming request
 * @param params - The route parameters including the CID
 * @returns Response with the data from IPFS
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { cid: string } },
) {
  try {
    const { cid } = params;

    if (!cid) {
      return NextResponse.json(
        { success: false, error: "CID is required" },
        { status: 400 },
      );
    }

    // Fetch data from IPFS
    const data = await fetchFromIpfs(cid);

    // Return the data
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error in IPFS fetch API:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
