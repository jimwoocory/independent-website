import {NextResponse} from "next/server";
import {createSessionToken, getCookieName, matchPasswordToRole} from "@/lib/admin-auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD;
const VIEWER_PASSWORD = process.env.VIEWER_PASSWORD;

export async function POST(req: Request) {
  if (!ADMIN_PASSWORD && !EDITOR_PASSWORD && !VIEWER_PASSWORD) {
    return NextResponse.json({error: "No admin/editor/viewer password configured"}, {status: 500});
  }

  const form = await req.formData();
  const password = form.get("password")?.toString() || "";
  const role = matchPasswordToRole(password);

  if (!role) {
    const url = new URL("/admin/login?error=1", req.url);
    return NextResponse.redirect(url);
  }

  const res = NextResponse.redirect(new URL("/admin", req.url));
  res.cookies.set(getCookieName(), createSessionToken(role), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  // clear legacy cookie
  res.cookies.set("admin_session", "", {path: "/", maxAge: 0});
  return res;
}

