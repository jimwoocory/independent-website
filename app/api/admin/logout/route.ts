import {NextResponse} from "next/server";
import {getCookieName} from "@/lib/admin-auth";

const LEGACY_COOKIE = "admin_session";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url));
  res.cookies.set(getCookieName(), "", {path: "/", maxAge: 0});
  res.cookies.set(LEGACY_COOKIE, "", {path: "/", maxAge: 0});
  return res;
}

