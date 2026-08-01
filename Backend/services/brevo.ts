/**
 * Brevo (formerly Sendinblue) Transactional Email Service
 * Handles customer auto-reply, owner alerts, and newsletter double opt-in confirmations.
 */

export interface SendEmailPayload {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
}

export async function sendTransactionalEmail(payload: SendEmailPayload) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@auramenswear.com';
  const senderName = 'AURA (The Beginning)';

  if (!apiKey) {
    console.warn('BREVO_API_KEY is not configured. Email notification skipped.');
    return { success: false, reason: 'Missing API key' };
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: payload.toEmail, name: payload.toName || payload.toEmail }],
        subject: payload.subject,
        htmlContent: payload.htmlContent,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Brevo API Error:', res.status, errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    return { success: true, messageId: data.messageId };
  } catch (err: any) {
    console.error('Failed to send email via Brevo:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends contact form acknowledgement to customer
 */
export async function sendCustomerAutoReply(customerEmail: string, customerName: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0A0C; color: #F5F1E8; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #151517; border: 1px solid rgba(212,160,42,0.2); padding: 30px; border-radius: 8px;">
        <h1 style="color: #D4A02A; font-size: 24px; margin-bottom: 10px; letter-spacing: 2px;">AURA — THE BEGINNING</h1>
        <p style="color: #9C9894; font-size: 14px; margin-bottom: 20px;">Premium Men's Wear • GIDC Dahegam</p>
        <hr style="border: 0; border-top: 1px solid rgba(212,160,42,0.2); margin-bottom: 25px;" />
        
        <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${customerName || 'Valued Customer'}</strong>,</p>
        <p style="font-size: 15px; color: #9C9894; line-height: 1.6;">
          Thank you for reaching out to AURA (The Beginning). We have received your inquiry and our team will get back to you shortly.
        </p>
        <p style="font-size: 15px; color: #9C9894; line-height: 1.6;">
          You can also visit our boutique store directly or contact us on WhatsApp for instant bespoke consultations.
        </p>

        <div style="margin-top: 30px; padding: 20px; background-color: #1D1D20; border-left: 3px solid #D4A02A;">
          <p style="margin: 0; color: #D4A02A; font-weight: bold;">Store Location:</p>
          <p style="margin: 5px 0 0 0; color: #F5F1E8; font-size: 14px;">
            Shop no 2, plot, AURA (The Beginning), Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305
          </p>
        </div>

        <p style="margin-top: 30px; font-size: 13px; color: #9C9894; text-align: center;">
          © ${new Date().getFullYear()} AURA (The Beginning) MENS WEAR. All rights reserved.
        </p>
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    toEmail: customerEmail,
    toName: customerName,
    subject: 'Thank you for contacting AURA (The Beginning)',
    htmlContent,
  });
}

/**
 * Sends new enquiry alert to store owner
 */
export async function sendOwnerEnquiryAlert(details: {
  source: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  productName?: string;
}) {
  const ownerEmail = process.env.SHOP_OWNER_NOTIFY_EMAIL || 'owner@auramenswear.com';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0A0C; color: #F5F1E8; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #151517; border: 1px solid #D4A02A; padding: 30px; border-radius: 8px;">
        <h2 style="color: #D4A02A; margin-top: 0;">New Enquiry Received!</h2>
        <p style="color: #9C9894; font-size: 14px;">Source: <strong>${details.source}</strong></p>
        <hr style="border: 0; border-top: 1px solid rgba(212,160,42,0.2); margin: 20px 0;" />
        
        <table style="width: 100%; text-align: left; font-size: 15px; color: #F5F1E8;">
          ${details.name ? `<tr><td style="padding: 6px 0; color: #9C9894;">Name:</td><td><strong>${details.name}</strong></td></tr>` : ''}
          ${details.phone ? `<tr><td style="padding: 6px 0; color: #9C9894;">Phone:</td><td><a style="color: #E8C168;" href="tel:${details.phone}">${details.phone}</a></td></tr>` : ''}
          ${details.email ? `<tr><td style="padding: 6px 0; color: #9C9894;">Email:</td><td><a style="color: #E8C168;" href="mailto:${details.email}">${details.email}</a></td></tr>` : ''}
          ${details.productName ? `<tr><td style="padding: 6px 0; color: #9C9894;">Product:</td><td><strong>${details.productName}</strong></td></tr>` : ''}
        </table>

        ${details.message ? `
          <div style="margin-top: 20px; padding: 15px; background-color: #1D1D20; border-radius: 4px;">
            <p style="margin: 0; color: #9C9894; font-size: 13px;">Message:</p>
            <p style="margin: 5px 0 0 0; color: #F5F1E8; white-space: pre-wrap;">${details.message}</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; text-align: center;">
          <a href="https://auramenswear.com/admin/enquiries" style="background-color: #D4A02A; color: #0A0A0C; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 4px; display: inline-block;">View in Admin Inbox</a>
        </div>
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    toEmail: ownerEmail,
    subject: `[AURA Alert] New ${details.source} from ${details.name || details.phone || details.email || 'Customer'}`,
    htmlContent,
  });
}

/**
 * Sends newsletter double opt-in confirmation email
 */
export async function sendNewsletterConfirmation(email: string, confirmUrl: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0A0C; color: #F5F1E8; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #151517; border: 1px solid rgba(212,160,42,0.2); padding: 30px; border-radius: 8px; text-align: center;">
        <h1 style="color: #D4A02A; font-size: 24px; letter-spacing: 2px;">AURA — THE BEGINNING</h1>
        <p style="color: #9C9894; font-size: 14px;">Confirm Your Subscription</p>
        <hr style="border: 0; border-top: 1px solid rgba(212,160,42,0.2); margin: 25px 0;" />
        
        <p style="font-size: 15px; color: #F5F1E8; line-height: 1.6;">
          Thank you for subscribing to AURA Stories & New Arrival updates.
        </p>
        <p style="font-size: 14px; color: #9C9894; line-height: 1.6; margin-bottom: 30px;">
          Please click the button below to confirm your subscription.
        </p>

        <a href="${confirmUrl}" style="background-color: #D4A02A; color: #0A0A0C; text-decoration: none; padding: 14px 28px; font-weight: bold; border-radius: 4px; display: inline-block;">Confirm Subscription</a>

        <p style="margin-top: 30px; font-size: 12px; color: #9C9894;">
          If you did not request this email, please ignore it.
        </p>
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    toEmail: email,
    subject: 'Confirm your AURA Newsletter Subscription',
    htmlContent,
  });
}
