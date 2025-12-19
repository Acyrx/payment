import { Code2 } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-6 glass">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Code2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Acyrx</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Support
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2025 Acyrx. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
