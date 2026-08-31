import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - Kalkulators.my.id",
  description: "Kebijakan Privasi Kalkulators.my.id",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24 max-w-[800px] mx-auto w-full">
      <h1 className="text-4xl font-bold text-primary mb-8 border-b border-border pb-4">Kebijakan Privasi (Privacy Policy)</h1>
      <div className="text-secondary text-lg leading-relaxed space-y-6">
        <p>Di Kalkulators.my.id, privasi pengunjung kami adalah prioritas utama. Dokumen kebijakan privasi ini menguraikan jenis informasi pribadi yang diterima dan dikumpulkan oleh Kalkulators.my.id dan bagaimana informasi tersebut digunakan.</p>
        <h2 className="text-2xl font-bold text-primary mt-8 mb-4">1. Data Kalkulasi Anda</h2>
        <p>Sebagian besar kalkulator di platform kami berjalan sepenuhnya di sisi klien (browser Anda). Artinya, data sensitif yang Anda masukkan tidak pernah dikirim atau disimpan di server kami.</p>
        <h2 className="text-2xl font-bold text-primary mt-8 mb-4">2. Cookies dan Analitik</h2>
        <p>Kami menggunakan analitik dasar untuk memantau performa situs dan memahami kalkulator mana yang paling bermanfaat bagi pengguna. Data analitik ini dianonimkan dan tidak mengandung informasi pribadi (PII).</p>
      </div>
    </main>
  );
}
