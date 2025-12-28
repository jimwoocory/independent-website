import {NextResponse} from "next/server";
import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const uploadSecret = process.env.UPLOAD_ROUTE_SECRET;

const ALLOWED_TYPES = {
  vehicle_image: {
    bucket: "vehicles",
    mime: ["image/jpeg", "image/png", "image/webp"],
    maxBytes: 8 * 1024 * 1024,
  },
  certificate_pdf: {
    bucket: "certificates",
    mime: ["application/pdf"],
    maxBytes: 15 * 1024 * 1024,
  },
} as const;

type UploadType = keyof typeof ALLOWED_TYPES;

type Body = {
  type?: UploadType;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
};

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "file";
}

export async function POST(req: Request) {
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({error: "missing service key"}, {status: 500});
  }
  if (!uploadSecret) {
    return NextResponse.json({error: "missing upload secret"}, {status: 500});
  }

  const authHeader = req.headers.get("authorization") || "";
  if (authHeader !== `Bearer ${uploadSecret}`) {
    return NextResponse.json({error: "unauthorized"}, {status: 401});
  }

  let body: Body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({error: "invalid json"}, {status: 400});
  }

  const {type, fileName, fileSize, mimeType} = body ?? {};
  if (!type || !fileName || typeof fileSize !== "number" || !mimeType) {
    return NextResponse.json({error: "missing params"}, {status: 400});
  }

  const cfg = ALLOWED_TYPES[type] as typeof ALLOWED_TYPES[UploadType];
  if (!cfg) {
    return NextResponse.json({error: "unsupported type"}, {status: 400});
  }
  // 修复类型错误：先转换为 unknown，再转换为 readonly string[]
  if (!(cfg.mime as unknown as readonly string[]).includes(mimeType)) {
    return NextResponse.json({error: "unsupported mime"}, {status: 415});
  }
  if (fileSize > cfg.maxBytes) {
    return NextResponse.json({error: "file too large"}, {status: 413});
  }

  const safeName = sanitizeFileName(fileName);
  const path = `${type}/${Date.now()}-${safeName}`;

  const client = createClient(supabaseUrl, serviceKey, {auth: {persistSession: false}});
  const {data, error} = await client.storage.from(cfg.bucket).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("signed upload error", error);
    return NextResponse.json({error: "failed to create signed url"}, {status: 500});
  }

  return NextResponse.json({bucket: cfg.bucket, path, signedUrl: data.signedUrl, token: data.token});
}

