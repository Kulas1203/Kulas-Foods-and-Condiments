import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <div className="container-px grid min-h-[80vh] place-items-center pt-24 text-center">
      <div className="max-w-md">
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
              <span className="font-semibold text-white">{order}</span> is
              confirmed. A receipt is on its way to your inbox.
            </>
          ) : (
            "Your order is confirmed. A receipt is on its way to your inbox."
          )}
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
