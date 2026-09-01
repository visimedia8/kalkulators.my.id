import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const kprCalc = await prisma.calculator.findUnique({
    where: { slug: "kpr" }
  });

  if (!kprCalc) {
    console.error("Kalkulator KPR tidak ditemukan di DB.");
    return;
  }

  const rawJson = fs.readFileSync(path.join(process.cwd(), "scratch/kpr-koray.json"), "utf8");
  const data = JSON.parse(rawJson);

  // Generate FAQ JSON-LD from the booleanFaqH4 text
  // We manually map the 4 questions from the subagent text to ensure valid schema
  const faqJsonLdObj = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Apakah debitur dapat melakukan pelunasan KPR lebih cepat (early repayment)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ya. Debitur berhak melakukan pelunasan sebagian maupun seluruh sisa pokok pinjaman sebelum masa tenor berakhir. Namun, mayoritas bank memberlakukan biaya penalti pelunasan dipercepat sebesar 1% hingga 5% dari sisa pokok utang."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah uang muka (DP) KPR 0% berlaku untuk semua calon pembeli properti?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tidak. Fasilitas DP 0% mengacu pada kebijakan pelonggaran LTV Bank Indonesia, tetapi persetujuan akhirnya bergantung pada kebijakan internal bank dan kelayakan SLIK OJK."
        }
      },
      {
        "@type": "Question",
        "name": "Apakah nominal cicilan bulanan KPR sudah mencakup biaya asuransi dan notaris?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tidak. Angsuran bulanan yang dihitung kalkulator KPR murni mencakup pokok dan bunga pinjaman. Biaya pra-realisasi seperti asuransi dan notaris wajib disiapkan terpisah (sekitar 5% - 8% dari plafon)."
        }
      },
      {
        "@type": "Question",
        "name": "Bisakah mengajukan KPR jika masih memiliki cicilan kredit aktif lainnya?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bisa. Debitur dapat mengajukan KPR asalkan riwayat pembayaran lancar (Kolektibilitas 1) dan total cicilan tidak melampaui batas DSR 30%-40% dari penghasilan."
        }
      }
    ]
  };

  const faqJsonLdString = `<script type="application/ld+json">\n${JSON.stringify(faqJsonLdObj, null, 2)}\n</script>`;

  await prisma.contentBlock.upsert({
    where: { calculatorId: kprCalc.id },
    update: {
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: data.booleanFaqH4,
      faqJsonLd: faqJsonLdString
    },
    create: {
      calculatorId: kprCalc.id,
      h1Title: "Kalkulator KPR (Simulasi Kredit Pemilikan Rumah)",
      definitionalH2: data.definitionalH2,
      variablesH2: data.variablesH2,
      actionableH3: data.actionableH3,
      booleanFaqH4: data.booleanFaqH4,
      faqJsonLd: faqJsonLdString
    }
  });

  console.log("Successfully updated KPR content with Koray Semantic SEO Draft!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
