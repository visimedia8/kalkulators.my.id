"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Brain,
  Eye,
  MessageSquare,
  Activity,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  HeartPulse,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useQueryState, parseAsInteger } from "nuqs";

interface ConsciousnessLevel {
  label: string;
  status: string;
  badgeClass: string;
  description: string;
  traumaClassification: string;
  clinicalAction: string;
}

export function GcsCalculator() {
  // State Input terhubung ke URL Query Parameters via nuqs
  const [eye, setEye] = useQueryState("eye", parseAsInteger.withDefault(4));
  const [verbal, setVerbal] = useQueryState("verbal", parseAsInteger.withDefault(5));
  const [motor, setMotor] = useQueryState("motor", parseAsInteger.withDefault(6));
  const [patientRef, setPatientRef] = React.useState<string>("");

  // Sanitasi & Normalisasi Nilai Input
  const currentEye = Math.min(4, Math.max(1, eye ?? 4));
  const currentVerbal = Math.min(5, Math.max(1, verbal ?? 5));
  const currentMotor = Math.min(6, Math.max(1, motor ?? 6));
  const gcs = currentEye + currentVerbal + currentMotor;

  // Penentuan Tingkat Kesadaran Kualitatif & Klasifikasi Cedera Kepala Sesuai Standar Medis
  const getConsciousnessLevel = (score: number): ConsciousnessLevel => {
    if (score === 15) {
      return {
        label: "Compos Mentis (Sadar Penuh)",
        status: "Normal / Sadar Sempurna",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        description: "Pasien sadar penuh, membuka mata spontan, orientasi ruang/waktu/orang utuh, dan mematuhi seluruh perintah motorik.",
        traumaClassification: "Normal / Tidak Ada Cedera Neurologis Mayor",
        clinicalAction: "Observasi tanda vital berkala standar rawat jalan atau bangsal perawatan.",
      };
    }
    if (score >= 13) {
      return {
        label: "Apatis (Acuh Tak Acuh / Mengantuk Ringan)",
        status: "Cedera Kepala Ringan (Mild)",
        badgeClass: "bg-lime-500/10 text-lime-400 border-lime-500/20",
        description: "Pasien tampak acuh tak acuh, respons terhadap lingkungan sedikit lambat, namun masih mampu berkomunikasi dan mengikuti instruksi.",
        traumaClassification: "Cedera Kepala Ringan (Mild Brain Injury - GCS 13-14)",
        clinicalAction: "Observasi neurologis serial tiap 1-2 jam; pertimbangkan CT-Scan kepala jika terdapat riwayat amnesia atau muntah proyektil.",
      };
    }
    if (score >= 10) {
      return {
        label: "Somnolen (Mengantuk Berat / Letargis)",
        status: "Cedera Kepala Sedang (Moderate)",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        description: "Pasien sangat mudah tertidur, namun dapat dibangunkan dengan stimulasi verbal atau taktil ringan lalu mampu menjawab atau bergerak sebelum tertidur kembali.",
        traumaClassification: "Cedera Kepala Sedang (Moderate Brain Injury - GCS 9-12)",
        clinicalAction: "Wajib rawat inap dengan monitoring ketat di HCU/ICU, evaluasi CT-Scan kepala darurat, dan konsultasi Spesialis Bedah Saraf.",
      };
    }
    if (score >= 7) {
      return {
        label: "Sopor / Stupor (Kantuk Sangat Dalam)",
        status: "Cedera Kepala Berat (Severe)",
        badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
        description: "Hanya dapat dibangunkan sebagian dengan rangsangan nyeri kuat berulang. Tidak ada respons verbal yang koheren, hanya suara mengerang.",
        traumaClassification: "Cedera Kepala Berat (Severe Brain Injury - GCS 3-8)",
        clinicalAction: "EMERGENCY: Pasang proteksi jalan napas definitif (Intubasi Endotrakeal jika GCS <= 8), stabilisasi hemodinamik, dan transfer ke ICU Bedah Saraf.",
      };
    }
    if (score >= 4) {
      return {
        label: "Semi-Koma (Koma Ringan)",
        status: "Cedera Kepala Berat (Kritis)",
        badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
        description: "Pasien tidak memberikan respons verbal. Respons motorik hanya berupa refleks primitif/abnormal seperti fleksi dekortikasi atau ekstensi deserebrasi.",
        traumaClassification: "Cedera Kepala Berat (Severe Brain Injury - GCS 3-8)",
        clinicalAction: "EMERGENCY KRITIS: Intubasi endotrakeal segera, kontrol ketat tekanan intrakranial (TIK), hiperventilasi terkontrol jika ada tanda herniasi unkal.",
      };
    }
    return {
      label: "Koma Dalam (Deep Coma)",
      status: "Koma Total / Arefleksia",
      badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      description: "Tidak ada respons motorik, verbal, maupun pembukaan mata sama sekali terhadap stimulus rangsangan nyeri maksimal.",
      traumaClassification: "Cedera Kepala Sangat Berat (Deep Coma - GCS 3)",
      clinicalAction: "EMERGENCY MAKSIMAL: Resusitasi kardiopulmoner lanjutan (ACLS/ATLS), proteksi ventilasi mekanik invasif, evaluasi refleks batang otak menyeluruh.",
    };
  };

  const currentLevel = getConsciousnessLevel(gcs);

  const handleReset = () => {
    setEye(4);
    setVerbal(5);
    setMotor(6);
    setPatientRef("");
  };

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    const [eVal, vVal, mVal] = val.split("-").map(Number);
    if (!isNaN(eVal) && !isNaN(vVal) && !isNaN(mVal)) {
      setEye(eVal);
      setVerbal(vVal);
      setMotor(mVal);
    }
  };

  const applyPreset = (eVal: number, vVal: number, mVal: number) => {
    setEye(eVal);
    setVerbal(vVal);
    setMotor(mVal);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Form Input Section */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary">
                  Parameter Klinis Glasgow Coma Scale (GCS)
                </h2>
                <p className="text-secondary text-sm">
                  Evaluasi kuantitatif derajat kesadaran dan respons neurotrauma terstandarisasi
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke kondisi normal (E4 V5 M6)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Preset Dropdown */}
            <div className="sm:col-span-2">
              <Select
                label="Protokol Triase / Profil Kasus Klinis"
                onChange={handlePresetSelect}
                defaultValue=""
                helperText="Pilih skenario triase klinis untuk memuat parameter evaluasi neurologis secara otomatis"
              >
                <option value="" disabled>-- Pilih Skenario Status Kesadaran / Triase --</option>
                <option value="4-5-6">Compos Mentis / Sadar Penuh (E4 V5 M6 — Total GCS 15)</option>
                <option value="3-5-6">Apatis / Cedera Kepala Ringan (E3 V5 M6 — Total GCS 14)</option>
                <option value="4-4-5">Delirium / Konfusi Disorientasi (E4 V4 M5 — Total GCS 13)</option>
                <option value="3-4-5">Somnolen / Cedera Kepala Sedang (E3 V4 M5 — Total GCS 12)</option>
                <option value="2-2-4">Sopor / Stupor Nyeri (E2 V2 M4 — Total GCS 8)</option>
                <option value="1-1-3">Semi-Koma Dekortikasi (E1 V1 M3 — Total GCS 5)</option>
                <option value="1-1-2">Semi-Koma Deserebrasi (E1 V1 M2 — Total GCS 4)</option>
                <option value="1-1-1">Koma Dalam / Flaksid (E1 V1 M1 — Total GCS 3)</option>
              </Select>
            </div>

            {/* Parameter 1: Eye */}
            <div className="sm:col-span-2">
              <Select
                label="1. Respons Membuka Mata (Eye Opening - E)"
                value={currentEye.toString()}
                onChange={(e) => setEye(Number(e.target.value))}
                helperText="Skala 1 - 4: Evaluasi pembukaan mata terhadap stimulus eksternal"
              >
                <option value="4">4 - Spontan (Membuka mata secara spontan tanpa stimulus)</option>
                <option value="3">3 - Terhadap Suara (Membuka mata saat dipanggil atau diberi perintah suara)</option>
                <option value="2">2 - Terhadap Rangsang Nyeri (Membuka mata hanya setelah diberi rangsang nyeri)</option>
                <option value="1">1 - Tidak Ada Respons (Tidak membuka mata meski distimulasi nyeri maksimal)</option>
              </Select>
            </div>

            {/* Parameter 2: Verbal */}
            <div className="sm:col-span-2">
              <Select
                label="2. Respons Verbal / Bicara (Verbal Response - V)"
                value={currentVerbal.toString()}
                onChange={(e) => setVerbal(Number(e.target.value))}
                helperText="Skala 1 - 5: Evaluasi orientasi kognitif dan artikulasi bicara"
              >
                <option value="5">5 - Terorientasi Baik (Mengetahui waktu, tempat, dan identitas diri secara akurat)</option>
                <option value="4">4 - Bingung / Disorientasi (Berbicara kalimat utuh namun bingung terhadap konteks/orientasi)</option>
                <option value="3">3 - Kata-Kata Tidak Tepat (Mengucapkan kata-kata acak/mengumpat, tanpa kalimat bermakna)</option>
                <option value="2">2 - Suara Tanpa Arti / Mengerang (Hanya mengerang, merintih, atau bergumam tanpa kata)</option>
                <option value="1">1 - Tidak Ada Respons (Tidak mengeluarkan suara vokal sama sekali)</option>
              </Select>
            </div>

            {/* Parameter 3: Motor */}
            <div className="sm:col-span-2">
              <Select
                label="3. Respons Motorik / Gerakan (Motor Response - M)"
                value={currentMotor.toString()}
                onChange={(e) => setMotor(Number(e.target.value))}
                helperText="Skala 1 - 6: Evaluasi respons gerak volunter atau refleks terhadap stimulus"
              >
                <option value="6">6 - Mengikuti Perintah (Melakukan gerakan motorik sesuai instruksi pemeriksa)</option>
                <option value="5">5 - Melokalisasi Nyeri (Tangan bergerak melintasi garis tengah menyingkirkan stimulus nyeri)</option>
                <option value="4">4 - Menghindari Nyeri / Fleksi Normal (Menarik ekstremitas menjauhi sumber stimulus nyeri)</option>
                <option value="3">3 - Fleksi Abnormal / Dekortikasi (Menekuk siku dan aduksi bahu abnormal ke arah dada)</option>
                <option value="2">2 - Ekstensi Abnormal / Deserebrasi (Meluruskan siku kaku dan pronasi lengan ke arah luar)</option>
                <option value="1">1 - Tidak Ada Respons / Flaksid (Tidak ada gerakan atau tonus otot ekstremitas sama sekali)</option>
              </Select>
            </div>

            {/* Optional Input: Rekam Medis / Catatan Pasien */}
            <div className="sm:col-span-2">
              <Input
                label="Identifikasi / No. Rekam Medis Pasien (Opsional)"
                type="text"
                placeholder="Contoh: RM-20260901-08 (Pasien Triase IGD)"
                value={patientRef}
                onChange={(e) => setPatientRef(e.target.value)}
                helperText="Label referensi dokumentasi klinis untuk pencatatan rekam medis"
              />
            </div>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <span className="text-xs font-medium text-secondary">
              Klasifikasi Triase Neurologis Cepat:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset(4, 5, 6)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Compos Mentis (GCS 15)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(3, 5, 6)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <Activity className="w-3 h-3 text-lime-400" /> Apatis (GCS 14)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(3, 4, 5)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <Activity className="w-3 h-3 text-amber-400" /> Somnolen (GCS 12)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(2, 2, 4)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3 text-orange-400" /> Sopor (GCS 8)
              </button>
              <button
                type="button"
                onClick={() => applyPreset(1, 1, 1)}
                className="px-2.5 py-1 text-xs rounded-md border border-border bg-base hover:bg-elevated text-secondary hover:text-primary transition-colors flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3 text-rose-500" /> Koma (GCS 3)
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {}}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <HeartPulse className="w-4 h-4" />
              Kalkulasi & Evaluasi Status Neurologis
            </Button>
          </div>
        </Card>

        {/* Clinical Note Card */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-primary block mb-0.5">
              Protokol Golden Rule Penanganan Neurotrauma (ATLS):
            </span>
            Pasien dengan skor <strong>GCS &le; 8</strong> dikategorikan mengalami <em>Severe Head Injury</em> dan mengalami kehilangan refleks proteksi jalan napas. Protokol standar industri mewajibkan pemasangan <strong>Intubasi Endotrakeal Definitif</strong> untuk mencegah hipoksia dan aspirasi paru masif.
          </div>
        </div>
      </div>

      {/* Output & Breakdown Section */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <OutputBox
          label="Skor Total Glasgow Coma Scale (GCS)"
          value={gcs}
          suffix=" / 15"
        />

        {/* Breakdown Card */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-sm font-semibold font-display text-primary tracking-wide uppercase">
              Interpretasi Status Neurologis
            </h3>
            <span className={`flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded-md border ${currentLevel.badgeClass}`}>
              <Activity className="w-3 h-3" />
              E{currentEye}V{currentVerbal}M{currentMotor}
            </span>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-secondary">Tingkat Kesadaran:</span>
              <span className="font-semibold text-primary text-right">{currentLevel.label}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-secondary">Klasifikasi Cedera:</span>
              <span className="font-mono text-accent font-medium text-right">{currentLevel.status}</span>
            </div>

            <div className="flex flex-col gap-1 border-t border-border/50 pt-2">
              <span className="text-xs font-medium text-secondary">Rincian Komponen Terukur:</span>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-base border border-border">
                  <span className="text-secondary block text-[11px]">Eye (E)</span>
                  <span className="text-base font-bold text-accent">{currentEye} / 4</span>
                </div>
                <div className="p-2 rounded-lg bg-base border border-border">
                  <span className="text-secondary block text-[11px]">Verbal (V)</span>
                  <span className="text-base font-bold text-accent">{currentVerbal} / 5</span>
                </div>
                <div className="p-2 rounded-lg bg-base border border-border">
                  <span className="text-secondary block text-[11px]">Motor (M)</span>
                  <span className="text-base font-bold text-accent">{currentMotor} / 6</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 border-t border-border/50 pt-2">
              <span className="text-xs font-medium text-secondary">Deskripsi Klinis Pasien:</span>
              <p className="text-xs text-primary leading-relaxed bg-base p-2.5 rounded-lg border border-border">
                {currentLevel.description}
              </p>
            </div>

            <div className="flex flex-col gap-1 border-t border-border/50 pt-2">
              <span className="text-xs font-medium text-secondary">Rekomendasi Tindakan Medis:</span>
              <p className="text-xs text-amber-300/90 leading-relaxed bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/20">
                {currentLevel.clinicalAction}
              </p>
            </div>

            {patientRef && (
              <div className="flex justify-between items-center border-t border-border/50 pt-2 text-xs">
                <span className="text-secondary">Ref. Rekam Medis:</span>
                <span className="font-mono text-primary font-medium">{patientRef}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Security & Clinical Safety Standard */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Sistem evaluasi mengadopsi standar industri kedokteran darurat internasional (Advanced Trauma Life Support). Parameter teknis tersinkronisasi real-time ke URL query via <code>nuqs</code> untuk memfasilitasi audit dan rujukan medis yang akurat dan presisi.
          </p>
        </div>
      </div>
    </div>
  );
}
