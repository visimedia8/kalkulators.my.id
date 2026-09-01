import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(process.cwd(), "scratch", "seo-shu-koperasi.json");
  const raw = fs.readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  const catBisnis = await prisma.category.findUnique({ where: { slug: "bisnis" } });
  if (!catBisnis) {
    throw new Error("Category 'bisnis' not found!");
  }

  const calc = await prisma.calculator.upsert({
    where: { slug: "shu-koperasi" },
    update: {
      name: "Kalkulator Pembagian SHU Koperasi",
      description: "Hitung otomatis jatah Sisa Hasil Usaha berdasarkan Jasa Modal dan Jasa Anggota (Transaksi).",
    },
    create: {
      slug: "shu-koperasi",
      name: "Kalkulator Pembagian SHU Koperasi",
      description: "Hitung otomatis jatah Sisa Hasil Usaha berdasarkan Jasa Modal dan Jasa Anggota (Transaksi).",
      categoryId: catBisnis.id,
    },
  });

  const contentBlock = await prisma.contentBlock.upsert({
    where: { calculatorId: calc.id },
    update: {
      h1Title: data.h1Title,
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: data.booleanFaqH4,
      faqJsonLd: JSON.stringify(data.faqQuestions || []),
    },
    create: {
      calculatorId: calc.id,
      h1Title: data.h1Title,
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: data.booleanFaqH4,
      faqJsonLd: JSON.stringify(data.faqQuestions || []),
    },
  });

  console.log("Successfully seeded SHU Koperasi ContentBlock ID:", contentBlock.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
