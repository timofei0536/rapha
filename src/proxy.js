import { NextResponse } from "next/server";
import { stripVoidTrailingSlashes } from "@/lib/html/strip-void-slashes";

const SKIP = "x-html-void-slash";

function isDocumentRequest(request) {
  if (request.method !== "GET") return false;
  if (request.headers.get("RSC")) return false;
  if (request.headers.get("Next-Router-State-Tree")) return false;
  const accept = request.headers.get("accept") || "";
  return accept.includes("text/html");
}

/** Same process via loopback — public HTTPS URL is unreachable from Hostinger Node. */
function loopbackUrl(request) {
  const dest = request.nextUrl.clone();
  dest.protocol = "http:";
  dest.hostname = "127.0.0.1";
  dest.port = process.env.PORT || "3000";
  return dest;
}

export async function proxy(request) {
  if (request.headers.get(SKIP) === "1" || !isDocumentRequest(request)) {
    return NextResponse.next();
  }

  try {
    const headers = new Headers(request.headers);
    headers.set(SKIP, "1");
    const host = request.headers.get("host");
    if (host) headers.set("host", host);

    const res = await fetch(loopbackUrl(request), {
      headers,
      redirect: "manual",
    });

    const type = res.headers.get("content-type") || "";
    if (!type.includes("text/html")) {
      return new NextResponse(res.body, { status: res.status, headers: res.headers });
    }

    const html = stripVoidTrailingSlashes(await res.text());
    const out = new Headers(res.headers);
    out.delete("content-encoding");
    out.delete("content-length");
    return new NextResponse(html, { status: res.status, headers: out });
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/data|api/|images/|fonts/).*)"],
};
