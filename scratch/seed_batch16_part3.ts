import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const catOtomotif = await prisma.category.findUnique({ where: { slug: "otomotif" } });
  const catBisnis = await prisma.category.findUnique({ where: { slug: "bisnis" } });

  const batch16_3 = [
    {
      slug: "kapasitas-aki",
      name: "Kalkulator Dimensi & Kapasitas Aki (Ampere-Hour)",
      description: "Hitung batas aman penambahan beban listrik (audio, biled) terhadap kapasitas aki mobil/motor.",
      categoryId: catOtomotif!.id,
    },
    {
      slug: "margin-thrifting",
      name: "Kalkulator Margin Thrifting & Flipping",
      description: "Hitung HPP barang bekas (harga beli + laundry + reparasi) untuk menentukan harga jual (markup).",
      categoryId: catBisnis!.id,
    },
    {
      slug: "komisi-marketplace",
      name: "Kalkulator Komisi Rekber / Marketplace",
      description: "Hitung potongan admin dan bebas ongkir jika transaksi Cash On Delivery (COD) dialihkan ke link e-commerce.",
      categoryId: catBisnis!.id,
    }
  ];

  for (const calc of batch16_3) {
    await prisma.calculator.upsert({
      where: { slug: calc.slug },
      update: {},
      create: calc,
    });
  }
  console.log("Seeded part 3");
}
main().catch(console.error).finally(() => prisma.$disconnect());
