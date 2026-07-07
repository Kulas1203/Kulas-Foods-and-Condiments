import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <div className="container-px grid min-h-[80vh] place-items-center pt-24 text-center">
      <div>
        <WifiOff className="mx-auto h-12 w-12 text-brand-secondary" />
        <h1 className="mt-6 font-heading text-3xl font-extrabold">
          You&apos;re offline
        </h1>
        <p className="mt-3 text-muted">
          Check your connection — your spicy cravings will be waiting.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Try again</Link>
        </Button>
      </div>
    </div>
  );
}
