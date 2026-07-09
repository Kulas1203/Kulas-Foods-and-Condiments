import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Copy, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentMethods, siteConfig, type PaymentMethodKey } from "@/data/site";
import { formatPrice } from "@/lib/utils";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; pay?: string; total?: string }>;
}) {
  const { order, pay, total } = await searchParams;
  const method =
    pay && pay in paymentMethods
      ? paymentMethods[pay as PaymentMethodKey]
      : null;
  const amount = total && !Number.isNaN(Number(total)) ? Number(total) : null;

  return (
    <div className="container-px grid min-h-[80vh] place-items-center py-24 pt-32 text-center">
      <div className="w-full max-w-lg">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-gradient shadow-glow">
          <CheckCircle2 className="h-10 w-10 text-white" />
        </div>
        <h1 className="mt-6 font-heading text-3xl font-extrabold">
          Salamat for your order!
        </h1>
        <p className="mt-3 text-muted">
          {order ? (
            <>
              Your order{" "}
              <span className="font-semibold text-white">{order}</span> has been
              placed. A confirmation is on its way to your inbox.
            </>
          ) : (
            "Your order has been placed. A confirmation is on its way to your inbox."
          )}
        </p>

        {method && (
          <div className="mt-8 rounded-4xl border border-white/10 bg-surface/50 p-6 text-left backdrop-blur-xl sm:p-8">
            <h2 className="font-heading text-lg font-bold">
              Complete your payment — {method.label}
            </h2>
            <p className="mt-1 text-sm text-muted">{method.note}</p>

            {method.qrImage && (
              <div className="mt-5 flex flex-col items-center gap-2 rounded-3xl border border-white/10 bg-white p-4">
                <Image
                  src={method.qrImage}
                  alt={`${method.label} payment QR code`}
                  width={240}
                  height={240}
                  className="h-60 w-60 object-contain"
                />
                <p className="flex items-center gap-1.5 text-xs font-semibold text-black/70">
                  <QrCode className="h-3.5 w-3.5" /> Scan with the{" "}
                  {method.label} app
                </p>
              </div>
            )}

            <dl className="mt-5 space-y-3">
              <PayRow label="Account name" value={method.accountName} />
              {method.accountNumber ? (
                <PayRow label="Account number" value={method.accountNumber} />
              ) : (
                <PayRow
                  label="Account number"
                  value="Sent to your email"
                />
              )}
              {amount !== null && (
                <PayRow label="Amount to send" value={formatPrice(amount)} />
              )}
              {order && <PayRow label="Payment reference" value={order} />}
            </dl>

            <div className="mt-6 rounded-2xl border border-brand-primary/30 bg-brand-primary/10 p-4 text-sm text-white/90">
              <p>
                <strong>Important:</strong> put your order number in the payment
                reference/notes, then send a screenshot of your payment to{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-semibold text-brand-accent underline-offset-2 hover:underline"
                >
                  {siteConfig.email}
                </a>{" "}
                or message{" "}
                <a
                  href={siteConfig.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand-accent underline-offset-2 hover:underline"
                >
                  our Facebook page
                </a>
                . We ship as soon as payment is confirmed.
              </p>
            </div>
          </div>
        )}

        <Button asChild size="lg" className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}

function PayRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/5 px-4 py-3">
      <dt className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted">
        <Copy className="h-3.5 w-3.5" /> {label}
      </dt>
      <dd className="text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}
