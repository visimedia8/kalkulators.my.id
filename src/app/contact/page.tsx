import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami - Kalkulators.my.id",
  description: "Kontak Resmi",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24 max-w-[800px] mx-auto w-full">
      <h1 className="text-4xl font-bold text-primary mb-8 border-b border-border pb-4">Hubungi Kami</h1>
      <div className="text-secondary text-lg leading-relaxed space-y-6">
        <p>Jika Anda memiliki pertanyaan mengenai alat kalkulator kami, menemukan bug/kesalahan perhitungan, atau ingin menawarkan kerjasama bisnis dan iklan, jangan ragu untuk menghubungi kami.</p>
        <div className="p-6 bg-surface border border-border rounded-xl mt-8">
          <h2 className="text-xl font-bold text-primary mb-2">Email Dukungan & Kerjasama</h2>
          <p className="text-accent font-mono">partnership@kalkulators.my.id</p>
        </div>
        <p>Tim dukungan teknis kami umumnya membalas seluruh pertanyaan terkait bug dan request fitur baru dalam waktu 1-2 hari kerja.</p>
      </div>
    </main>
  );
}
