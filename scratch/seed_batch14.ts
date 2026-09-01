import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const catOtomotif = await prisma.category.upsert({
    where: { slug: "otomotif" },
    update: {},
    create: {
      slug: "otomotif",
      name: "Otomotif & Kendaraan",
      description: "Kalkulator modifikasi, pajak, bbnkb, dan operasional kendaraan bermotor.",
      icon: "Car",
    },
  });

  const catBisnis = await prisma.category.findUnique({ where: { slug: "bisnis" } });

  const batch14 = [
    {
      slug: "denda-pajak-kendaraan",
      name: "Kalkulator Denda Pajak (PKB)",
      description: "Hitung total denda pajak mobil/motor mati bertahun-tahun dan SWDKLLJ secara akurat.",
      categoryId: catOtomotif.id,
    },
    {
      slug: "over-kredit-kendaraan",
      name: "Kalkulator Over Kredit Kendaraan",
      description: "Hitung nilai kompensasi wajar untuk over kredit mobil atau motor agar tidak rugi.",
      categoryId: catOtomotif.id,
    },
    {
      slug: "gear-ratio-motor",
      name: "Kalkulator Gear Ratio Motor",
      description: "Hitung persentase tarikan akselerasi vs top speed sebelum modifikasi ukuran gir motor.",
      categoryId: catOtomotif.id,
    },
    {
      slug: "berat-volumetrik-kargo",
      name: "Kalkulator Volumetrik Kargo",
      description: "Hitung berat volumetrik paket besar untuk estimasi ongkos kirim ekspedisi darat/udara.",
      categoryId: catBisnis!.id,
    }
  ];

  for (const calc of batch14) {
    await prisma.calculator.upsert({
      where: { slug: calc.slug },
      update: {},
      create: calc,
    });
  }

  console.log("Batch 14 seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
