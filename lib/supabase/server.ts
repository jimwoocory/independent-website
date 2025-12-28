import {createClient} from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseServiceRoleKey || supabaseAnonKey));

function createMockQuery() {
  const mockResponse = {data: [], error: null, count: 0};
  const builder: any = {
    select: () => builder,
    eq: () => builder,
    neq: () => builder,
    gt: () => builder,
    gte: () => builder,
    lt: () => builder,
    lte: () => builder,
    ilike: () => builder,
    or: () => builder,
    in: () => builder,
    contains: () => builder,
    order: () => builder,
    range: () => builder,
    rangeOverlap: () => builder,

    limit: () => builder,
    single: () => builder,
    maybeSingle: () => builder,
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    delete: () => builder,
    then: (resolve: any, reject?: any) => Promise.resolve(mockResponse).then(resolve, reject),
  };
  return builder;
}

function createMockClient() {
  return {
    from: () => createMockQuery(),
    rpc: async () => ({data: [], error: null}),
    storage: {
      from: () => ({
        upload: async () => ({data: null, error: null}),
        createSignedUrl: async () => ({data: null, error: null}),
      }),
    },
  } as any;
}

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured) {
    console.warn("[DEV] Supabase env missing. Using mock client returning empty data.");
    return createMockClient();
  }
  const key = supabaseServiceRoleKey || supabaseAnonKey!;
  return createClient(supabaseUrl!, key, {
    auth: {persistSession: false},
  });
}

