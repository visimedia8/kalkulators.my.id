"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OutputBox } from "@/components/ui/output-box";
import { Select } from "@/components/ui/select";
import {
  Baby,
  HeartPulse,
  Activity,
  RotateCcw,
  Info,
  ShieldCheck,
  Stethoscope,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
} from "lucide-react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { cn } from "@/lib/utils";

export function ApgarCalculator() {
  // State Input URL Synced via nuqs (0, 1, or 2 for each parameter)
  const [appearance, setAppearance] = useQueryState(
    "appearance",
    parseAsInteger.withDefault(2)
  );
  const [pulse, setPulse] = useQueryState(
    "pulse",
    parseAsInteger.withDefault(2)
  );
  const [grimace, setGrimace] = useQueryState(
    "grimace",
    parseAsInteger.withDefault(2)
  );
  const [activity, setActivity] = useQueryState(
    "activity",
    parseAsInteger.withDefault(2)
  );
  const [respiration, setRespiration] = useQueryState(
    "respiration",
    parseAsInteger.withDefault(2)
  );
  const [minute, setMinute] = useQueryState(
    "minute",
    parseAsString.withDefault("1")
  );

  // State Output & Diagnostics
  const [totalScore, setTotalScore] = React.useState<number>(10);
  const [conditionCategory, setConditionCategory] = React.useState<string>("Normal");
  const [conditionTitle, setConditionTitle] = React.useState<string>("Bayi Normal / Bugar (Tanpa Asfiksia)");
  const [conditionDesc, setConditionDesc] = React.useState<string>("");
  const [clinicalAction, setClinicalAction] = React.useState<string>("");
  const [severityStatus, setSeverityStatus] = React.useState<"normal" | "moderate" | "severe">("normal");

  const calculateApgar = React.useCallback(() => {
    const a = appearance ?? 2;
    const p = pulse ?? 2;
    const g = grimace ?? 2;
    const act = activity ?? 2;
    const r = respiration ?? 2;

    const sum = a + p + g + act + r;
    setTotalScore(sum);

    if (sum >= 7) {
      setSeverityStatus("normal");
      setConditionCategory("Normal");
      setConditionTitle("Bayi Normal / Bugar (Tanpa Asfiksia)");
      setConditionDesc(
        "Kondisi adaptasi fisik dan transisi ekstrauterin berjalan sangat baik. Tidak ada tanda distres pernapasan maupun depresi sirkulasi."
      );
      setClinicalAction(
        "Lakukan asuhan neonatal esensial standar industri: keringkan tubuh bayi, pertahankan kehangatan (skin-to-skin contact), bersihkan jalan napas bila ada lendir, lakukan Inisiasi Menyusu Dini (IMD) minimal 60 menit, serta berikan profilaksis rutin (vitamin K1, salep mata antibiotik, dan imunisasi Hepatitis B0)."
      );
    } else if (sum >= 4) {
      setSeverityStatus("moderate");
      setConditionCategory("Asfiksia Sedang");
      setConditionTitle("Asfiksia Ringan - Sedang (Depresi Fisiologis)");
      setConditionDesc(
        "Bayi mengalami depresi pernapasan atau sirkulasi derajat moderat. Menunjukkan perlunya tindakan stabilisasi transisi dan evaluasi jalan napas segera."
      );
      setClinicalAction(
        "Lakukan tindakan resusitasi neonatal tahap awal: reposisi kepala semi-ekstensi, bersihkan lendir dari mulut dan hidung dengan suction, keringkan sambil lakukan stimulasi taktil lembut di punggung atau telapak kaki. Berikan suplementasi oksigen aliran bebas atau pertimbangkan Ventilasi Tekanan Positif (VTP) jika frekuensi jantung < 100 bpm atau apnea berlanjut. Evaluasi ulang skor APGAR pada menit ke-5."
      );
    } else {
      setSeverityStatus("severe");
      setConditionCategory("Asfiksia Berat");
      setConditionTitle("Asfiksia Berat (Gawat Darurat Neonatus)");
      setConditionDesc(
        "Kondisi kritis mengancam kelangsungan hidup neonatus. Terjadi depresi kardiopulmoner berat yang membutuhkan tindakan resusitasi agresif dan terkoordinasi seketika."
      );
      setClinicalAction(
        "PROTOKOL RESUSITASI NEONATAL SEGERA: Buka jalan napas, pasang sungkup wajah, dan segera mulai Ventilasi Tekanan Positif (VTP) dengan balon resusitasi. Jika denyut jantung tetap < 60 bpm setelah 30 detik VTP efektif, lakukan kompresi dada terkoordinasi (rasio 3:1 dengan ventilasi). Siapkan intubasi endotrakeal, akses vena umbilikalis, dan pemberian epinefrin. Segera koordinasikan dengan tim NICU."
      );
    }
  }, [appearance, pulse, grimace, activity, respiration]);

  React.useEffect(() => {
    calculateApgar();
  }, [calculateApgar]);

  const handleReset = () => {
    setAppearance(2);
    setPulse(2);
    setGrimace(2);
    setActivity(2);
    setRespiration(2);
    setMinute("1");
  };

  const getSeverityBadgeStyles = () => {
    switch (severityStatus) {
      case "normal":
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          glow: "border-emerald-500/40 bg-emerald-950/20",
        };
      case "moderate":
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          glow: "border-amber-500/40 bg-amber-950/20",
        };
      case "severe":
        return {
          icon: <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />,
          badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          glow: "border-rose-500/40 bg-rose-950/20",
        };
    }
  };

  const badgeStyles = getSeverityBadgeStyles();

  const getParamLabel = (type: string, val: number | null) => {
    const v = val ?? 2;
    switch (type) {
      case "appearance":
        return v === 2
          ? "Seluruh tubuh kemerahan normal (2)"
          : v === 1
          ? "Tubuh merah, ekstremitas biru / Akrosianosis (1)"
          : "Biru pucat seluruh tubuh (0)";
      case "pulse":
        return v === 2
          ? "≥ 100 bpm / Kuat & normal (2)"
          : v === 1
          ? "< 100 bpm / Lambat (1)"
          : "Tidak ada denyut jantung (0)";
      case "grimace":
        return v === 2
          ? "Menangis kuat, bersin, batuk (2)"
          : v === 1
          ? "Meringis / respons minimal (1)"
          : "Tidak ada respons stimulasi (0)";
      case "activity":
        return v === 2
          ? "Gerakan aktif, fleksi kuat (2)"
          : v === 1
          ? "Fleksi ekstremitas lemah (1)"
          : "Lunglai / Flaksid (0)";
      case "respiration":
        return v === 2
          ? "Menangis kuat, bernapas teratur (2)"
          : v === 1
          ? "Lambat, ireguler, merintih (1)"
          : "Tidak bernapas / Apnea (0)";
      default:
        return "-";
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Input Form Parameter APGAR */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex flex-col gap-6">
          {/* Header Card */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold font-display text-primary flex items-center gap-2">
                  Parameter Klinis APGAR Score
                </h2>
                <p className="text-secondary text-sm mt-0.5">
                  Evaluasi adaptasi fisik dan transisi fisiologis bayi baru lahir
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-base hover:bg-elevated"
              title="Reset ke parameter default normal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Form Selection Grid */}
          <div className="flex flex-col gap-5">
            {/* Waktu Observasi Pascapersalinan */}
            <Select
              label="Waktu Observasi Pascapersalinan"
              value={minute || "1"}
              onChange={(e) => setMinute(e.target.value)}
              helperText="Menit ke-1 menilai toleransi kelahiran; Menit ke-5 menilai adaptasi lingkungan ekstrauterin."
            >
              <option value="1">Menit ke-1 (Evaluasi Awal Transisi Pascapersalinan)</option>
              <option value="5">Menit ke-5 (Evaluasi Keberhasilan Adaptasi & Asuhan)</option>
              <option value="10">Menit ke-10 (Evaluasi Tambahan Resusitasi Berkelanjutan)</option>
            </Select>

            {/* 1. Appearance (Warna Kulit) */}
            <Select
              label="1. Appearance (Warna Kulit / Skin Color)"
              value={String(appearance ?? 2)}
              onChange={(e) => setAppearance(Number(e.target.value))}
              helperText="Inspeksi perfusi kapiler pada tubuh, wajah, serta telapak tangan dan kaki neonatus."
            >
              <option value="2">2 - Seluruh tubuh kemerahan normal (Pink all over)</option>
              <option value="1">1 - Tubuh kemerahan, tangan & kaki kebiruan (Akrosianosis)</option>
              <option value="0">0 - Seluruh tubuh biru pucat atau sianosis sentral</option>
            </Select>

            {/* 2. Pulse (Denyut Jantung) */}
            <Select
              label="2. Pulse (Frekuensi Denyut Jantung / Heart Rate)"
              value={String(pulse ?? 2)}
              onChange={(e) => setPulse(Number(e.target.value))}
              helperText="Auskultasi apeks jantung neonatus dengan stetoskop selama 6 detik dikalikan 10."
            >
              <option value="2">2 - Denyut jantung ≥ 100 denyut per menit (bpm) - Normal</option>
              <option value="1">1 - Denyut jantung &lt; 100 denyut per menit (bpm) - Bradikardia</option>
              <option value="0">0 - Tidak ada denyut jantung (Asistol)</option>
            </Select>

            {/* 3. Grimace (Iritabilitas Refleks) */}
            <Select
              label="3. Grimace (Iritabilitas Refleks / Reflex Irritability)"
              value={String(grimace ?? 2)}
              onChange={(e) => setGrimace(Number(e.target.value))}
              helperText="Respons refleks neonatus terhadap rangsangan taktil atau hisap lendir faring."
            >
              <option value="2">2 - Menangis kuat, batuk, bersin, atau menarik tungkai saat dirangsang</option>
              <option value="1">1 - Meringis atau sedikit gerakan saat distimulasi</option>
              <option value="0">0 - Tidak ada respons sama sekali terhadap rangsangan</option>
            </Select>

            {/* 4. Activity (Tonus Otot) */}
            <Select
              label="4. Activity (Tonus Otot / Muscle Tone)"
              value={String(activity ?? 2)}
              onChange={(e) => setActivity(Number(e.target.value))}
              helperText="Penilaian fleksi alami ekstremitas dan kekuatan perlawanan terhadap ekstensi."
            >
              <option value="2">2 - Gerakan aktif, fleksi kuat pada semua ekstremitas</option>
              <option value="1">1 - Beberapa fleksi ringan pada lengan dan tungkai (Tonus lemah)</option>
              <option value="0">0 - Lemah lunglai / Flaksid (Tidak ada tonus otot)</option>
            </Select>

            {/* 5. Respiration (Usaha Bernapas) */}
            <Select
              label="5. Respiration (Usaha Pernapasan / Respiratory Effort)"
              value={String(respiration ?? 2)}
              onChange={(e) => setRespiration(Number(e.target.value))}
              helperText="Inspeksi ekspansi dinding dada dan intensitas tangisan spontan neonatus."
            >
              <option value="2">2 - Menangis kuat, usaha pernapasan teratur & adekuat</option>
              <option value="1">1 - Usaha napas lambat, tidak teratur, dangkal, atau merintih (Gasping)</option>
              <option value="0">0 - Tidak ada pernapasan sama sekali (Apnea)</option>
            </Select>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button
              onClick={calculateApgar}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:brightness-110 px-6 py-3 rounded-lg font-semibold transition-all shadow-[0_0_15px_var(--accent-glow)]"
            >
              <HeartPulse className="w-4 h-4" />
              Hitung Skor APGAR & Evaluasi Klinis
            </Button>
          </div>
        </Card>

        {/* Clinical Guideline Note */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <div className="text-xs text-secondary leading-relaxed">
            <span className="font-semibold text-primary block mb-0.5">
              Standar Prosedur Operasional Penilaian APGAR:
            </span>
            Penilaian APGAR dilakukan secara cepat dan sistematis pada <strong>1 menit</strong> dan{" "}
            <strong>5 menit</strong> setelah bayi lahir lengkap. Skor pada menit ke-1 menentukan kebutuhan
            resusitasi darurat, sedangkan skor pada menit ke-5 mengukur efektivitas intervensi dan prognosis
            transisi neonatus. Jika skor pada menit ke-5 masih berada di bawah 7, lanjutkan evaluasi berkala setiap
            5 menit hingga menit ke-20.
          </div>
        </div>
      </div>

      {/* Kolom Kanan: Output & Rincian Interpretasi */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Output Box Total Skor */}
        <OutputBox
          label={`Total Skor APGAR (Observasi Menit ke-${minute || "1"})`}
          value={totalScore}
          suffix=" / 10"
        />

        {/* Status Interpretasi Kondisi Bayi */}
        <div className={cn("p-5 rounded-2xl border flex flex-col gap-3 transition-all", badgeStyles.glow)}>
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-base/60">
                {badgeStyles.icon}
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-secondary">
                  Klasifikasi Klinis
                </span>
                <h3 className="text-lg font-bold font-display text-primary">
                  {conditionCategory}
                </h3>
              </div>
            </div>
            <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", badgeStyles.badge)}>
              Skor {totalScore}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <h4 className="text-sm font-semibold text-primary">{conditionTitle}</h4>
            <p className="text-xs leading-relaxed text-secondary">{conditionDesc}</p>
          </div>

          {/* Rekomendasi Tindakan Klinis */}
          <div className="mt-2 pt-3 border-t border-border/60 flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              Protokol Tindakan Medis / Bidan:
            </span>
            <p className="text-xs leading-relaxed text-primary/90 bg-base/60 p-3 rounded-lg border border-border/50">
              {clinicalAction}
            </p>
          </div>
        </div>

        {/* Breakdown 5 Parameter Teknis */}
        <Card className="flex flex-col gap-4 p-5 bg-elevated/70 border-border">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold font-display text-primary flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              Rincian 5 Parameter Fisiologis
            </h3>
            <span className="text-xs font-mono text-secondary">
              Total: {totalScore}/10
            </span>
          </div>

          <div className="flex flex-col gap-2.5 text-xs">
            {/* Appearance */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary font-medium">Appearance (Warna Kulit):</span>
              <span className="font-semibold text-primary text-right max-w-[55%]">
                {getParamLabel("appearance", appearance)}
              </span>
            </div>

            {/* Pulse */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary font-medium">Pulse (Denyut Jantung):</span>
              <span className="font-semibold text-primary text-right max-w-[55%]">
                {getParamLabel("pulse", pulse)}
              </span>
            </div>

            {/* Grimace */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary font-medium">Grimace (Iritabilitas Refleks):</span>
              <span className="font-semibold text-primary text-right max-w-[55%]">
                {getParamLabel("grimace", grimace)}
              </span>
            </div>

            {/* Activity */}
            <div className="flex justify-between items-center py-1 border-b border-border/40">
              <span className="text-secondary font-medium">Activity (Tonus Otot):</span>
              <span className="font-semibold text-primary text-right max-w-[55%]">
                {getParamLabel("activity", activity)}
              </span>
            </div>

            {/* Respiration */}
            <div className="flex justify-between items-center py-1">
              <span className="text-secondary font-medium">Respiration (Pernapasan):</span>
              <span className="font-semibold text-primary text-right max-w-[55%]">
                {getParamLabel("respiration", respiration)}
              </span>
            </div>
          </div>
        </Card>

        {/* Security & Standard Integrity */}
        <div className="p-4 rounded-xl border border-border bg-base flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-secondary leading-relaxed">
            Kalkulasi skor APGAR tersinkronisasi secara <strong>real-time</strong> ke dalam URL.
            Formula mengacu pada standar industri obstetri dan neonatologi internasional
            (American Academy of Pediatrics / IDAI) untuk pencatatan rekam medis terstandar.
          </p>
        </div>
      </div>
    </div>
  );
}
