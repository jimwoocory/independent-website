import {NextResponse} from "next/server";
import {getSupabaseServerClient} from "@/lib/supabase/server";
import {getRoleFromCookies, hasRequiredRole} from "@/lib/admin-auth";

export async function PATCH(req: Request, {params}: {params: {id: string}}) {
  const role = getRoleFromCookies();
  if (!hasRequiredRole(role, "editor")) {
    return NextResponse.json({error: "forbidden"}, {status: 403});
  }

  const supabase = getSupabaseServerClient();
  const body = await req.json();
  const update: Record<string, any> = {};
  if (body.name) update.name_i18n = {en: body.name};
  if (body.category !== undefined) update.category = body.category;
  if (body.status !== undefined) update.status = body.status;
  if (body.priceMin !== undefined) update.price_range_min = body.priceMin;
  if (body.priceMax !== undefined) update.price_range_max = body.priceMax;

  const {error} = await supabase.from("vehicles").update(update).eq("id", params.id);
  if (error) {
    console.error("admin update vehicle", error);
    return NextResponse.json({error: "update failed"}, {status: 500});
  }
  return NextResponse.json({ok: true});
}

