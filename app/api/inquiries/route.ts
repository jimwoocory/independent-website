import {NextRequest, NextResponse} from "next/server";
import {getSupabaseServerClient} from "@/lib/supabase/server";
import {sendCustomerConfirmationEmail, sendAdminNotificationEmail} from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      vehicle_id,
      company_name,
      contact_name,
      email,
      phone,
      country,
      message,
      quantity,
      locale = "en",
    } = body;

    // 验证必填字段
    if (!email || !contact_name) {
      return NextResponse.json({error: "Missing required fields"}, {status: 400});
    }

    // 获取车辆信息
    const supabase = getSupabaseServerClient();
    let vehicleName = "Vehicle Inquiry";
    
    if (vehicle_id) {
      const {data: vehicle} = await supabase
        .from("vehicles")
        .select("name_i18n")
        .eq("id", vehicle_id)
        .single();
      
      if (vehicle) {
        vehicleName = (vehicle.name_i18n as any)?.[locale] ?? (vehicle.name_i18n as any)?.en ?? "Vehicle";
      }
    }

    // 保存询价到数据库
    const {data: inquiry, error: dbError} = await supabase
      .from("inquiries")
      .insert({
        vehicle_id,
        company_name,
        contact_name,
        email,
        phone,
        country,
        message_i18n: {[locale]: message},
        quantity,
        status: "new",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({error: "Failed to save inquiry"}, {status: 500});
    }

    // 发送邮件（异步，不阻塞响应）
    const emailData = {
      vehicleName,
      vehicleId: vehicle_id ?? "general",
      customerName: contact_name,
      customerEmail: email,
      customerPhone: phone,
      customerCountry: country,
      message,
      quantity,
      locale,
    };

    // 并行发送客户和管理员邮件
    Promise.all([
      sendCustomerConfirmationEmail(emailData),
      sendAdminNotificationEmail(emailData),
    ]).then(([customerResult, adminResult]) => {
      if (!customerResult.success) {
        console.error("Failed to send customer email:", customerResult.error);
      }
      if (!adminResult.success) {
        console.error("Failed to send admin email:", adminResult.error);
      }
    });

    return NextResponse.json({
      success: true,
      inquiry,
      message: "Inquiry submitted successfully. Check your email for confirmation.",
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }
}
