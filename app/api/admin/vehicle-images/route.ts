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
  const {vehicleId, url, isCover, displayOrder} = body ?? {};
  if (!vehicleId || !url) {
    return NextResponse.json({error: "vehicleId and url required"}, {status: 400});
  }

  if (isCover) {
    await supabase.from("vehicle_images").update({is_cover: false}).eq("vehicle_id", vehicleId);
  }

  const {error} = await supabase.from("vehicle_images").insert({vehicle_id: vehicleId, url, is_cover: !!isCover, display_order: displayOrder ?? null});
  if (error) {
    console.error("admin add image", error);
    return NextResponse.json({error: "insert failed"}, {status: 500});
  }
  return NextResponse.json({ok: true});
}

