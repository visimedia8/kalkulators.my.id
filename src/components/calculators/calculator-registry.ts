import dynamic from "next/dynamic";
import { ComponentType } from "react";

export const CALCULATOR_REGISTRY: Record<string, ComponentType<any>> = {
  kpr: dynamic(() => import("./kpr-calculator").then((m) => m.KprCalculator)),
  bmi: dynamic(() => import("./bmi-calculator").then((m) => m.BmiCalculator)),
  "diskon": dynamic(() => import('./discount-calculator').then(m => m.DiscountCalculator)),
  "pph-21": dynamic(() => import('./pph21-calculator').then(m => m.Pph21Calculator)),
  "temperature": dynamic(() => import('./temperature-calculator').then(m => m.TemperatureCalculator)),
  
  // Sequence D (Medis & Parenting)
  "hpl": dynamic(() => import('./hpl-calculator').then(m => m.HplCalculator)),
  "stunting": dynamic(() => import('./stunting-calculator').then(m => m.StuntingCalculator)),
  "tetes-infus": dynamic(() => import('./infus-calculator').then(m => m.InfusCalculator)),
  "gfr": dynamic(() => import('./gfr-calculator').then(m => m.GfrCalculator)),
  "dosis-anak": dynamic(() => import('./dosis-anak-calculator').then(m => m.DosisAnakCalculator)),

  // Sequence E (Industri, Olahraga, Teknik)
  "fcr": dynamic(() => import('./fcr-calculator').then(m => m.FcrCalculator)),
  "pace-lari": dynamic(() => import('./pace-lari-calculator').then(m => m.PaceCalculator)),
  "tdee": dynamic(() => import('./tdee-calculator').then(m => m.TdeeCalculator)),
  "oee": dynamic(() => import('./oee-calculator').then(m => m.OeeCalculator)),
  "btu-ac": dynamic(() => import('./btu-ac-calculator').then(m => m.BtuAcCalculator)),

  // Sequence F (Lifestyles & Profession)
  "kemiringan-atap": dynamic(() => import('./kemiringan-atap-calculator').then(m => m.KemiringanAtapCalculator)),
  "turnover-rate": dynamic(() => import('./turnover-rate-calculator').then(m => m.TurnoverRateCalculator)),
  "dof-kamera": dynamic(() => import('./dof-kamera-calculator').then(m => m.DofCalculator)),
  "jejak-karbon": dynamic(() => import('./jejak-karbon-calculator').then(m => m.JejakKarbonCalculator)),
  "bpm-to-ms": dynamic(() => import('./bpm-to-ms-calculator').then(m => m.BpmToMsCalculator)),

  // Sequence G (Kultur, Fashion & Keuangan)
  "molaritas": dynamic(() => import('./molaritas-calculator').then(m => m.MolaritasCalculator)),
  "kain-baju": dynamic(() => import('./kain-baju-calculator').then(m => m.KainBajuCalculator)),
  "zakat-mal": dynamic(() => import('./zakat-mal-calculator').then(m => m.ZakatMalCalculator)),
  "budget-travel": dynamic(() => import('./budget-travel-calculator').then(m => m.ItineraryBudgetCalculator)),
  "weton-jawa": dynamic(() => import('./weton-jawa-calculator').then(m => m.WetonCalculator)),

  // Batch 6
  "karvonen": dynamic(() => import('./karvonen-calculator').then(m => m.KarvonenCalculator)),
  "masa-subur": dynamic(() => import('./masa-subur-calculator').then(m => m.MasaSuburCalculator)),
  "makro-nutrisi": dynamic(() => import('./makro-nutrisi-calculator').then(m => m.MakroNutrisiCalculator)),
  "gcs": dynamic(() => import('./gcs-calculator').then(m => m.GcsCalculator)),
  "apgar": dynamic(() => import('./apgar-calculator').then(m => m.ApgarCalculator)),

  // Batch 7
  "kinematika-fisika": dynamic(() => import('./kinematika-fisika-calculator').then(m => m.KinematikaFisikaCalculator)),
  "hukum-ohm": dynamic(() => import('./hukum-ohm-calculator').then(m => m.HukumOhmCalculator)),
  "bitrate-video": dynamic(() => import("./bitrate-video-calculator").then(mod => mod.BitrateVideoCalculator)),
  "waktu-paruh": dynamic(() => import('./waktu-paruh-calculator').then(m => m.WaktuParuhCalculator)),
  "punnett-square": dynamic(() => import('./punnett-square-calculator').then(m => m.PunnettSquareCalculator)),

  // Batch 8
  "interval-timelapse": dynamic(() => import("./interval-timelapse-calculator").then(mod => mod.IntervalTimelapseCalculator)),
  "nd-filter": dynamic(() => import("./nd-filter-calculator").then(mod => mod.NdFilterCalculator)),
  "crop-factor": dynamic(() => import("./crop-factor-calculator").then(mod => mod.CropFactorCalculator)),
  "daya-amplifier": dynamic(() => import("./daya-amplifier-calculator").then(mod => mod.DayaAmplifierCalculator)),
  "golongan-darah": dynamic(() => import("./golongan-darah-calculator").then(mod => mod.GolonganDarahCalculator)),

  // Batch 9
  "waris-islam": dynamic(() => import("./waris-islam-calculator").then(mod => mod.WarisIslamCalculator)),
  "fidyah-kifarat": dynamic(() => import("./fidyah-kifarat-calculator").then(mod => mod.FidyahKifaratCalculator)),
  "zodiak": dynamic(() => import("./zodiak-calculator").then(mod => mod.ZodiakCalculator)),
  "split-bill": dynamic(() => import("./split-bill-calculator").then(mod => mod.SplitBillCalculator)),
  "budget-pernikahan": dynamic(() => import("./budget-pernikahan-calculator").then(mod => mod.BudgetPernikahanCalculator)),
  
  // Batch 10
  "jadwal-imunisasi": dynamic(() => import("./jadwal-imunisasi-calculator").then(mod => mod.JadwalImunisasiCalculator)),
  "akustik-ruangan": dynamic(() => import("./akustik-ruangan-calculator").then(mod => mod.AkustikRuanganCalculator)),
  "tegangan-senar": dynamic(() => import("./tegangan-senar-calculator").then(mod => mod.TeganganSenarCalculator)),
  "ukuran-sepatu": dynamic(() => import("./ukuran-sepatu-calculator").then(mod => mod.UkuranSepatuCalculator)),
  "hpp-konveksi": dynamic(() => import("./hpp-konveksi-calculator").then(mod => mod.HppKonveksiCalculator)),

  // Batch 11
  'grading-baju': dynamic(() => import('./grading-baju-calculator').then(mod => mod.GradingBajuCalculator)),
  'benang-rajut': dynamic(() => import('./benang-rajut-calculator').then(mod => mod.BenangRajutCalculator)),
  'bazi-astrologi': dynamic(() => import('./bazi-astrologi-calculator').then(mod => mod.BaziAstrologiCalculator)),
  'pembagian-kurban': dynamic(() => import('./pembagian-kurban-calculator').then(mod => mod.KurbanCalculator)),
  'kua-number': dynamic(() => import('./kua-number-calculator').then(mod => mod.KuaNumberCalculator)),

  // Batch 12
  'numerologi-nama': dynamic(() => import('./numerologi-nama-calculator').then(mod => mod.NumerologiNamaCalculator)),
  'biaya-bbm-perjalanan': dynamic(() => import('./biaya-bbm-perjalanan-calculator').then(mod => mod.BiayaBbmPerjalananCalculator)),
  'jet-lag-zona-waktu': dynamic(() => import('./jet-lag-zona-waktu-calculator').then(mod => mod.JetLagZonaWaktuCalculator)),
  'kompensasi-delay-pesawat': dynamic(() => import('./kompensasi-delay-pesawat-calculator').then(mod => mod.KompensasiDelayPesawatCalculator)),

  // Batch 13
  'gaji-host-streaming': dynamic(() => import('./gaji-host-streaming-calculator').then(mod => mod.GajiHostStreamingCalculator)),
  'sultan-sniper-pk': dynamic(() => import('./sultan-sniper-pk-calculator').then(mod => mod.SultanSniperPkCalculator)),
  'arbitrase-topup-koin': dynamic(() => import('./arbitrase-topup-koin-calculator').then(mod => mod.ArbitraseTopupKoinCalculator)),
  'kerugian-arisan-gift': dynamic(() => import('./kerugian-arisan-gift-calculator').then(mod => mod.KerugianArisanGiftCalculator)),
  'target-harian-agency': dynamic(() => import('./target-harian-agency-calculator').then(mod => mod.TargetHarianAgencyCalculator)),

  // Batch 14 (OLX / Marketplace Utilities)
  'denda-pajak-kendaraan': dynamic(() => import('./pajak-mati-calculator').then(mod => mod.PajakMatiCalculator)),
  'over-kredit-kendaraan': dynamic(() => import('./over-kredit-calculator').then(mod => mod.OverKreditCalculator)),
  'gear-ratio-motor': dynamic(() => import('./gear-ratio-calculator').then(mod => mod.GearRatioCalculator)),
  'berat-volumetrik-kargo': dynamic(() => import('./volumetrik-kargo-calculator').then(mod => mod.VolumetrikKargoCalculator)),

  // Batch 15 (Bisnis Franchise & Koperasi MBG)
  'roi-franchise-fb': dynamic(() => import('./roi-franchise-fb-calculator').then(mod => mod.RoiFranchiseFbCalculator)),
  'kemitraan-minimarket': dynamic(() => import('./kemitraan-minimarket-calculator').then(mod => mod.KemitraanMinimarketCalculator)),
  'hpp-katering-mbg': dynamic(() => import('./hpp-katering-mbg-calculator').then(mod => mod.HppKateringMbgCalculator)),
  'shu-koperasi': dynamic(() => import('./shu-koperasi-calculator').then(mod => mod.ShuKoperasiCalculator)),
  'valuasi-bisnis': dynamic(() => import('./valuasi-bisnis-calculator').then(mod => mod.ValuasiBisnisCalculator)),
};
