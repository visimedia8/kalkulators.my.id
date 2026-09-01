import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding PSU PC calculator...');

  const catGayaHidup = await prisma.category.upsert({
    where: { slug: 'gaya-hidup' },
    update: {},
    create: {
      slug: 'gaya-hidup',
      name: 'Gaya Hidup & Hobi',
      description: 'Kalkulator fotografi, musik, dan lifestyle.',
    },
  });

  const psuCalc = await prisma.calculator.upsert({
    where: { slug: 'psu-pc' },
    update: {},
    create: {
      slug: 'psu-pc',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Kapasitas PSU (Power Supply) PC Rakitan',
      description: 'Hitung presisi kebutuhan watt PSU PC Rakitan, hindari underpower dan transient spikes.',
    },
  });

  const fullPath = path.join(process.cwd(), 'scratch/seo-psu-pc.json');
  const raw = fs.readFileSync(fullPath, 'utf-8');
  const data = JSON.parse(raw);
  
  await prisma.contentBlock.upsert({
    where: { calculatorId: psuCalc.id },
    update: {
      h1Title: data.h1Title,
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: data.booleanFaqH4,
      faqJsonLd: JSON.stringify(data.faqQuestions)
    },
    create: {
      calculatorId: psuCalc.id,
      h1Title: data.h1Title,
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: data.booleanFaqH4,
      faqJsonLd: JSON.stringify(data.faqQuestions)
    }
  });

  console.log('Successfully seeded psu-pc calculator.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
