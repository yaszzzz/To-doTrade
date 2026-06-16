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
  win: "bg-[#D1FAE5] text-[#10B981]",
  loss: "bg-[#FEE2E2] text-[#EF4444]",
  breakeven: "bg-[#F3F4F6] text-[#64748B]",
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
    <main className="min-h-screen bg-[#F8FAFC]">
      <nav className="border-b border-[#E2E8F0] bg-white shadow-sm">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.webp"
              alt="AxellTrade Logo"
              width={40} 
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-[#1E293B]">AxellTrade</span>
          </Link>
          <Link href="/public/backtests" className="text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors">
            ← All Backtests
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8">
        <div className="rounded-[20px] border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[#1E4ED8] mb-3">
                Public Strategy Backtest
              </p>
              <h1 className="text-4xl font-bold text-[#1E293B] mb-3">{strategy.strategyName}</h1>
              <p className="text-[#64748B] font-medium">
                {strategy.market} · {strategy.timeframe} · Target {strategy.rrTarget}
              </p>
            </div>
            <p className="rounded-full bg-[#F8FAFC] px-4 py-2 text-sm font-medium text-[#64748B] border border-[#E2E8F0]">
              Updated {formatDate(strategy.updatedAt)}
            </p>
          </div>

          <p className="max-w-3xl whitespace-pre-wrap leading-7 text-[#64748B] font-medium">
            {strategy.description || "Belum ada deskripsi strategi."}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            <Metric label="Total Trades" value={stats.totalTrades.toString()} />
            <Metric label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
            <Metric label="Average RR" value={`${stats.averageRR.toFixed(2)}R`} />
            <Metric label="Profit Factor" value={stats.profitFactor.toFixed(2)} />
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Metric label="Wins" value={stats.wins.toString()} tone="green" />
            <Metric label="Losses" value={stats.losses.toString()} tone="red" />
            <Metric label="Breakevens" value={stats.breakevens.toString()} />
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#E2E8F0] px-6 py-5 bg-[#F8FAFC]">
            <h2 className="text-lg font-bold text-[#1E293B]">Sample Trades</h2>
          </div>

          {strategy.backtestTrades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                    <TableHead align="left">#</TableHead>
                    <TableHead align="left">Pair</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>RR Achieved</TableHead>
                    <TableHead>Screenshot</TableHead>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {strategy.backtestTrades.map((trade) => (
                    <tr key={trade.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 font-bold text-[#1E293B]">#{trade.tradeNumber}</td>
                      <td className="px-6 py-4 font-bold text-[#1E293B]">{trade.pair}</td>
                      <td className="px-6 py-4 text-right text-[#64748B] font-medium">
                        {formatDate(trade.entryDate)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold ${
                            resultClasses[trade.result]
                          }`}
                        >
                          {trade.result}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-[#1E293B] font-bold">
                        {trade.rrAchieved}R
                      </td>
                      <td className="px-6 py-4 text-right">
                        {trade.screenshot ? (
                          <a
                            href={trade.screenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1E4ED8] hover:text-[#1D4ED8] font-bold transition-colors"
                          >
                            Open →
                          </a>
                        ) : (
                          <span className="text-[#CBD5E1] font-medium">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-5xl mb-4">📭</p>
              <h3 className="text-lg font-bold text-[#1E293B]">Belum ada trade sample</h3>
              <p className="text-[#64748B] mt-2 font-medium">Belum ada trade sample untuk strategi ini.</p>
            </div>
          )}
        </div>

        {strategy.backtestTrades.some((trade) => trade.screenshot) && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {strategy.backtestTrades
              .filter((trade) => trade.screenshot)
              .slice(0, 4)
              .map((trade) => (
                <div
                  key={trade.id}
                  className="rounded-[20px] border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                >
                  <h3 className="mb-4 font-bold text-[#1E293B]">
                    #{trade.tradeNumber} · {trade.pair}
                  </h3>
                  <div className="relative aspect-video overflow-hidden rounded-[16px] border border-[#E2E8F0]">
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
    tone === "red" ? "text-[#EF4444]" : tone === "green" ? "text-[#10B981]" : "text-[#1E293B]";

  return (
    <div className="rounded-[16px] border border-[#E2E8F0] bg-[#F8FAFC] p-6 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
      <p className="text-sm font-semibold text-[#64748B] mb-2">{label}</p>
      <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
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
      className={`px-6 py-4 text-xs font-bold text-[#64748B] uppercase tracking-wider ${
        align === "left" ? "text-left" : "text-right"
      }`}
    >
      {children}
    </th>
  );
}