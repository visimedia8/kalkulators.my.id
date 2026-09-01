import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const catBisnis = await prisma.category.findUnique({ where: { slug: "bisnis" } });

  const batch15 = [
    {
      slug: "roi-franchise-fb",
      name: "Kalkulator ROI Franchise F&B",
      description: "Hitung Payback Period (BEP) dan laba bersih dari buka kemitraan Es Krim, Kopi, atau F&B lainnya.",
      categoryId: catBisnis!.id,
    },
    {
      slug: "kemitraan-minimarket",
      name: "Kalkulator Kemitraan Minimarket",
      description: "Proyeksi Passive Income bulanan dan royalty fee bertingkat untuk investasi gerai minimarket.",
      categoryId: catBisnis!.id,
    },
    {
      slug: "hpp-katering-mbg",
      name: "Kalkulator HPP Katering MBG",
      description: "Simulasi Food Cost dan margin untuk vendor katering Program Makan Bergizi Gratis (MBG).",
      categoryId: catBisnis!.id,
    },
    {
      slug: "shu-koperasi",
      name: "Kalkulator Pembagian SHU Koperasi",
      description: "Hitung otomatis jatah Sisa Hasil Usaha berdasarkan Jasa Modal dan Jasa Anggota (Transaksi).",
      categoryId: catBisnis!.id,
    },
    {
      slug: "valuasi-bisnis",
      name: "Kalkulator Valuasi Bisnis (Takeover)",
      description: "Hitung harga jual wajar sebuah usaha UMKM menggunakan pendekatan Aset dan Multiple Profit (Goodwill).",
      categoryId: catBisnis!.id,
    }
  ];

  for (const calc of batch15) {
    await prisma.calculator.upsert({
      where: { slug: calc.slug },
      update: {},
      create: calc,
    });
  }

  console.log("Batch 15 seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
