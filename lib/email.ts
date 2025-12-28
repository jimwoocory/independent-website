import {Resend} from "resend";

// 创建 resend 实例，处理 API 密钥缺失的情况
let resend: Resend | null = null;
const resendApiKey = process.env.RESEND_API_KEY;
if (resendApiKey) {
  resend = new Resend(resendApiKey);
}

export interface InquiryEmailData {
  vehicleName: string;
  vehicleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCountry?: string;
  message?: string;
  quantity?: number;
  locale: string;
}

// 发送给客户的确认邮件
export async function sendCustomerConfirmationEmail(data: InquiryEmailData) {
  const subject = {
    en: "Thank you for your inquiry - Rongqi Auto Service",
    zh: "感谢您的询价 - Rongqi Auto Service",
    es: "Gracias por su consulta - Rongqi Auto Service",
    ar: "شكراً لاستفسارك - Rongqi Auto Service",
  }[data.locale] ?? "Thank you for your inquiry";

  const htmlContent = generateCustomerEmailHTML(data);

  try {
    // 检查 resend 实例是否存在
    if (!resend) {
      console.warn("Resend API key not configured. Skipping email sending.");
      return {success: true, messageId: null, warning: "Email sending skipped: API key not configured"};
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "AutoExport <noreply@autoexport.com>",
      to: data.customerEmail,
      subject,
      html: htmlContent,
    });
    return {success: true, messageId: result.data?.id};
  } catch (error) {
    console.error("Failed to send customer confirmation email:", error);
    return {success: false, error};
  }
}

// 发送给管理员的通知邮件
export async function sendAdminNotificationEmail(data: InquiryEmailData) {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@autoexport.com";
  const subject = `🚗 New Inquiry: ${data.vehicleName} from ${data.customerName}`;

  const htmlContent = generateAdminEmailHTML(data);

  try {
    // 检查 resend 实例是否存在
    if (!resend) {
      console.warn("Resend API key not configured. Skipping email sending.");
      return {success: true, messageId: null, warning: "Email sending skipped: API key not configured"};
    }

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "AutoExport <noreply@autoexport.com>",
      to: adminEmail,
      replyTo: data.customerEmail,
      subject,
      html: htmlContent,
    });
    return {success: true, messageId: result.data?.id};
  } catch (error) {
    console.error("Failed to send admin notification email:", error);
    return {success: false, error};
  }
}

