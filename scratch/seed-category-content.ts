import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const finansialCategory = await prisma.category.findUnique({
    where: { slug: "finansial" }
  });

  if (finansialCategory) {
    await prisma.categoryContentBlock.upsert({
      where: { categoryId: finansialCategory.id },
      update: {},
      create: {
        categoryId: finansialCategory.id,
        h1Title: "Kalkulator Finansial & Keuangan",
        definitionalH2: "## Pusat Kalkulator Finansial Online\n\nKategori **Finansial** di Kalkulators.my.id dirancang khusus untuk membantu para profesional keuangan, investor, dan masyarakat umum dalam melakukan perhitungan finansial yang kompleks secara instan. Kami menyediakan berbagai macam kalkulator seperti Kalkulator KPR, Kalkulator Diskon, Kalkulator Bunga Majemuk (Compound Interest), hingga Kalkulator ROI (Return on Investment).\n\nSemua kalkulator kami dikembangkan berdasarkan standar akuntansi dan formula matematika keuangan yang presisi. Fitur utama kami meliputi:\n- **Client-Side Processing**: Data sensitif Anda seperti gaji, hutang, atau portofolio investasi diproses di perangkat Anda sendiri.\n- **Sistem Parameter Lanjutan**: Sesuaikan pajak, inflasi, suku bunga dinamis, hingga jadwal amortisasi bulanan.",
        variablesH2: "## Metrik Keuangan Penting\n\nDalam melakukan perencanaan keuangan, beberapa metrik dan istilah yang sering digunakan dalam alat komputasi kami meliputi:\n1. **Suku Bunga Efektif (Effective Interest Rate)**: Bunga aktual yang Anda bayarkan atau terima setelah memperhitungkan frekuensi pemajemukan.\n2. **Amortisasi**: Proses pelunasan utang melalui pembayaran berkala yang terencana (biasa digunakan di Kalkulator KPR dan Kredit Kendaraan).\n3. **Present Value (PV) & Future Value (FV)**: Nilai uang saat ini dibandingkan dengan nilai di masa depan, sangat krusial untuk keputusan investasi.",
        actionableH3: "### Cara Memilih Kalkulator Keuangan yang Tepat\n\n1. **Identifikasi Kebutuhan Anda**: Jika Anda ingin merencanakan pembelian rumah, gunakan *Kalkulator KPR*.\n2. **Persiapkan Data Input**: Pastikan Anda mengetahui suku bunga pasar saat ini (fixed/floating) dan tenor yang diinginkan.\n3. **Analisis Output**: Perhatikan tabel amortisasi yang dihasilkan untuk mengetahui kapan porsi pokok hutang lebih besar dari bunga.",
        booleanFaqH4: "#### Tanya Jawab Seputar Kalkulator Finansial\n\n**Apakah kalkulator finansial di situs ini gratis?**\nYa, 100% gratis tanpa batasan penggunaan atau keharusan membuat akun.\n\n**Apakah hasil perhitungannya valid secara hukum?**\nTidak. Hasil komputasi kami adalah estimasi matematis yang ditujukan sebagai panduan awal. Anda tetap harus berkonsultasi dengan bank atau perencana keuangan bersertifikat (CFP) untuk angka final."
      }
    });
    console.log("Seeded content for category: finansial");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
