import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getCurrentAdmin } from "@/lib/admin/auth/get-current-admin";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
} from "@/lib/validation/admin-phase7";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith("site-media/")) {
          throw new Error("Invalid upload path");
        }

        return {
          allowedContentTypes: [...ALLOWED_IMAGE_MIME_TYPES],
          maximumSizeInBytes: MAX_IMAGE_UPLOAD_BYTES,
          addRandomSuffix: false,
          tokenPayload: JSON.stringify({ adminId: admin.id }),
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 },
    );
  }
}
