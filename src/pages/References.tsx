import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const references = [
  { title: "Einfamilienhaus", location: "Linz Umgebung", details: "8,6 kWp · Speicher vorbereitet · Eigenverbrauch optimiert" },
  { title: "Gewerbedach", location: "Oberösterreich", details: "29,4 kWp · hoher Tagesverbrauch · klare Wirtschaftlichkeitsrechnung" },
  { title: "Modernisierung", location: "Wels", details: "PV-Erweiterung · Speicher ergänzt · Wallbox vorbereitet" },
];

export default function References() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Helmet>
        <title>PV Referenzen | Photovoltaik Projekte</title>
        <meta name="description" content="Beispiele für Photovoltaik-Projekte mit PV-Leistung, Speicheroption, Region und Nutzen übersichtlich dargestellt." />
      </Helmet>
      <Header />
      <main className="pt-[72px]">
        <section className="bg-gradient-to-br from-emerald-50 via-white to-orange-50 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl">PV-Referenzen</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
              Ausgewählte Beispiele zeigen, wie Photovoltaik, Speicher und Wallbox je nach Objekt sinnvoll geplant werden können.
            </p>
          </div>
        </section>
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-6 md:grid-cols-3">
            {references.map((item) => (
              <Card key={item.title} className="overflow-hidden border-slate-200">
                <div className="h-44 bg-gradient-to-br from-slate-200 to-emerald-100" />
                <CardContent className="p-7">
                  <h2 className="text-xl font-black">{item.title}</h2>
                  <div className="mt-2 flex items-center gap-2 text-sm font-bold text-emerald-700"><MapPin className="h-4 w-4" />{item.location}</div>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center"><Button asChild className="rounded-full bg-orange-500 px-8 font-black text-white hover:bg-orange-600"><Link to="/angebot-anfordern">Eigenes Projekt anfragen</Link></Button></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
