import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan - Kalkulators.my.id",
  description: "Syarat & Ketentuan Penggunaan",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24 max-w-[800px] mx-auto w-full">
      <h1 className="text-4xl font-bold text-primary mb-8 border-b border-border pb-4">Syarat & Ketentuan</h1>
      <div className="text-secondary text-lg leading-relaxed space-y-6">
        <p>Dengan mengakses Kalkulators.my.id, Anda setuju untuk terikat dengan Syarat dan Ketentuan berikut.</p>
        <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Penafian Akurasi & Tanggung Jawab</h2>
        <p>Hasil perhitungan dari kalkulator medis, kesehatan, dan finansial kami HANYA UNTUK TUJUAN INFORMASI UMUM. Sistem kami telah dirancang dengan referensi formula industri, namun kesalahan komputasi atau pembulatan mungkin terjadi.</p>
        <p>Anda diwajibkan untuk memverifikasi ulang hasil perhitungan untuk pengambilan keputusan kritis. Kalkulators.my.id dan tim pengembangnya tidak bertanggung jawab atas kerugian finansial, masalah kesehatan, atau kerugian lainnya yang timbul dari penggunaan kalkulator kami.</p>
      </div>
    </main>
  );
}
