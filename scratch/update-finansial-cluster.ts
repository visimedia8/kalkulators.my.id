import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, "bulk-finansial.json");
  const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  for (const item of data) {
    const calc = await prisma.calculator.findUnique({ where: { slug: item.slug } });
    
    if (calc) {
      // Build JSON-LD
      const faqJsonLdObj = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": item.faqQuestions.map((fq: any) => ({
          "@type": "Question",
          "name": fq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": fq.a
          }
        }))
      };
      const faqJsonLdString = `<script type="application/ld+json">\n${JSON.stringify(faqJsonLdObj, null, 2)}\n</script>`;

      await prisma.contentBlock.upsert({
        where: { calculatorId: calc.id },
        update: {
          definitionalH2: item.definitionalH2,
          variablesH2: item.variablesH2,
          actionableH3: item.actionableH3,
          booleanFaqH4: item.booleanFaqH4,
          faqJsonLd: faqJsonLdString
        },
        create: {
          calculatorId: calc.id,
          h1Title: item.h1Title,
          definitionalH2: item.definitionalH2,
          variablesH2: item.variablesH2,
          actionableH3: item.actionableH3,
          booleanFaqH4: item.booleanFaqH4,
          faqJsonLd: faqJsonLdString
        }
      });
      console.log(`[OK] Updated ${item.slug}`);
    }
  }
  console.log("All Finansial Cluster updated successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
