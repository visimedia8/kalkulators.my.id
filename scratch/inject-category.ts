import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = process.argv[2];
  if (!jsonPath) throw new Error("Missing json path");
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  
  const cat = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (cat) {
    const faqJsonLdObj = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.faqQuestions.map((fq: any) => ({
        "@type": "Question",
        "name": fq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": fq.a
        }
      }))
    };
    const faqJsonLdString = `<script type="application/ld+json">\n${JSON.stringify(faqJsonLdObj, null, 2)}\n</script>`;

    await prisma.categoryContentBlock.upsert({
      where: { categoryId: cat.id },
      update: {
        h1Title: data.h1Title,
        definitionalH2: data.definitionalH2,
        variablesH2: data.variablesH2,
        actionableH3: data.actionableH3,
        booleanFaqH4: data.booleanFaqH4,
        faqJsonLd: faqJsonLdString
      },
      create: {
        categoryId: cat.id,
        h1Title: data.h1Title,
        definitionalH2: data.definitionalH2,
        variablesH2: data.variablesH2,
        actionableH3: data.actionableH3,
        booleanFaqH4: data.booleanFaqH4,
        faqJsonLd: faqJsonLdString
      }
    });
    console.log(`[OK] Injected Category ${data.slug}`);
  } else {
    console.log(`[ERROR] Category Slug ${data.slug} not found`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
