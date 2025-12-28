import {NextResponse} from "next/server";
import {getSupabaseServerClient} from "@/lib/supabase/server";

export async function PATCH(req: Request, {params}: {params: {id: string}}) {
  const supabase = getSupabaseServerClient();
  const body = await req.json();
  const status = body.status?.toString();
  if (!status) return NextResponse.json({error: "status required"}, {status: 400});
  const {error} = await supabase.from("inquiries").update({status}).eq("id", params.id);
  if (error) {
    console.error("admin inquiry status", error);
    return NextResponse.json({error: "update failed"}, {status: 500});
  }
  return NextResponse.json({ok: true});
}
