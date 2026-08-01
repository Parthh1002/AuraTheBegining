import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default async function ConfirmSubscriptionPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  let success = false;
  let message = 'Invalid subscription link.';

  if (email) {
    try {
      await fetchApi(`/newsletter/confirm?email=${encodeURIComponent(email.trim())}`);
      success = true;
      message = `Your email (${email}) has been confirmed! You are now subscribed to AURA Journal updates.`;
    } catch (err) {
      message = 'Failed to confirm subscription. Please try subscribing again.';
    }
  }

  return (
    <div className="max-w-md mx-auto my-20 px-4">
      <div className="bg-[#151517] border border-[#D4A02A]/30 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
        {success ? (
          <CheckCircle className="w-12 h-12 text-[#D4A02A] mx-auto" />
        ) : (
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        )}

        <h1 className="font-serif text-2xl font-bold text-[#F5F1E8]">
          {success ? 'Subscription Confirmed!' : 'Confirmation Error'}
        </h1>

        <p className="text-xs text-[#9C9894] leading-relaxed">{message}</p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-block bg-[#D4A02A] text-[#0A0A0C] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded hover:bg-[#E8C168] transition-colors"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
