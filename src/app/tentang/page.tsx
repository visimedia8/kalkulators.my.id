import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami - Kalkulators.my.id",
  description: "Tentang Kalkulators.my.id",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24 max-w-[800px] mx-auto w-full">
      <h1 className="text-4xl font-bold text-primary mb-8 border-b border-border pb-4">Tentang Kami</h1>
      <div className="text-secondary text-lg leading-relaxed space-y-6">
        <p>Kalkulators.my.id adalah platform penyedia ratusan alat kalkulasi dan komputasi presisi tinggi untuk berbagai kebutuhan profesional, mulai dari medis, teknik, finansial, hingga kebutuhan sehari-hari.</p>
        <p>Kami berkomitmen untuk terus menghadirkan kalkulator yang akurat, cepat, dan mudah digunakan tanpa mengorbankan privasi data Anda. Semua perhitungan diproses secara lokal di perangkat Anda (Client-side) atau melalui arsitektur Edge serverless yang aman.</p>
      </div>
    </main>
  );
}
