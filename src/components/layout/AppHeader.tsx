import Link from "next/link";
import { linkStyles } from "@/lib/utils/interactive-styles";
import { cn } from "@/lib/utils/cn";

export function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", linkStyles)}
          aria-label="SkyBook home"
        >
          <svg
            className="h-7 w-7 text-sky-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          <span className="text-xl font-bold text-slate-900">SkyBook</span>
        </Link>
        <nav className="text-sm text-slate-600" aria-label="Main navigation">
          <Link href="/" className={linkStyles}>
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}
