import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const raw = fs.readFileSync(path.join(process.cwd(), 'scratch/cat-elektronik.json'), 'utf-8');
  const data = JSON.parse(raw);

  // 1. Create or ensure category exists
  const category = await prisma.category.upsert({
    where: { slug: data.slug },
    update: {},
    create: {
      slug: data.slug,
      name: 'Elektronik & Hobi',
      description: 'Kalkulator Utilitas Elektronik & Hobi Terukur',
    }
  });

  // 2. Generate JSON-LD for FAQ
  let faqJsonLd = null;
  if (data.faqQuestions && data.faqQuestions.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqQuestions.map((q: any) => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.a
        }
      }))
    };
    faqJsonLd = JSON.stringify(faqSchema);
  }

  // Generate booleanFaqH4 text if needed
  let faqContent = data.booleanFaqH4 + '\n\n';
  if (data.faqQuestions) {
      data.faqQuestions.forEach((q: any) => {
          faqContent += `**Q: ${q.q}**\n\nA: ${q.a}\n\n`;
      });
  }

  // 3. Upsert CategoryContentBlock
  await prisma.categoryContentBlock.upsert({
    where: { categoryId: category.id },
    update: {
      h1Title: data.h1Title,
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: faqContent,
      faqJsonLd: faqJsonLd
    },
    create: {
      categoryId: category.id,
      h1Title: data.h1Title,
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: faqContent,
      faqJsonLd: faqJsonLd
    }
  });

  console.log("Success seeding elektronik category!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
