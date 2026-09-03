import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { hashVisitorCookieUuid } from "@/lib/analytics/visitor-hash";
import { isLikelyBotUserAgent } from "@/lib/analytics/bot-filter";
import {
  getVisitorCookieOptions,
  HOMEPAGE_VISITOR_COOKIE_NAME,
  readVisitorCookieUuid,
} from "@/lib/analytics/visitor-cookie";
import { upsertHomepageVisitor } from "@/lib/db/repositories/homepage-visitor.repository";

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (isLikelyBotUserAgent(request.headers.get("user-agent"))) {
    return new NextResponse(null, { status: 204 });
  }

  try {
    let cookieUuid = await readVisitorCookieUuid();

    if (!cookieUuid) {
      cookieUuid = randomUUID();
      const cookieStore = await cookies();
      cookieStore.set(
        HOMEPAGE_VISITOR_COOKIE_NAME,
        cookieUuid,
        getVisitorCookieOptions(process.env.NODE_ENV === "production"),
      );
    }

    const visitorIdHash = hashVisitorCookieUuid(cookieUuid);
    await upsertHomepageVisitor(visitorIdHash);

    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