// 生成客户邮件HTML
function generateCustomerEmailHTML(data: InquiryEmailData): string {
  const greeting = {
    en: `Dear ${data.customerName},`,
    zh: `尊敬的 ${data.customerName}：`,
    es: `Estimado/a ${data.customerName},`,
    ar: `عزيزي ${data.customerName}،`,
  }[data.locale] ?? `Dear ${data.customerName},`;

  // 先完整定义 body 对象
  const bodyContent = {
    en: `
      <p>Thank you for your inquiry about <strong>${data.vehicleName}</strong>.</p>
      <p>We have received your request and our team will review it shortly. You can expect a response within 2-4 hours during business hours.</p>
      <h3>Your Inquiry Details:</h3>
      <ul>
        <li><strong>Vehicle:</strong> ${data.vehicleName}</li>
        ${data.quantity ? `<li><strong>Quantity:</strong> ${data.quantity} units</li>` : ""}
        ${data.customerCountry ? `<li><strong>Destination:</strong> ${data.customerCountry}</li>` : ""}
        ${data.message ? `<li><strong>Message:</strong> ${data.message}</li>` : ""}
      </ul>
      <p>If you have any urgent questions, please contact us via WhatsApp: <a href="https://wa.me/8613800000000">+86 138 0000 0000</a></p>
    `,
    zh: `
      <p>感谢您对 <strong>${data.vehicleName}</strong> 的询价。</p>
      <p>我们已收到您的需求，团队将尽快处理。工作时间内，您将在 2-4 小时内收到回复。</p>
      <h3>您的询价详情：</h3>
      <ul>
        <li><strong>车型：</strong> ${data.vehicleName}</li>
        ${data.quantity ? `<li><strong>数量：</strong> ${data.quantity} 台</li>` : ""}
        ${data.customerCountry ? `<li><strong>目的地：</strong> ${data.customerCountry}</li>` : ""}
        ${data.message ? `<li><strong>留言：</strong> ${data.message}</li>` : ""}
      </ul>
      <p>如有紧急问题，请通过 WhatsApp 联系我们：<a href="https://wa.me/8613800000000">+86 138 0000 0000</a></p>
    `,
    es: `
      <p>Gracias por su consulta sobre <strong>${data.vehicleName}</strong>.</p>
      <p>Hemos recibido su solicitud y nuestro equipo la revisará en breve. Puede esperar una respuesta en 2-4 horas durante el horario laboral.</p>
      <h3>Detalles de su consulta:</h3>
      <ul>
        <li><strong>Vehículo:</strong> ${data.vehicleName}</li>
        ${data.quantity ? `<li><strong>Cantidad:</strong> ${data.quantity} unidades</li>` : ""}
        ${data.customerCountry ? `<li><strong>Destino:</strong> ${data.customerCountry}</li>` : ""}
        ${data.message ? `<li><strong>Mensaje:</strong> ${data.message}</li>` : ""}
      </ul>
      <p>Si tiene preguntas urgentes, contáctenos por WhatsApp: <a href="https://wa.me/8613800000000">+86 138 0000 0000</a></p>
    `,
    ar: `
      <p>شكراً لاستفسارك عن <strong>${data.vehicleName}</strong>.</p>
      <p>تلقينا طلبك وسيقوم فريقنا بمراجعته قريباً. يمكنك توقع الرد خلال 2-4 ساعات في ساعات العمل.</p>
      <h3>تفاصيل استفسارك:</h3>
      <ul>
        <li><strong>المركبة:</strong> ${data.vehicleName}</li>
        ${data.quantity ? `<li><strong>الكمية:</strong> ${data.quantity} وحدات</li>` : ""}
        ${data.customerCountry ? `<li><strong>الوجهة:</strong> ${data.customerCountry}</li>` : ""}
        ${data.message ? `<li><strong>الرسالة:</strong> ${data.message}</li>` : ""}
      </ul>
      <p>إذا كان لديك أي أسئلة عاجلة، اتصل بنا عبر واتساب: <a href="https://wa.me/8613800000000">+86 138 0000 0000</a></p>
    `,
  };

  // 然后获取对应语言的内容，默认使用英文
  const body = bodyContent[data.locale as keyof typeof bodyContent] ?? bodyContent.en;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        h3 { color: #2563eb; }
        ul { background: #f3f4f6; padding: 20px; border-radius: 8px; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Rongqi Auto Service</h1>
      </div>
      <div style="padding: 30px; background: white;">
        ${greeting}
        ${body}
        <div class="footer">
          <p>Best regards,<br>Rongqi Auto Service Team</p>
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 生成管理员邮件HTML
function generateAdminEmailHTML(data: InquiryEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #ef4444; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; background: #fef2f2; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #ef4444; }
        .label { font-weight: bold; color: #7f1d1d; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2 style="margin: 0;">🚗 New Vehicle Inquiry</h2>
      </div>
      <div class="content">
        <div class="info-box">
          <p><span class="label">Vehicle:</span> ${data.vehicleName}</p>
          <p><span class="label">Vehicle ID:</span> ${data.vehicleId}</p>
        </div>
        <div class="info-box">
          <p><span class="label">Customer Name:</span> ${data.customerName}</p>
          <p><span class="label">Email:</span> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
          ${data.customerPhone ? `<p><span class="label">Phone:</span> ${data.customerPhone}</p>` : ""}
          ${data.customerCountry ? `<p><span class="label">Country:</span> ${data.customerCountry}</p>` : ""}
        </div>
        ${
          data.quantity
            ? `<div class="info-box">
          <p><span class="label">Requested Quantity:</span> ${data.quantity} units</p>
        </div>`
            : ""
        }
        ${
          data.message
            ? `<div class="info-box">
          <p><span class="label">Message:</span></p>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>`
            : ""
        }
        <p style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
          <strong>Action Required:</strong> Please respond to this inquiry within 2-4 hours.
        </p>
      </div>
    </body>
    </html>
  `;
}
