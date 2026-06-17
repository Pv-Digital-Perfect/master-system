import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_BRAND_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getAvailableNavigationLinks, hasPackageFeature } from "@/config/packageConfig";

interface HeaderProps {
  transparent?: boolean;
}

export const Header = ({ transparent = false }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navLinks = getAvailableNavigationLinks();
  const subtitle = hasPackageFeature("storageCalculator") ? "Photovoltaik & Stromspeicher" : "Photovoltaik & Beratung";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const headerClass =
    transparent && !isScrolled
      ? "bg-white/85 backdrop-blur-md border-transparent"
      : "bg-white/95 backdrop-blur-md border-[#808080]/20 shadow-sm";

  return (
    <>
      <header className={cn("fixed left-0 right-0 top-0 z-[120] h-[72px] border-b transition-all duration-300", headerClass)}>
        <div className="container mx-auto flex h-full items-center justify-between px-4">
          <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMobileMenu}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#22C55E] text-white shadow-lg shadow-green-500/20">
              <Zap className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-lg font-black tracking-tight text-slate-950 md:text-xl">{DEFAULT_BRAND_NAME}</div>
              <div className="hidden text-xs font-bold uppercase tracking-[0.18em] text-[#F97316] sm:block">{subtitle}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.url}
                to={link.url}
                className={({ isActive }) =>
                  cn(
                    "text-[13px] font-bold transition-colors",
                    isActive ? "text-[#F97316]" : "text-slate-700 hover:text-[#F97316]"
                  )
                }
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
            type="button"
            className={cn(
              "relative z-[130] rounded-2xl border border-orange-500/25 bg-white p-2 text-[#F97316] shadow-[0_0_22px_rgba(249,115,22,0.24)] ring-1 ring-orange-500/10 transition hover:border-orange-500/40 hover:shadow-[0_0_34px_rgba(249,115,22,0.36)] lg:hidden",
              isMobileMenuOpen && "bg-orange-50 shadow-[0_0_38px_rgba(249,115,22,0.42)]"
            )}
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            aria-label={isMobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            onClick={closeMobileMenu}
            aria-label="Menü schließen"
          />

          <div className="absolute inset-x-0 top-[72px] max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-[#808080]/20 bg-white shadow-2xl shadow-slate-950/20">
            <nav className="container mx-auto flex flex-col gap-2 px-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  onClick={closeMobileMenu}
                  className="rounded-2xl border border-[#808080]/20 bg-[#F8FAFC] px-5 py-4 text-base font-black text-slate-900 transition hover:border-orange-500/30 hover:bg-orange-50 hover:text-[#F97316]"
                >
                  {link.label}
                </Link>
              ))}

              <Button asChild className="mt-3 h-13 rounded-2xl bg-[#F97316] font-extrabold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600">
                <Link to="/angebot-anfordern" onClick={closeMobileMenu}>Kostenlose Anfrage starten</Link>
              </Button>

              <div className="mt-4 rounded-2xl border border-[#808080]/20 bg-white p-4 text-sm leading-relaxed text-slate-600">
                Photovoltaik-Kosten berechnen, Speicher mitplanen und eine unverbindliche Rückmeldung anfragen.
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
