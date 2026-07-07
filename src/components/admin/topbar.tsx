import { Bell, Search } from "lucide-react";

export function AdminTopbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-background/70 px-6 py-4 backdrop-blur-xl">
      <h1 className="font-heading text-xl font-bold">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            placeholder="Search..."
            className="w-56 rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder:text-muted focus:outline-none"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 hover:bg-white/10"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-secondary" />
        </button>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-gradient font-heading text-sm font-bold">
          K
        </div>
      </div>
    </header>
  );
}
