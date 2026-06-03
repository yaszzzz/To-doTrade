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
  running: "bg-blue-100 text-blue-700",
  hit_tp: "bg-green-100 text-green-700",
  hit_sl: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-700",
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
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            ToDoTrade
          </Link>
          <Link href="/public/signals" className="text-sm text-slate-300 hover:text-white">
            ← All Signals
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                Public Signal Detail
              </p>
              <h1 className="mt-3 text-4xl font-bold">{signal.pair}</h1>
              <p className="mt-3 text-slate-400">
                Published {formatDateTime(signal.signalDate)}
              </p>
            </div>
            <span
              className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${
                statusClasses[signal.status]
              }`}
            >
              {statusLabels[signal.status]}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Metric label="Entry" value={signal.entry} />
            <Metric label="Stop Loss" value={signal.stopLoss} tone="red" />
            <Metric label="Take Profit" value={signal.takeProfit} tone="green" />
            <Metric label="Risk Reward" value={`${signal.riskReward}:1`} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <h2 className="text-lg font-semibold">Analysis</h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                {signal.analysis || "Belum ada catatan analisis untuk signal ini."}
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <h2 className="text-lg font-semibold">Outcome</h2>
              <dl className="mt-4 space-y-3 text-sm">
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

          <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm text-yellow-100">
            Disclaimer: informasi ini bukan nasihat finansial. Selalu gunakan risk management dan
            validasi mandiri sebelum mengambil keputusan trading.
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
    tone === "red" ? "text-red-300" : tone === "green" ? "text-green-300" : "text-white";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-400">{label}</dt>
      <dd className="font-medium text-white">{value}</dd>
    </div>
  );
}

function Screenshot({ title, src }: { title: string; src: string }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
        <Image src={src} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
    </section>
  );
}