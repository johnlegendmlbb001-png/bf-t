import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Blue Buff",
  description:
    "Read Blue Buff refund policy for MLBB diamond top-ups. Learn about eligible refunds, non-refundable cases, and refund processing time.",
};

export default function RefundPolicyPage() {
  return (
    <section className="min-h-screen bg-[var(--background)] px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6 text-[var(--foreground)]">

        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-[var(--accent)]">
            Refund Policy
          </h1>
          <p className="text-sm text-[var(--muted)]">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <p>
          At <strong>Blue Buff</strong>, we aim to provide instant and secure
          digital top-up services. Please read this refund policy carefully
          before placing an order.
        </p>

        <h2 className="text-xl font-semibold">1. Digital Products & Delivery</h2>
        <p>
          All products sold on our platform are digital goods delivered
          instantly. Once a top-up is successfully processed, refunds are
          generally not applicable.
        </p>

        <h2 className="text-xl font-semibold">2. Eligible Refund Cases</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Payment completed but top-up not delivered</li>
          <li>Incorrect amount credited due to system error</li>
          <li>Duplicate payment for the same order</li>
          <li>Failed order with successful payment deduction</li>
        </ul>

        <h2 className="text-xl font-semibold">3. Non-Refundable Situations</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Incorrect Player ID or Server ID entered</li>
          <li>Successful top-up already credited</li>
          <li>Game server or third-party delays</li>
          <li>Change of mind after purchase</li>
          <li>Violation of terms of service</li>
        </ul>

        <h2 className="text-xl font-semibold">4. Refund Processing</h2>
        <p>
          Approved refunds are processed within <strong>5–7 business days</strong>
          and credited back to the original payment method.
        </p>

        <h2 className="text-xl font-semibold">5. Contact Support</h2>
        <p>
          For refund requests, please contact our support team with your Order ID
          and payment details.
        </p>

        <p className="text-sm text-[var(--muted)]">
          This policy may be updated without prior notice.
        </p>
      </div>
    </section>
  );
}
