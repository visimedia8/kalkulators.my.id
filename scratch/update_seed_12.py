import os

seed_path = r"scripts\seed.ts"

with open(seed_path, "r", encoding="utf-8") as f:
    content = f.read()

batch_12_records = """
  // -- BATCH 12 NEW CALCULATORS --
  const numerologiNamaCalc = await prisma.calculator.upsert({
    where: { slug: 'numerologi-nama' },
    update: {},
    create: {
      slug: 'numerologi-nama',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Numerologi Nama',
      description: 'Hitung Destiny, Soul Urge & Personality berdasarkan nilai huruf nama Pythagoras.',
    },
  });

  const biayaBbmPerjalananCalc = await prisma.calculator.upsert({
    where: { slug: 'biaya-bbm-perjalanan' },
    update: {},
    create: {
      slug: 'biaya-bbm-perjalanan',
      categoryId: catTravel.id,
      name: 'Kalkulator Biaya BBM Perjalanan Roadtrip',
      description: 'Estimasi total konsumsi BBM, uang tol, dan patungan per orang untuk roadtrip.',
    },
  });

  const jetLagZonaWaktuCalc = await prisma.calculator.upsert({
    where: { slug: 'jet-lag-zona-waktu' },
    update: {},
    create: {
      slug: 'jet-lag-zona-waktu',
      categoryId: catTravel.id,
      name: 'Kalkulator Pemulihan Jet-lag & Zona Waktu',
      description: 'Hitung selisih jam dan estimasi waktu pemulihan biologis akibat jet-lag penerbangan jauh.',
    },
  });

  const kompensasiDelayPesawatCalc = await prisma.calculator.upsert({
    where: { slug: 'kompensasi-delay-pesawat' },
    update: {},
    create: {
      slug: 'kompensasi-delay-pesawat',
      categoryId: catTravel.id,
      name: 'Kalkulator Kompensasi Delay Pesawat (Kemenhub)',
      description: 'Cek hak kompensasi penumpang (uang, makanan, hotel) sesuai durasi keterlambatan penerbangan PM 89 Tahun 2015.',
    },
  });
"""

batch_12_seeds = """
  await seedContent(numerologiNamaCalc.id, 'scratch/numerologi-nama.json');
  await seedContent(biayaBbmPerjalananCalc.id, 'scratch/biaya-bbm-perjalanan.json');
  await seedContent(jetLagZonaWaktuCalc.id, 'scratch/jet-lag-zona-waktu.json');
  await seedContent(kompensasiDelayPesawatCalc.id, 'scratch/kompensasi-delay-pesawat.json');
"""

insert_idx_1 = content.find("  // --- CONTENT SEEDING START ---")
content = content[:insert_idx_1] + batch_12_records + "\n" + content[insert_idx_1:]

insert_idx_2 = content.find('  console.log("Seeding complete!");')
content = content[:insert_idx_2] + batch_12_seeds + "\n" + content[insert_idx_2:]

with open(seed_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated seed.ts with Batch 12")
