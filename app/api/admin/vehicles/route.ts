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
  const name = body.name?.toString().trim();
  if (!name) return NextResponse.json({error: "name required"}, {status: 400});
  const category = body.category?.toString().trim() || null;
  const status = body.status?.toString().trim() || "active";
  const priceMin = body.priceMin ? Number(body.priceMin) : null;
  const priceMax = body.priceMax ? Number(body.priceMax) : null;

  const {data, error} = await supabase
    .from("vehicles")
    .insert({name_i18n: {en: name}, category, status, price_range_min: priceMin, price_range_max: priceMax})
    .select("id")
    .single();

  if (error) {
    console.error("admin create vehicle", error);
    return NextResponse.json({error: "create failed"}, {status: 500});
  }
  return NextResponse.json({id: data.id});
}

