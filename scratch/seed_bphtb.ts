import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: "properti" } });
  await prisma.calculator.upsert({
    where: { slug: "bphtb-notaris" },
    update: {},
    create: {
      slug: "bphtb-notaris",
      name: "Kalkulator BPHTB & Biaya Notaris",
      description: "Hitung total biaya jual-beli properti: BPHTB pembeli (5%), PPh final penjual (2.5%), dan honor PPAT/Notaris (AJB).",
      categoryId: cat!.id,
    },
  });
  console.log("Seeded: bphtb-notaris");
}
main().catch(console.error).finally(() => prisma.$disconnect());
