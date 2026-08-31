import os

seed_path = r"scripts\seed.ts"

with open(seed_path, "r", encoding="utf-8") as f:
    content = f.read()

batch_13_records = """
  // -- BATCH 13 NEW CALCULATORS --
  const gajiHostStreamingCalc = await prisma.calculator.upsert({
    where: { slug: 'gaji-host-streaming' },
    update: {},
    create: {
      slug: 'gaji-host-streaming',
      categoryId: catFinansial.id,
      name: 'Kalkulator Gaji & Withdraw Host Streaming',
      description: 'Hitung konversi Koin/Diamonds ke Rupiah dan potongan agensi secara akurat.',
    },
  });

  const sultanSniperPkCalc = await prisma.calculator.upsert({
    where: { slug: 'sultan-sniper-pk' },
    update: {},
    create: {
      slug: 'sultan-sniper-pk',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Sultan Sniper PK Battle',
      description: 'Hitung defisit koin secara real-time untuk membalikkan keadaan saat PK Battle.',
    },
  });

  const arbitraseTopupKoinCalc = await prisma.calculator.upsert({
    where: { slug: 'arbitrase-topup-koin' },
    update: {},
    create: {
      slug: 'arbitrase-topup-koin',
      categoryId: catFinansial.id,
      name: 'Kalkulator Arbitrase Top-Up Koin',
      description: 'Hitung selisih dan penghematan biaya top-up koin via web vs aplikasi.',
    },
  });

  const kerugianArisanGiftCalc = await prisma.calculator.upsert({
    where: { slug: 'kerugian-arisan-gift' },
    update: {},
    create: {
      slug: 'kerugian-arisan-gift',
      categoryId: catFinansial.id,
      name: 'Kalkulator Kerugian Arisan Gift (Recycling Loss)',
      description: 'Hitung kerugian matematis akibat potongan platform dalam sistem lempar balik gift.',
    },
  });

  const targetHarianAgencyCalc = await prisma.calculator.upsert({
    where: { slug: 'target-harian-agency' },
    update: {},
    create: {
      slug: 'target-harian-agency',
      categoryId: catBisnis.id,
      name: 'Kalkulator Target Harian Agency Bigo & Snack',
      description: 'Pantau sisa target bulanan dan estimasi kebutuhan kuota harian untuk Host.',
    },
  });
"""

batch_13_seeds = """
  await seedContent(gajiHostStreamingCalc.id, 'scratch/gaji-host-streaming.json');
  await seedContent(sultanSniperPkCalc.id, 'scratch/sultan-sniper-pk.json');
  await seedContent(arbitraseTopupKoinCalc.id, 'scratch/arbitrase-topup-koin.json');
  await seedContent(kerugianArisanGiftCalc.id, 'scratch/kerugian-arisan-gift.json');
  await seedContent(targetHarianAgencyCalc.id, 'scratch/target-harian-agency.json');
"""

# Insert right before console.log("Seeding complete!");
insert_idx_1 = content.find('  console.log("Seeding complete!");')
if insert_idx_1 != -1:
    content = content[:insert_idx_1] + batch_13_records + "\n" + batch_13_seeds + "\n" + content[insert_idx_1:]
    with open(seed_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated seed.ts with Batch 13")
else:
    print("Marker not found in seed.ts")
