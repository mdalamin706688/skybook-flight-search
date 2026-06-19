import Link from "next/link";
import { linkStyles } from "@/lib/utils/interactive-styles";
import { cn } from "@/lib/utils/cn";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} SkyBook. Demo flight search application.</p>
        <div className="flex items-center gap-4">
          <Link href="/" className={cn(linkStyles, "text-slate-500 hover:text-sky-600")}>
            Search flights
          </Link>
        </div>
      </div>
    </footer>
  );
}
