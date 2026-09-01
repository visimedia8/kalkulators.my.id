import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const catProperti = await prisma.category.findUnique({ where: { slug: "properti" } });
  
  const elektronik = await prisma.category.upsert({
    where: { slug: "elektronik" },
    update: {},
    create: {
      slug: "elektronik",
      name: "Elektronik & Hobi",
      description: "Kalkulator untuk utilitas perangkat elektronik, komponen PC, dan aneka hobi rumah tangga.",
      icon: "Cpu"
    }
  });

  const batch16 = [
    {
      slug: "listrik-kosan",
      name: "Kalkulator Patungan Listrik Kosan",
      description: "Hitung split bill token listrik secara adil berdasarkan kepemilikan alat elektronik (AC, Dispenser) tiap kamar.",
      categoryId: catProperti!.id,
    },
    {
      slug: "kubikasi-kayu",
      name: "Kalkulator Kubikasi Kayu",
      description: "Hitung jumlah batang dan eceran harga kayu (usuk, balok, reng) dalam 1 meter kubik (m3).",
      categoryId: catProperti!.id,
    },
    {
      slug: "plafon-rumah",
      name: "Kalkulator Material Plafon Rumah",
      description: "Estimasi kebutuhan lembar Gypsum, PVC, dan batang hollow berdasarkan ukuran ruangan.",
      categoryId: catProperti!.id,
    },
    {
      slug: "depresiasi-iphone",
      name: "Kalkulator Harga iPhone Bekas",
      description: "Taksir harga wajar jual/beli iPhone second berdasarkan umur pemakaian dan persentase Battery Health (BH).",
      categoryId: elektronik.id,
    },
    {
      slug: "psu-pc",
      name: "Kalkulator Kapasitas PSU (Power Supply)",
      description: "Hitung TDP total (Watt) komponen rakitan PC Anda untuk menentukan PSU minimal yang aman.",
      categoryId: elektronik.id,
    },
    {
      slug: "volume-aquarium",
      name: "Kalkulator Volume Air Aquarium",
      description: "Hitung volume liter air, berat beban kaca, dan kapasitas aman populasi ikan hias Anda.",
      categoryId: elektronik.id,
    }
  ];

  for (const calc of batch16) {
    await prisma.calculator.upsert({
      where: { slug: calc.slug },
      update: {},
      create: calc,
    });
  }

  console.log("Batch 16 Part 2 seeded successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
