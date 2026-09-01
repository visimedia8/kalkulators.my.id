import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const calc = await prisma.calculator.findUnique({
    where: { slug: "gear-ratio-motor" },
  });

  if (!calc) {
    console.error("Kalkulator 'gear-ratio-motor' tidak ditemukan di database.");
    return;
  }

  const rawJson = fs.readFileSync(path.join(process.cwd(), "scratch/seo-gear-ratio.json"), "utf8");
  const data = JSON.parse(rawJson);

  const faqJsonLdObj = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqQuestions.map((item: { q: string; a: string }) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a,
      },
    })),
  };

  const faqJsonLdString = `<script type="application/ld+json">\n${JSON.stringify(faqJsonLdObj, null, 2)}\n</script>`;

  await prisma.contentBlock.upsert({
    where: { calculatorId: calc.id },
    update: {
      h1Title: data.h1Title,
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: data.booleanFaqH4,
      faqJsonLd: faqJsonLdString,
    },
    create: {
      calculatorId: calc.id,
      h1Title: data.h1Title,
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: data.booleanFaqH4,
      faqJsonLd: faqJsonLdString,
    },
  });

  console.log("Successfully updated gear-ratio-motor content with Koray Semantic SEO Draft!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
