import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. CREATE CATEGORIES
  console.log("Creating categories...");
  const catFinansial = await prisma.category.upsert({
    where: { slug: 'finansial' },
    update: {},
    create: {
      slug: 'finansial',
      name: 'Finansial & Keuangan',
      description: 'Kumpulan kalkulator keuangan, kredit, dan investasi.',
    },
  });

  const catKesehatan = await prisma.category.upsert({
    where: { slug: 'kesehatan' },
    update: {},
    create: {
      slug: 'kesehatan',
      name: 'Kesehatan & Medis',
      description: 'Kalkulator BMI, BMR, dan metrik kesehatan lainnya.',
    },
  });

  const catSains = await prisma.category.upsert({
    where: { slug: 'sains' },
    update: {},
    create: {
      slug: 'sains',
      name: 'Sains & Fisika',
      description: 'Kalkulator konversi metrik ilmiah standar industri.',
    },
  });

  const catIndustri = await prisma.category.upsert({
    where: { slug: 'industri' },
    update: {},
    create: {
      slug: 'industri',
      name: 'Industri & Manufaktur',
      description: 'Kalkulator efisiensi, produktivitas, dan teknis B2B.',
    },
  });

  const catOlahraga = await prisma.category.upsert({
    where: { slug: 'olahraga' },
    update: {},
    create: {
      slug: 'olahraga',
      name: 'Olahraga & Fitness',
      description: 'Metrik VO2 Max, Pace Lari, dan TDEE Kalori.',
    },
  });

  const catProperti = await prisma.category.upsert({
    where: { slug: 'properti' },
    update: {},
    create: {
      slug: 'properti',
      name: 'Properti & Teknik',
      description: 'Kalkulator konstruksi, HVAC, dan real estate.',
    },
  });

  const catBisnis = await prisma.category.upsert({
    where: { slug: 'bisnis' },
    update: {},
    create: {
      slug: 'bisnis',
      name: 'Bisnis & HRD',
      description: 'Kalkulator bisnis, manajemen, dan sumber daya manusia.',
    },
  });

  const catGayaHidup = await prisma.category.upsert({
    where: { slug: 'gaya-hidup' },
    update: {},
    create: {
      slug: 'gaya-hidup',
      name: 'Gaya Hidup & Hobi',
      description: 'Kalkulator fotografi, musik, dan lifestyle.',
    },
  });

  const catAgama = await prisma.category.upsert({
    where: { slug: 'agama' },
    update: {},
    create: {
      slug: 'agama',
      name: 'Agama & Kultur',
      description: 'Kalkulator zakat, waris, dan penanggalan tradisional.',
    },
  });

  const catTravel = await prisma.category.upsert({
    where: { slug: 'travel' },
    update: {},
    create: {
      slug: 'travel',
      name: 'Travel & Wisata',
      description: 'Kalkulator itinerary, budget perjalanan, dan kurs.',
    },
  });

  // 2. CREATE CALCULATORS
  console.log("Creating calculators...");
  
  // -- KPR --
  const kprCalc = await prisma.calculator.upsert({
    where: { slug: 'kpr' },
    update: {},
    create: {
      slug: 'kpr',
      categoryId: catFinansial.id,
      name: 'Kalkulator KPR (Kredit Pemilikan Rumah)',
      description: 'Simulasi cicilan KPR dengan amortisasi akurat.',
    },
  });

  // -- BMI --
  const bmiCalc = await prisma.calculator.upsert({
    where: { slug: 'bmi' },
    update: {},
    create: {
      slug: 'bmi',
      categoryId: catKesehatan.id,
      name: 'Kalkulator BMI & BMR',
      description: 'Hitung Body Mass Index dan kebutuhan kalori harian.',
    },
  });

  // -- DISKON --
  const diskonCalc = await prisma.calculator.upsert({
    where: { slug: 'diskon' },
    update: {},
    create: {
      slug: 'diskon',
      categoryId: catFinansial.id,
      name: 'Kalkulator Diskon & Harga Akhir',
      description: 'Hitung presisi diskon tunggal, ganda, dan potongan pajak.',
    },
  });

  // -- PPH 21 --
  const pph21Calc = await prisma.calculator.upsert({
    where: { slug: 'pph-21' },
    update: {},
    create: {
      slug: 'pph-21',
      categoryId: catFinansial.id,
      name: 'Kalkulator Pajak PPh 21',
      description: 'Simulasi pajak PPh 21 Karyawan (UU HPP terbaru).',
    },
  });

  // -- TEMPERATURE --
  const tempCalc = await prisma.calculator.upsert({
    where: { slug: 'temperature' },
    update: {},
    create: {
      slug: 'temperature',
      categoryId: catSains.id,
      name: 'Kalkulator Konversi Suhu',
      description: 'Konversi Celsius, Fahrenheit, Kelvin, Reamur standar ITS-90.',
    },
  });

  // -- HPL --
  const hplCalc = await prisma.calculator.upsert({
    where: { slug: 'hpl' },
    update: {},
    create: {
      slug: 'hpl',
      categoryId: catKesehatan.id,
      name: 'Kalkulator HPL (Hari Perkiraan Lahir)',
      description: 'Hitung usia kehamilan dan estimasi persalinan presisi.',
    },
  });

  // -- STUNTING --
  const stuntingCalc = await prisma.calculator.upsert({
    where: { slug: 'stunting' },
    update: {},
    create: {
      slug: 'stunting',
      categoryId: catKesehatan.id,
      name: 'Kalkulator Stunting Bayi & Balita (Z-Score)',
      description: 'Hitung Z-Score TB/U standar WHO dan deteksi dini stunting.',
    },
  });

  // -- INFUS --
  const infusCalc = await prisma.calculator.upsert({
    where: { slug: 'tetes-infus' },
    update: {},
    create: {
      slug: 'tetes-infus',
      categoryId: catKesehatan.id,
      name: 'Kalkulator Tetes Infus (TPM)',
      description: 'Kalkulasi laju aliran infus klinis (makro/mikro drip).',
    },
  });

  // -- GFR --
  const gfrCalc = await prisma.calculator.upsert({
    where: { slug: 'gfr' },
    update: {},
    create: {
      slug: 'gfr',
      categoryId: catKesehatan.id,
      name: 'Kalkulator eGFR & Klasifikasi Ginjal',
      description: 'Estimasi fungsi ginjal menggunakan formula CKD-EPI dan MDRD.',
    },
  });

  // -- DOSIS ANAK --
  const dosisAnakCalc = await prisma.calculator.upsert({
    where: { slug: 'dosis-anak' },
    update: {},
    create: {
      slug: 'dosis-anak',
      categoryId: catKesehatan.id,
      name: 'Kalkulator Dosis Obat Anak (BSA)',
      description: 'Konversi presisi dosis dewasa ke anak menggunakan DuBois BSA.',
    },
  });

  // -- FCR --
  const fcrCalc = await prisma.calculator.upsert({
    where: { slug: 'fcr' },
    update: {},
    create: {
      slug: 'fcr',
      categoryId: catIndustri.id,
      name: 'Kalkulator FCR (Feed Conversion Ratio)',
      description: 'Hitung efisiensi pakan ternak komersial.',
    },
  });

  // -- PACE LARI --
  const paceLariCalc = await prisma.calculator.upsert({
    where: { slug: 'pace-lari' },
    update: {},
    create: {
      slug: 'pace-lari',
      categoryId: catOlahraga.id,
      name: 'Kalkulator Pace Lari',
      description: 'Hitung waktu tempuh lomba dan pace lari presisi.',
    },
  });

  // -- TDEE --
  const tdeeCalc = await prisma.calculator.upsert({
    where: { slug: 'tdee' },
    update: {},
    create: {
      slug: 'tdee',
      categoryId: catOlahraga.id, // atau catKesehatan
      name: 'Kalkulator TDEE (Kebutuhan Kalori)',
      description: 'Hitung kalori harian presisi untuk bulking/cutting.',
    },
  });

  // -- OEE --
  const oeeCalc = await prisma.calculator.upsert({
    where: { slug: 'oee' },
    update: {},
    create: {
      slug: 'oee',
      categoryId: catIndustri.id,
      name: 'Kalkulator OEE Manufaktur',
      description: 'Hitung efisiensi peralatan (Availability, Performance, Quality).',
    },
  });

  // -- BTU AC --
  const btuAcCalc = await prisma.calculator.upsert({
    where: { slug: 'btu-ac' },
    update: {},
    create: {
      slug: 'btu-ac',
      categoryId: catProperti.id,
      name: 'Kalkulator Kapasitas BTU AC',
      description: 'Hitung kebutuhan PK AC ruangan berdasarkan standar ASHRAE.',
    },
  });


  // -- KEMIRINGAN ATAP --
  const atapCalc = await prisma.calculator.upsert({
    where: { slug: 'kemiringan-atap' },
    update: {},
    create: {
      slug: 'kemiringan-atap',
      categoryId: catProperti.id,
      name: 'Kalkulator Kemiringan Atap',
      description: 'Hitung presisi sudut dan panjang material atap (pitch/rise/run).',
    },
  });

  // -- TURNOVER RATE --
  const turnoverCalc = await prisma.calculator.upsert({
    where: { slug: 'turnover-rate' },
    update: {},
    create: {
      slug: 'turnover-rate',
      categoryId: catBisnis.id,
      name: 'Kalkulator Turnover Rate Karyawan',
      description: 'Hitung tingkat perputaran dan retensi SDM perusahaan.',
    },
  });

  // -- JEJAK KARBON --
  const karbonCalc = await prisma.calculator.upsert({
    where: { slug: 'jejak-karbon' },
    update: {},
    create: {
      slug: 'jejak-karbon',
      categoryId: catSains.id,
      name: 'Kalkulator Jejak Karbon',
      description: 'Hitung emisi CO2 rumah tangga dan offset pohon presisi.',
    },
  });

  // -- DOF KAMERA --
  const dofCalc = await prisma.calculator.upsert({
    where: { slug: 'dof-kamera' },
    update: {},
    create: {
      slug: 'dof-kamera',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Depth of Field (DoF)',
      description: 'Hitung jarak hiperfokal dan kedalaman ruang kamera presisi.',
    },
  });

  // -- BPM TO MS --
  const bpmCalc = await prisma.calculator.upsert({
    where: { slug: 'bpm-to-ms' },
    update: {},
    create: {
      slug: 'bpm-to-ms',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator BPM ke Milidetik',
      description: 'Konversi tempo BPM ke milidetik untuk delay dan reverb audio.',
    },
  });

  // -- MOLARITAS --
  const molaritasCalc = await prisma.calculator.upsert({
    where: { slug: 'molaritas' },
    update: {},
    create: {
      slug: 'molaritas',
      categoryId: catSains.id,
      name: 'Kalkulator Molaritas & Pengenceran Kimia',
      description: 'Hitung presisi pengenceran larutan dan konsentrasi (V1xM1 = V2xM2).',
    },
  });

  // -- KAIN BAJU --
  const kainCalc = await prisma.calculator.upsert({
    where: { slug: 'kain-baju' },
    update: {},
    create: {
      slug: 'kain-baju',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Kebutuhan Kain per Pola Baju',
      description: 'Hitung kebutuhan bahan tekstil konveksi berdasarkan pola potong.',
    },
  });

  // -- ZAKAT MAL --
  const zakatCalc = await prisma.calculator.upsert({
    where: { slug: 'zakat-mal' },
    update: {},
    create: {
      slug: 'zakat-mal',
      categoryId: catAgama.id,
      name: 'Kalkulator Zakat Mal',
      description: 'Hitung kewajiban zakat mal presisi standar nisab emas syariah.',
    },
  });

  // -- BUDGET TRAVEL --
  const travelCalc = await prisma.calculator.upsert({
    where: { slug: 'budget-travel' },
    update: {},
    create: {
      slug: 'budget-travel',
      categoryId: catTravel.id,
      name: 'Kalkulator Budget Itinerary Harian',
      description: 'Rencana anggaran presisi transportasi, hotel, dan uang saku travel.',
    },
  });

  // -- WETON JAWA --
  const wetonCalc = await prisma.calculator.upsert({
    where: { slug: 'weton-jawa' },
    update: {},
    create: {
      slug: 'weton-jawa',
      categoryId: catAgama.id,
      name: 'Kalkulator Weton Jawa & Hari Baik',
      description: 'Hitung neptu kelahiran, watak pasaran, dan kesesuaian hajatan.',
    },
  });

  // -- BATCH 6 NEW CALCULATORS --
  const gcsCalc = await prisma.calculator.upsert({
    where: { slug: 'gcs' },
    update: {},
    create: {
      slug: 'gcs',
      categoryId: catKesehatan.id,
      name: 'Kalkulator Glasgow Coma Scale (GCS)',
      description: 'Hitung skor tingkat kesadaran GCS secara cepat dan presisi.',
    },
  });

  const apgarCalc = await prisma.calculator.upsert({
    where: { slug: 'apgar' },
    update: {},
    create: {
      slug: 'apgar',
      categoryId: catKesehatan.id,
      name: 'Kalkulator Skor APGAR',
      description: 'Penilaian klinis kondisi kesehatan bayi baru lahir (neonatus).',
    },
  });

  const makroNutrisiCalc = await prisma.calculator.upsert({
    where: { slug: 'makro-nutrisi' },
    update: {},
    create: {
      slug: 'makro-nutrisi',
      categoryId: catKesehatan.id,
      name: 'Kalkulator Makro Nutrisi & Diet',
      description: 'Hitung kebutuhan kalori dan distribusi makro nutrisi (Protein, Lemak, Karbo).',
    },
  });

  const karvonenCalc = await prisma.calculator.upsert({
    where: { slug: 'karvonen' },
    update: {},
    create: {
      slug: 'karvonen',
      categoryId: catOlahraga.id,
      name: 'Kalkulator Heart Rate Zone (Karvonen)',
      description: 'Hitung zona detak jantung latihan berdasar metode Karvonen presisi.',
    },
  });

  const masaSuburCalc = await prisma.calculator.upsert({
    where: { slug: 'masa-subur' },
    update: {},
    create: {
      slug: 'masa-subur',
      categoryId: catKesehatan.id, // using Kesehatan since Parenting doesn't exist
      name: 'Kalkulator Masa Subur & Ovulasi',
      description: 'Prediksi masa subur, ovulasi, dan haid selanjutnya secara presisi.',
    },
  });

  // -- BATCH 7 NEW CALCULATORS --
  const kinematikaCalc = await prisma.calculator.upsert({
    where: { slug: 'kinematika-fisika' },
    update: {},
    create: {
      slug: 'kinematika-fisika',
      categoryId: catSains.id,
      name: 'Kalkulator Kinematika Fisika (GLBB)',
      description: 'Hitung kecepatan, percepatan, jarak dan waktu GLBB presisi.',
    },
  });

  const ohmCalc = await prisma.calculator.upsert({
    where: { slug: 'hukum-ohm' },
    update: {},
    create: {
      slug: 'hukum-ohm',
      categoryId: catSains.id,
      name: 'Kalkulator Hukum Ohm & Daya',
      description: 'Hitung tegangan, arus, hambatan, dan daya listrik presisi.',
    },
  });

  const paruhCalc = await prisma.calculator.upsert({
    where: { slug: 'waktu-paruh' },
    update: {},
    create: {
      slug: 'waktu-paruh',
      categoryId: catSains.id,
      name: 'Kalkulator Waktu Paruh Peluruhan',
      description: 'Kalkulasi kinetika peluruhan radioaktif inti atom presisi.',
    },
  });

  const punnettCalc = await prisma.calculator.upsert({
    where: { slug: 'punnett-square' },
    update: {},
    create: {
      slug: 'punnett-square',
      categoryId: catSains.id,
      name: 'Kalkulator Punnett Square Genetik',
      description: 'Simulasi persilangan monohibrid & probabilitas alel genotipe.',
    },
  });

  const bitrateCalc = await prisma.calculator.upsert({
    where: { slug: 'bitrate-video' },
    update: {},
    create: {
      slug: 'bitrate-video',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Storage & Bitrate Video',
      description: 'Hitung kebutuhan memori dan ukuran file rekaman video presisi.',
    },
  });
  // -- BATCH 8 NEW CALCULATORS --
  const timelapseCalc = await prisma.calculator.upsert({
    where: { slug: 'interval-timelapse' },
    update: {},
    create: {
      slug: 'interval-timelapse',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Interval Timelapse',
      description: 'Hitung total frame, shutter, dan penyimpanan timelapse presisi.',
    },
  });

  const ndFilterCalc = await prisma.calculator.upsert({
    where: { slug: 'nd-filter' },
    update: {},
    create: {
      slug: 'nd-filter',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator ND Filter (Long Exposure)',
      description: 'Hitung shutter speed akhir untuk ND Filter fotografi presisi.',
    },
  });

  const cropFactorCalc = await prisma.calculator.upsert({
    where: { slug: 'crop-factor' },
    update: {},
    create: {
      slug: 'crop-factor',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator FoV & Crop Factor',
      description: 'Hitung fokal ekuivalen 35mm dan sudut pandang (FoV) presisi.',
    },
  });

  const dayaAmpCalc = await prisma.calculator.upsert({
    where: { slug: 'daya-amplifier' },
    update: {},
    create: {
      slug: 'daya-amplifier',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Daya Amplifier Speaker',
      description: 'Kalkulasi pencocokan impedansi amplifier dan speaker audio.',
    },
  });

  const golonganDarahCalc = await prisma.calculator.upsert({
    where: { slug: 'golongan-darah' },
    update: {},
    create: {
      slug: 'golongan-darah',
      categoryId: catKesehatan.id,
      name: 'Kalkulator Golongan Darah Genetik',
      description: 'Prediksi kemungkinan golongan darah anak berdasarkan pewarisan gen.',
    },
  });
  // -- BATCH 9 NEW CALCULATORS --
  const warisCalc = await prisma.calculator.upsert({
    where: { slug: 'waris-islam' },
    update: {},
    create: {
      slug: 'waris-islam',
      categoryId: catAgama.id,
      name: 'Kalkulator Waris Islam (Faraidh)',
      description: 'Hitung presisi pembagian warisan sesuai syariat Islam dan KHI.',
    },
  });

  const fidyahCalc = await prisma.calculator.upsert({
    where: { slug: 'fidyah-kifarat' },
    update: {},
    create: {
      slug: 'fidyah-kifarat',
      categoryId: catAgama.id,
      name: 'Kalkulator Fidyah & Kifarat',
      description: 'Kalkulasi denda ibadah puasa dan sumpah berdasarkan standar baznas.',
    },
  });

  const zodiakCalc = await prisma.calculator.upsert({
    where: { slug: 'zodiak' },
    update: {},
    create: {
      slug: 'zodiak',
      categoryId: catAgama.id,
      name: 'Kalkulator Zodiak (Sun/Moon/Rising)',
      description: 'Hitung astrotropis The Big Three dan komposisi elemen kelahirannmu.',
    },
  });

  const splitBillCalc = await prisma.calculator.upsert({
    where: { slug: 'split-bill' },
    update: {},
    create: {
      slug: 'split-bill',
      categoryId: catTravel.id,
      name: 'Kalkulator Split Bill & Patungan',
      description: 'Hitung patungan tagihan restoran termasuk pajak dan service charge secara adil.',
    },
  });

  const pernikahanCalc = await prisma.calculator.upsert({
    where: { slug: 'budget-pernikahan' },
    update: {},
    create: {
      slug: 'budget-pernikahan',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Budget Pernikahan',
      description: 'Estimasi anggaran resepsi dan vendor pernikahan sesuai standar pasar.',
    },
  });
  // -- BATCH 10 NEW CALCULATORS --
  const imunisasiCalc = await prisma.calculator.upsert({
    where: { slug: 'jadwal-imunisasi' },
    update: {},
    create: {
      slug: 'jadwal-imunisasi',
      categoryId: catKesehatan.id,
      name: 'Kalkulator Jadwal Imunisasi Anak',
      description: 'Cek jadwal imunisasi IDAI berdasarkan tanggal lahir anak.',
    },
  });

  const akustikCalc = await prisma.calculator.upsert({
    where: { slug: 'akustik-ruangan' },
    update: {},
    create: {
      slug: 'akustik-ruangan',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Akustik Ruangan (Room Modes)',
      description: 'Hitung mode axial, tangential, dan resonansi frekuensi studio audio.',
    },
  });

  const senarCalc = await prisma.calculator.upsert({
    where: { slug: 'tegangan-senar' },
    update: {},
    create: {
      slug: 'tegangan-senar',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Tegangan Senar Gitar',
      description: 'Hitung lbs tension senar instrumen musik dengan presisi luthier.',
    },
  });

  const sepatuCalc = await prisma.calculator.upsert({
    where: { slug: 'ukuran-sepatu' },
    update: {},
    create: {
      slug: 'ukuran-sepatu',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Konversi Ukuran Sepatu',
      description: 'Konversi ukuran sepatu US, UK, EU, dan JP berdasarkan panjang kaki.',
    },
  });

  const hppCalc = await prisma.calculator.upsert({
    where: { slug: 'hpp-konveksi' },
    update: {},
    create: {
      slug: 'hpp-konveksi',
      categoryId: catBisnis.id,
      name: 'Kalkulator HPP Konveksi & Harga Jual',
      description: 'Hitung biaya pokok produksi dan margin keuntungan konveksi tekstil.',
    },
  });

  // -- BATCH 11 NEW CALCULATORS --
  const gradingBajuCalc = await prisma.calculator.upsert({
    where: { slug: 'grading-baju' },
    update: {},
    create: {
      slug: 'grading-baju',
      categoryId: catBisnis.id,
      name: 'Kalkulator Pola Grading Baju',
      description: 'Hitung penambahan/pengurangan ukuran baju (S, M, L, XL, dll) dari base size dengan toleransi.',
    },
  });

  const benangRajutCalc = await prisma.calculator.upsert({
    where: { slug: 'benang-rajut' },
    update: {},
    create: {
      slug: 'benang-rajut',
      categoryId: catGayaHidup.id,
      name: 'Kalkulator Kebutuhan Panjang Benang Rajut',
      description: 'Estimasi panjang dan gulungan benang rajut yang dibutuhkan untuk luas pakaian/syal.',
    },
  });

  const baziCalc = await prisma.calculator.upsert({
    where: { slug: 'bazi-astrologi' },
    update: {},
    create: {
      slug: 'bazi-astrologi',
      categoryId: catAgama.id,
      name: 'Kalkulator BaZi (Four Pillars)',
      description: 'Analisis pilar nasib (Jam, Hari, Bulan, Tahun) astrologi Tiongkok kuno.',
    },
  });

  const kurbanCalc = await prisma.calculator.upsert({
    where: { slug: 'pembagian-kurban' },
    update: {},
    create: {
      slug: 'pembagian-kurban',
      categoryId: catAgama.id,
      name: 'Kalkulator Pembagian Daging Kurban',
      description: 'Hitung distribusi daging kurban 1/3 shohibul, 1/3 hadiah, 1/3 fakir miskin.',
    },
  });

  const kuaCalc = await prisma.calculator.upsert({
    where: { slug: 'kua-number' },
    update: {},
    create: {
      slug: 'kua-number',
      categoryId: catAgama.id,
      name: 'Kalkulator Kua Number Fengshui',
      description: 'Cari angka Kua dan elemen nasib untuk arah mata angin terbaik (Sheng Chi, Tien Yi).',
    },
  });

  // 3. SEED CONTENT BLOCKS
  console.log("Seeding Content Blocks (Reading from scratch/)...");

  const seedContent = async (calcId: string, jsonPath: string) => {
    try {
      const fullPath = path.join(process.cwd(), jsonPath);
      if (!fs.existsSync(fullPath)) {
        console.log(`Skipping ${jsonPath}, file not found.`);
        return;
      }
      
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const data = JSON.parse(raw);
      
      await prisma.contentBlock.upsert({
        where: { calculatorId: calcId },
        update: {
          h1Title: data.h1Title || `Kalkulator ${data.slug}`,
          definitionalH2: data.definitionalH2,
          variablesH2: data.variablesH2,
          actionableH3: data.actionableH3,
          booleanFaqH4: data.booleanFaqH4,
          faqJsonLd: data.faqJsonLd
        },
        create: {
          calculatorId: calcId,
          h1Title: data.h1Title || `Kalkulator ${data.slug}`,
          definitionalH2: data.definitionalH2,
          variablesH2: data.variablesH2,
          actionableH3: data.actionableH3,
          booleanFaqH4: data.booleanFaqH4,
          faqJsonLd: data.faqJsonLd
        }
      });
    } catch (err) {
      console.log(`Error parsing JSON for ${jsonPath}:`, err);
    }
  };

  // We skip KPR and BMI JSON seeding for now since their scratch files are still .md, 
  // or we can convert them to JSON later. For now let's focus on the new ones.
  await seedContent(diskonCalc.id, 'scratch/discount-seo.json');
  await seedContent(pph21Calc.id, 'scratch/pph21-seo.json');
  await seedContent(tempCalc.id, 'scratch/temperature-seo.json');
  await seedContent(hplCalc.id, 'scratch/hpl-seo.json');
  await seedContent(stuntingCalc.id, 'scratch/stunting-seo.json');
  await seedContent(infusCalc.id, 'scratch/infus-seo.json');
  await seedContent(gfrCalc.id, 'scratch/gfr-seo.json');
  await seedContent(dosisAnakCalc.id, 'scratch/dosis-anak-seo.json');
  await seedContent(fcrCalc.id, 'scratch/fcr-seo.json');
  await seedContent(paceLariCalc.id, 'scratch/pace-lari-seo.json');
  await seedContent(tdeeCalc.id, 'scratch/tdee-seo.json');
  await seedContent(oeeCalc.id, 'scratch/oee-seo.json');
  await seedContent(btuAcCalc.id, 'scratch/btu-ac-seo.json');
  await seedContent(atapCalc.id, 'scratch/kemiringan-atap-seo.json');
  await seedContent(turnoverCalc.id, 'scratch/turnover-rate-seo.json');
  await seedContent(karbonCalc.id, 'scratch/jejak-karbon-seo.json');
  await seedContent(dofCalc.id, 'scratch/dof-kamera-seo.json');
  await seedContent(bpmCalc.id, 'scratch/bpm-to-ms-seo.json');
  await seedContent(molaritasCalc.id, 'scratch/molaritas-seo.json');
  await seedContent(kainCalc.id, 'scratch/kain-baju-seo.json');
  await seedContent(zakatCalc.id, 'scratch/zakat-mal-seo.json');
  await seedContent(travelCalc.id, 'scratch/budget-travel-seo.json');
  await seedContent(wetonCalc.id, 'scratch/weton-jawa-seo.json');

  await seedContent(gcsCalc.id, 'scratch/gcs.json');
  await seedContent(apgarCalc.id, 'scratch/apgar.json');
  await seedContent(makroNutrisiCalc.id, 'scratch/makro-nutrisi.json');
  await seedContent(karvonenCalc.id, 'scratch/karvonen.json');
  await seedContent(masaSuburCalc.id, 'scratch/masa-subur.json');

  await seedContent(kinematikaCalc.id, 'scratch/kinematika-fisika.json');
  await seedContent(ohmCalc.id, 'scratch/hukum-ohm.json');
  await seedContent(paruhCalc.id, 'scratch/waktu-paruh.json');
  await seedContent(punnettCalc.id, 'scratch/punnett-square.json');
  await seedContent(bitrateCalc.id, 'scratch/bitrate-video.json');

  await seedContent(timelapseCalc.id, 'scratch/interval-timelapse.json');
  await seedContent(ndFilterCalc.id, 'scratch/nd-filter.json');
  await seedContent(cropFactorCalc.id, 'scratch/crop-factor.json');
  await seedContent(dayaAmpCalc.id, 'scratch/daya-amplifier.json');
  await seedContent(golonganDarahCalc.id, 'scratch/golongan-darah.json');

  await seedContent(warisCalc.id, 'scratch/waris-islam.json');
  await seedContent(fidyahCalc.id, 'scratch/fidyah-kifarat.json');
  await seedContent(zodiakCalc.id, 'scratch/zodiak.json');
  await seedContent(splitBillCalc.id, 'scratch/split-bill.json');
  await seedContent(pernikahanCalc.id, 'scratch/budget-pernikahan.json');

  await seedContent(imunisasiCalc.id, 'scratch/jadwal-imunisasi.json');
  await seedContent(akustikCalc.id, 'scratch/akustik-ruangan.json');
  await seedContent(senarCalc.id, 'scratch/tegangan-senar.json');
  await seedContent(sepatuCalc.id, 'scratch/ukuran-sepatu.json');
  await seedContent(hppCalc.id, 'scratch/hpp-konveksi.json');

  await seedContent(gradingBajuCalc.id, 'scratch/grading-baju.json');
  await seedContent(benangRajutCalc.id, 'scratch/benang-rajut.json');
  await seedContent(baziCalc.id, 'scratch/bazi-astrologi.json');
  await seedContent(kurbanCalc.id, 'scratch/pembagian-kurban.json');
  await seedContent(kuaCalc.id, 'scratch/kua-number.json');


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

  await seedContent(numerologiNamaCalc.id, 'scratch/numerologi-nama.json');
  await seedContent(biayaBbmPerjalananCalc.id, 'scratch/biaya-bbm-perjalanan.json');
  await seedContent(jetLagZonaWaktuCalc.id, 'scratch/jet-lag-zona-waktu.json');
  await seedContent(kompensasiDelayPesawatCalc.id, 'scratch/kompensasi-delay-pesawat.json');


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


  await seedContent(gajiHostStreamingCalc.id, 'scratch/gaji-host-streaming.json');
  await seedContent(sultanSniperPkCalc.id, 'scratch/sultan-sniper-pk.json');
  await seedContent(arbitraseTopupKoinCalc.id, 'scratch/arbitrase-topup-koin.json');
  await seedContent(kerugianArisanGiftCalc.id, 'scratch/kerugian-arisan-gift.json');
  await seedContent(targetHarianAgencyCalc.id, 'scratch/target-harian-agency.json');

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

