import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBacktestStrategyById } from "@/lib/actions/public.actions";
import { calculatePublicBacktestStats } from "@/lib/public-stats";
import { formatDate } from "@/lib/utils";

type PublicBacktestDetailPageProps = {
  params: Promise<{ id: string }>;
};

const resultClasses = {
  win: "bg-green-100 text-green-700",
  loss: "bg-red-100 text-red-700",
  breakeven: "bg-slate-100 text-slate-700",
} as const;

export default async function PublicBacktestDetailPage({
  params,
}: PublicBacktestDetailPageProps) {
  const { id } = await params;
  const strategy = await getPublicBacktestStrategyById(id);

  if (!strategy) {
    notFound();
  }

  const stats = calculatePublicBacktestStats(strategy.backtestTrades);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link href="/" className="text-xl font-bold">
            ToDoTrade
          </Link>
          <Link href="/public/backtests" className="text-sm text-slate-300 hover:text-white">
            ← All Backtests
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
                Public Strategy Backtest
              </p>
              <h1 className="mt-3 text-4xl font-bold">{strategy.strategyName}</h1>
              <p className="mt-3 text-slate-400">
                {strategy.market} · {strategy.timeframe} · Target {strategy.rrTarget}
              </p>
            </div>
            <p className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300">
              Updated {formatDate(strategy.updatedAt)}
            </p>
          </div>

          <p className="mt-6 max-w-3xl whitespace-pre-wrap leading-7 text-slate-300">
            {strategy.description || "Belum ada deskripsi strategi."}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <Metric label="Total Trades" value={stats.totalTrades.toString()} />
            <Metric label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
            <Metric label="Average RR" value={`${stats.averageRR.toFixed(2)}R`} />
            <Metric label="Profit Factor" value={stats.profitFactor.toFixed(2)} />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Metric label="Wins" value={stats.wins.toString()} tone="green" />
            <Metric label="Losses" value={stats.losses.toString()} tone="red" />
            <Metric label="Breakevens" value={stats.breakevens.toString()} />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="text-lg font-semibold">Sample Trades</h2>
          </div>

          {strategy.backtestTrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-slate-400">
                    <TableHead align="left">#</TableHead>
                    <TableHead align="left">Pair</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>RR Achieved</TableHead>
                    <TableHead>Screenshot</TableHead>
                  </tr>
                </thead>
                <tbody>
                  {strategy.backtestTrades.map((trade) => (
                    <tr key={trade.id} className="border-b border-white/5">
                      <td className="px-4 py-4 font-medium">#{trade.tradeNumber}</td>
                      <td className="px-4 py-4 font-semibold">{trade.pair}</td>
                      <td className="px-4 py-4 text-right text-slate-400">
                        {formatDate(trade.entryDate)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            resultClasses[trade.result]
                          }`}
                        >
                          {trade.result}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-slate-300">
                        {trade.rrAchieved}R
                      </td>
                      <td className="px-4 py-4 text-right">
                        {trade.screenshot ? (
                          <a
                            href={trade.screenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-300 hover:text-blue-200"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400">
              Belum ada trade sample untuk strategi ini.
            </div>
          )}
        </div>

        {strategy.backtestTrades.some((trade) => trade.screenshot) && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {strategy.backtestTrades
              .filter((trade) => trade.screenshot)
              .slice(0, 4)
              .map((trade) => (
                <div
                  key={trade.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <h3 className="mb-3 font-semibold">
                    #{trade.tradeNumber} · {trade.pair}
                  </h3>
                  <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
                    <Image
                      src={trade.screenshot as string}
                      alt={`${trade.pair} backtest screenshot`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
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
    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

function TableHead({
  children,
  align = "right",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-3 font-medium ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      {children}
    </th>
  );
}