import {NextResponse} from "next/server";
import {getSupabaseServerClient} from "@/lib/supabase/server";
import {getRoleFromCookies, hasRequiredRole} from "@/lib/admin-auth";

export async function POST(req: Request) {
  const role = getRoleFromCookies();
  if (!hasRequiredRole(role, "editor")) {
    return NextResponse.json({error: "forbidden"}, {status: 403});
  }

  const supabase = getSupabaseServerClient();
  const body = await req.json();
  const {vehicleId, title, pdfUrl, issueDate, expiryDate} = body ?? {};
  if (!vehicleId || !title) {
    return NextResponse.json({error: "vehicleId and title required"}, {status: 400});
  }

  const {error} = await supabase
    .from("certificates")
    .insert({vehicle_id: vehicleId, title_i18n: {en: title}, pdf_url: pdfUrl ?? null, issue_date: issueDate ?? null, expiry_date: expiryDate ?? null});

  if (error) {
    console.error("admin add cert", error);
    return NextResponse.json({error: "insert failed"}, {status: 500});
  }
  return NextResponse.json({ok: true});
}

