import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const envCheck = {
    hasUrl: !!supabaseUrl,
    urlPrefix: supabaseUrl?.substring(0, 20) || "MISSING",
    hasKey: !!anonKey,
    keyPrefix: anonKey?.substring(0, 20) || "MISSING",
  };

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("incidents")
      .select("slug, title, status")
      .limit(5);

    return NextResponse.json({
      envCheck,
      queryResult: { data, error },
    });
  } catch (e: any) {
    return NextResponse.json({
      envCheck,
      error: e.message,
    });
  }
}
