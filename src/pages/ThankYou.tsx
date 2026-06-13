import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Helmet>
        <title>Danke für deine PV-Anfrage</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 pt-[72px]">
        <div className="max-w-2xl rounded-[2rem] bg-white p-8 text-center shadow-2xl shadow-slate-900/10 md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight">Anfrage gespeichert.</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Vielen Dank. Die PV-Anfrage wurde übermittelt und kann nun im Adminbereich weiterbearbeitet werden.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full bg-orange-500 px-7 font-black text-white hover:bg-orange-600"><Link to="/">Zur Startseite</Link></Button>
            <Button asChild variant="outline" className="rounded-full px-7 font-black"><Link to="/pv-rechner">PV-Rechner erneut öffnen</Link></Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
