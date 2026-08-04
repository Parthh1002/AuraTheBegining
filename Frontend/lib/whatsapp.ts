/**
 * Generates WhatsApp deep links with prefilled messages for product inquiries and store contact
 */

export interface WhatsAppProductParams {
  whatsappNumber: string;
  productName: string;
  size?: string;
  sku?: string;
  priceLabel?: string;
}

export function buildProductWhatsAppUrl({
  whatsappNumber,
  productName,
  size,
  sku,
  priceLabel,
}: WhatsAppProductParams): string {
  // Clean phone number: remove spaces, +, dashes
  const cleanNumber = (whatsappNumber || '918866077505').replace(/[^\d]/g, '');

  let message = `Hi, I'm interested in ${productName}`;
  if (size) {
    message += ` (Size: ${size})`;
  }
  if (sku) {
    message += `, SKU: ${sku}`;
  }
  if (priceLabel) {
    message += ` [${priceLabel}]`;
  }
  message += `. Is it currently available for consultation at your GIDC Dahegam store?`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(whatsappNumber: string, customMessage?: string): string {
  const cleanNumber = (whatsappNumber || '918866077505').replace(/[^\d]/g, '');
  const message = customMessage || `Hi Akshay Khanna's Store for only Men's, I would like to inquire about bespoke tailoring and visiting your boutique store in Dahegam.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
