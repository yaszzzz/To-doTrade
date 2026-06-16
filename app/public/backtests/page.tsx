import Link from "next/link";
import { getPublicBacktestStrategies } from "@/lib/actions/public.actions";
import { calculatePublicBacktestStats } from "@/lib/public-stats";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PublicLayout } from "@/components/public/public-layout";

type PublicBacktestsPageProps = {
  searchParams: Promise<{
    search?: string;
  }>;
};

export default async function PublicBacktestsPage({
  searchParams,
}: PublicBacktestsPageProps) {
  const params = await searchParams;
  const search = params.search ?? "";
  const strategies = await getPublicBacktestStrategies({ search });

  return (
    <PublicLayout>
      <main className="mx-auto max-w-[1440px] px-6 py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit font-bold">
              PUBLIC BACKTEST DATA
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Validasi Strategi Trading
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Ringkasan backtest untuk melihat performa setup dan sample trade
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="font-bold">
            <Link href="/public/signals">
              View Signals
            </Link>
          </Button>
        </div>

        {/* Search Form */}
        <Card className="shadow-sm mb-8">
          <CardContent className="pt-6">
            <form className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-semibold">
                  Search strategy / market / timeframe
                </Label>
                <Input
                  id="search"
                  name="search"
                  defaultValue={search}
                  placeholder="SMC, BTC, 1H..."
                  className="h-11"
                />
              </div>
              <Button type="submit" size="lg" className="font-bold">
                Filter
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Strategies Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {strategies.length > 0 ? (
            strategies.map((strategy) => {
              const stats = calculatePublicBacktestStats(strategy.backtestTrades);

              return (
                <Link key={strategy.id} href={`/public/backtests/${strategy.id}`}>
                  <Card className="group h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs font-bold">
                            {strategy.market}
                          </Badge>
                          <span className="h-1 w-1 rounded-full bg-border"></span>
                          <Badge variant="secondary" className="text-xs font-bold">
                            {strategy.timeframe}
                          </Badge>
                        </div>
                        <Badge variant="outline" className="text-xs font-bold">
                          {strategy.rrTarget}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {strategy.strategyName}
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-base leading-relaxed">
                        {strategy.description || "Belum ada deskripsi strategi."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Separator className="mb-6" />
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <Metric label="Trades" value={stats.totalTrades.toString()} />
                        <Metric 
                          label="Win Rate" 
                          value={`${stats.winRate.toFixed(1)}%`} 
                          highlight={stats.winRate >= 50} 
                        />
                        <Metric label="Avg RR" value={`${stats.averageRR.toFixed(2)}R`} />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Updated {formatDate(strategy.updatedAt)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <Card className="border-dashed md:col-span-2 xl:col-span-3">
              <CardContent className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-6xl">📭</div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">Belum ada backtest</h3>
                    <p className="text-muted-foreground">Belum ada backtest yang cocok dengan filter.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </PublicLayout>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? 'text-[#10B981]' : 'text-foreground'}`}>
        {value}
      </p>
    </div>
  );
}