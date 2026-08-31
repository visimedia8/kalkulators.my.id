import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("Generating search index...");
  
  const calculators = await prisma.calculator.findMany({
    select: {
      name: true,
      slug: true,
      description: true,
      category: {
        select: {
          name: true,
          slug: true,
        }
      }
    }
  });

  const data = calculators.map(c => ({
    title: c.name,
    url: `/${c.category.slug}/${c.slug}`,
    category: c.category.name,
    description: c.description
  }));

  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, "search.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  
  console.log(`Successfully generated search.json with ${data.length} items.`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
