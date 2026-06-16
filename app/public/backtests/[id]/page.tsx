import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicBacktestStrategyById } from "@/lib/actions/public.actions";
import { calculatePublicBacktestStats } from "@/lib/public-stats";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicLayout } from "@/components/public/public-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PublicBacktestDetailPageProps = {
  params: Promise<{ id: string }>;
};

const resultConfig = {
  win: { className: "bg-green-50 text-green-700 border-green-200", label: "Win" },
  loss: { className: "bg-red-50 text-red-700 border-red-200", label: "Loss" },
  breakeven: { className: "bg-gray-50 text-gray-700 border-gray-200", label: "BE" },
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
    <PublicLayout>
      <main className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8 lg:py-16">
        {/* Back Link */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/public/backtests">
              ← Back to Backtests
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit font-bold">
              PUBLIC STRATEGY BACKTEST
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{strategy.strategyName}</h1>
            <p className="text-muted-foreground">
              {strategy.market} · {strategy.timeframe} · Target {strategy.rrTarget}
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Updated {formatDate(strategy.updatedAt)}
          </Badge>
        </div>

        {/* Description */}
        <p className="max-w-3xl whitespace-pre-wrap leading-relaxed text-muted-foreground mb-8">
          {strategy.description || "Belum ada deskripsi strategi."}
        </p>

        {/* Main Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Metric label="Total Trades" value={stats.totalTrades.toString()} />
          <Metric label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} />
          <Metric label="Average RR" value={`${stats.averageRR.toFixed(2)}R`} />
          <Metric label="Profit Factor" value={stats.profitFactor.toFixed(2)} />
        </div>

        {/* Win/Loss Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Metric label="Wins" value={stats.wins.toString()} tone="green" />
          <Metric label="Losses" value={stats.losses.toString()} tone="red" />
          <Metric label="Breakevens" value={stats.breakevens.toString()} />
        </div>

        {/* Sample Trades Table */}
        <Card className="shadow-sm mb-8">
          <CardContent className="p-0">
            <div className="border-b px-6 py-4 bg-muted/50">
              <h2 className="text-lg font-bold">Sample Trades</h2>
            </div>

            {strategy.backtestTrades.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">#</TableHead>
                      <TableHead className="font-bold">Pair</TableHead>
                      <TableHead className="text-right font-bold">Date</TableHead>
                      <TableHead className="text-right font-bold">Result</TableHead>
                      <TableHead className="text-right font-bold">RR Achieved</TableHead>
                      <TableHead className="text-right font-bold">Screenshot</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategy.backtestTrades.map((trade) => {
                      const config = resultConfig[trade.result];
                      return (
                        <TableRow key={trade.id}>
                          <TableCell className="font-bold">#{trade.tradeNumber}</TableCell>
                          <TableCell className="font-bold">{trade.pair}</TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatDate(trade.entryDate)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className={config.className}>
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-bold">
                            {trade.rrAchieved}R
                          </TableCell>
                          <TableCell className="text-right">
                            {trade.screenshot ? (
                              <a
                                href={trade.screenshot}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:underline font-bold"
                              >
                                View →
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-bold mb-2">Belum ada trade sample</h3>
                <p className="text-muted-foreground">Belum ada trade sample untuk strategi ini.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Screenshots Gallery */}
        {strategy.backtestTrades.some((trade) => trade.screenshot) && (
          <div className="grid gap-6 md:grid-cols-2">
            {strategy.backtestTrades
              .filter((trade) => trade.screenshot)
              .slice(0, 4)
              .map((trade) => (
                <Card key={trade.id} className="shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="mb-4 font-bold">
                      #{trade.tradeNumber} · {trade.pair}
                    </h3>
                    <div className="relative aspect-video overflow-hidden rounded-lg border">
                      <Image
                        src={trade.screenshot as string}
                        alt={`${trade.pair} backtest screenshot`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </main>
    </PublicLayout>
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
    tone === "red" ? "text-[#EF4444]" : tone === "green" ? "text-[#10B981]" : "text-foreground";

  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <p className="text-sm font-semibold text-muted-foreground mb-2">{label}</p>
        <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}