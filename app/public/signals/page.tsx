import Link from "next/link";
import {
  getPublicSignalStats,
  getPublicSignals,
  type PublicSignalStatus,
} from "@/lib/actions/public.actions";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PublicLayout } from "@/components/public/public-layout";

type PublicSignalsPageProps = {
  searchParams: Promise<{
    status?: PublicSignalStatus | "all";
    search?: string;
  }>;
};

const statusLabels: Record<PublicSignalStatus, string> = {
  running: "Running",
  hit_tp: "Hit TP",
  hit_sl: "Hit SL",
  cancelled: "Cancelled",
};

const statusConfig: Record<PublicSignalStatus, { variant: "default" | "secondary" | "outline" | "destructive"; icon: string }> = {
  running: { variant: "default", icon: "⏱️" },
  hit_tp: { variant: "secondary", icon: "✅" },
  hit_sl: { variant: "destructive", icon: "❌" },
  cancelled: { variant: "outline", icon: "🚫" },
};

export default async function PublicSignalsPage({
  searchParams,
}: PublicSignalsPageProps) {
  const params = await searchParams;
  const selectedStatus = params.status ?? "all";
  const search = params.search ?? "";

  const [signals, stats] = await Promise.all([
    getPublicSignals({ status: selectedStatus, search }),
    getPublicSignalStats(),
  ]);

  return (
    <PublicLayout>
      <main className="mx-auto max-w-[1440px] px-6 py-12 lg:px-8 lg:py-16">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit font-bold">
              PUBLIC TRADING SIGNALS
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Explore Trading Signals
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              View public trading signals with analysis and performance data
            </p>
          </div>
          <Button asChild size="lg" className="font-bold">
            <Link href="/register">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard title="Total Signals" value={stats.totalSignals.toString()} icon="📊" />
          <StatCard title="Running" value={stats.runningSignals.toString()} icon="⏱️" />
          <StatCard title="Hit TP" value={stats.hitTpSignals.toString()} icon="✅" />
          <StatCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} icon="🎯" valueColor="text-[#10B981]" />
        </div>

        {/* Search & Filter Form */}
        <Card className="shadow-sm mb-8">
          <CardContent className="pt-6">
            <form className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="search" className="text-sm font-semibold">
                  Search
                </Label>
                <Input
                  id="search"
                  name="search"
                  defaultValue={search}
                  placeholder="BTCUSDT, ETH, analysis..."
                  className="h-11"
                />
              </div>
              <div className="space-y-2 md:w-48">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={selectedStatus}
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="all">All Status</option>
                  <option value="running">Running</option>
                  <option value="hit_tp">Hit TP</option>
                  <option value="hit_sl">Hit SL</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <Button type="submit" size="lg" className="font-bold">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Signals Table */}
        <Card className="shadow-sm">
          {signals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Pair</TableHead>
                    <TableHead className="text-right font-bold">Entry</TableHead>
                    <TableHead className="text-right font-bold">Stop Loss</TableHead>
                    <TableHead className="text-right font-bold">Take Profit</TableHead>
                    <TableHead className="text-right font-bold">RR</TableHead>
                    <TableHead className="text-right font-bold">Status</TableHead>
                    <TableHead className="text-right font-bold">Date</TableHead>
                    <TableHead className="text-right font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signals.map((signal) => {
                    const config = statusConfig[signal.status];
                    return (
                      <TableRow key={signal.id}>
                        <TableCell className="font-bold">{signal.pair}</TableCell>
                        <TableCell className="text-right font-medium">
                          {signal.entry}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#EF4444]">
                          {signal.stopLoss}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#10B981]">
                          {signal.takeProfit}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {signal.riskReward}:1
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={config.variant} className="gap-1.5">
                            <span>{config.icon}</span>
                            {statusLabels[signal.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-muted-foreground">
                          {formatDate(signal.signalDate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="link" className="font-bold p-0">
                            <Link href={`/public/signals/${signal.id}`}>
                              View →
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <CardContent className="text-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="text-6xl">📭</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">No signals found</h3>
                  <p className="text-muted-foreground">Try adjusting your search filters.</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </main>
    </PublicLayout>
  );
}

function StatCard({ 
  title, 
  value, 
  icon,
  valueColor = "text-foreground"
}: { 
  title: string
  value: string
  icon: string
  valueColor?: string
}) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl">{icon}</span>
        </div>
        <CardDescription className="text-sm font-medium mb-1">{title}</CardDescription>
        <CardTitle className={`text-3xl font-extrabold ${valueColor}`}>{value}</CardTitle>
      </CardContent>
    </Card>
  );
}