import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicSignalById } from "@/lib/actions/public.actions";
import { formatDateTime } from "@/lib/utils";

type PublicSignalDetailPageProps = {
  params: Promise<{ id: string }>;
};

const statusLabels = {
  running: "Running",
  hit_tp: "Hit TP",
  hit_sl: "Hit SL",
  cancelled: "Cancelled",
} as const;

const statusClasses = {
  running: "bg-[#DBEAFE] text-[#1E4ED8] border border-[#1E4ED8]/20",
  hit_tp: "bg-[#D1FAE5] text-[#10B981] border border-[#10B981]/20",
  hit_sl: "bg-[#FEE2E2] text-[#EF4444] border border-[#EF4444]/20",
  cancelled: "bg-[#F3F4F6] text-[#64748B] border border-[#E2E8F0]",
} as const;

export default async function PublicSignalDetailPage({
  params,
}: PublicSignalDetailPageProps) {
  const { id } = await params;
  const signal = await getPublicSignalById(id);

  if (!signal) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <nav className="border-b border-[#E2E8F0] bg-white shadow-sm">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.webp"
              alt="AxellTrade Logo"
              width={40} 
              height={40}
              unoptimized
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-[#1E293B]">AxellTrade</span>
          </Link>
          <Link href="/public/signals" className="text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors">
            ← All Signals
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#1E4ED8] mb-3">
                Public Signal Detail
              </p>
              <h1 className="text-4xl font-bold text-[#1E293B] mb-3">{signal.pair}</h1>
              <p className="text-[#64748B] font-medium">
                Published {formatDateTime(signal.signalDate)}
              </p>
            </div>
            <span
              className={`w-fit rounded-xl px-4 py-2 text-sm font-bold ${
                statusClasses[signal.status]
              }`}
            >
              {statusLabels[signal.status]}
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Entry" value={signal.entry} />
            <Metric label="Stop Loss" value={signal.stopLoss} tone="red" />
            <Metric label="Take Profit" value={signal.takeProfit} tone="green" />
            <Metric label="Risk Reward" value={`${signal.riskReward}:1`} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4">Analysis</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-[#64748B] font-medium">
                {signal.analysis || "Belum ada catatan analisis untuk signal ini."}
              </p>
            </section>

            <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4">Outcome</h2>
              <dl className="space-y-4 text-sm">
                <Row label="Result" value={signal.result || "-"} />
                <Row label="RR Achieved" value={signal.rrAchieved ? `${signal.rrAchieved}R` : "-"} />
                <Row label="Last Update" value={formatDateTime(signal.updatedAt)} />
              </dl>
            </section>
          </div>

          {(signal.chartScreenshot || signal.resultScreenshot) && (
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {signal.chartScreenshot && (
                <Screenshot title="Chart Setup" src={signal.chartScreenshot} />
              )}
              {signal.resultScreenshot && (
                <Screenshot title="Result Screenshot" src={signal.resultScreenshot} />
              )}
            </div>
          )}

          <div className="mt-8 rounded-[20px] border border-[#FEF08A] bg-[#FEFCE8] p-6 text-sm text-[#92400E]">
            <strong className="font-bold block mb-2">⚠️ Disclaimer:</strong>
            <p className="font-medium">Informasi ini bukan nasihat finansial. Selalu gunakan risk management dan validasi mandiri sebelum mengambil keputusan trading.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "red" | "green";
}) {
  const toneClass =
    tone === "red" ? "text-[#EF4444]" : tone === "green" ? "text-[#10B981]" : "text-[#1E293B]";

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-semibold text-[#64748B] mb-2">{label}</p>
      <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] pb-3 last:border-0 last:pb-0">
      <dt className="font-semibold text-[#64748B]">{label}</dt>
      <dd className="font-bold text-[#1E293B]">{value}</dd>
    </div>
  );
}

function Screenshot({ title, src }: { title: string; src: string }) {
  return (
    <section className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <h2 className="mb-4 text-lg font-bold text-[#1E293B]">{title}</h2>
      <div className="relative aspect-video overflow-hidden rounded-[16px] border border-[#E2E8F0] shadow-md">
        <Image src={src} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    </section>
  );
}
