import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_BRAND_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "PV-Rechner", url: "/pv-rechner" },
  { label: "Ersparnis", url: "/stromkosten-sparen" },
  { label: "Speicher", url: "/speicher-rechner" },
  { label: "Förder-Check", url: "/foerder-check" },
  { label: "Kosten", url: "/photovoltaik-kosten" },
  { label: "Referenzen", url: "/referenzen" },
];

interface HeaderProps {
  transparent?: boolean;
}

export const Header = ({ transparent = false }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const headerClass = transparent && !isScrolled
    ? "bg-white/80 backdrop-blur-md border-transparent"
    : "bg-white/95 backdrop-blur-md border-[#808080]/20 shadow-sm";

  return (
    <header className={cn("fixed left-0 right-0 top-0 z-50 h-[72px] border-b transition-all duration-300", headerClass)}>
      <div className="container mx-auto flex h-full items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#22C55E] text-white shadow-lg shadow-green-500/20">
            <Zap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-black tracking-tight text-slate-950 md:text-xl">{DEFAULT_BRAND_NAME}</div>
            <div className="hidden text-xs font-bold uppercase tracking-[0.18em] text-[#F97316] sm:block">White-Label PV Vertrieb</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.url}
              to={link.url}
              className={({ isActive }) => cn(
                "text-[13px] font-bold transition-colors",
                isActive ? "text-[#F97316]" : "text-slate-700 hover:text-[#F97316]"
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild className="rounded-full bg-[#F97316] px-6 font-extrabold text-white hover:bg-orange-600">
            <Link to="/angebot-anfordern">Kostenlose Anfrage</Link>
          </Button>
        </div>

        <button
          className="rounded-2xl border border-[#808080]/20 bg-white p-2 text-slate-900 shadow-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-[72px] z-40 overflow-y-auto border-t border-[#808080]/20 bg-white lg:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.url}
                to={link.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-2xl border border-[#808080]/20 bg-[#F8FAFC] px-5 py-4 text-base font-black text-slate-900"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-3 h-12 rounded-2xl bg-[#F97316] font-extrabold text-white hover:bg-orange-600">
              <Link to="/angebot-anfordern" onClick={() => setIsMobileMenuOpen(false)}>Kostenlose Anfrage starten</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
