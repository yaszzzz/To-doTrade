import Link from "next/link";
import Image from "next/image";
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
    <main className="min-h-screen bg-[#F8FAFC]">
      <PublicNav />

      <section className="mx-auto max-w-[1440px] px-6 py-16 lg:px-8 lg:py-20">
        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit border-blue-200 bg-blue-50 text-blue-700 font-bold">
              PUBLIC TRADING SIGNALS
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#1E293B] sm:text-5xl">
              Explore Open Trading Signals
            </h1>
            <p className="max-w-2xl text-lg text-[#64748B]">
              View public trading signals with analysis and performance data. Join our community to track your own signals.
            </p>
          </div>
          <Button asChild size="lg" className="bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-bold shadow-lg hover:shadow-xl">
            <Link href="/register">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <StatCard title="Total Signals" value={stats.totalSignals.toString()} icon="📊" />
          <StatCard title="Running" value={stats.runningSignals.toString()} icon="⏱️" />
          <StatCard title="Hit TP" value={stats.hitTpSignals.toString()} icon="✅" />
          <StatCard title="Win Rate" value={`${stats.winRate.toFixed(1)}%`} icon="🎯" valueColor="text-[#10B981]" />
        </div>

        {/* Search & Filter Form */}
        <Card className="border-[#E2E8F0] shadow-lg mb-8">
          <CardContent className="pt-6">
            <form className="flex flex-col gap-4 md:flex-row md:items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="search" className="text-sm font-semibold text-[#1E293B]">
                  Search
                </Label>
                <Input
                  id="search"
                  name="search"
                  defaultValue={search}
                  placeholder="BTCUSDT, ETH, analysis..."
                  className="h-11 border-[#E2E8F0] focus-visible:ring-[#1E4ED8]"
                />
              </div>
              <div className="space-y-2 md:w-48">
                <Label htmlFor="status" className="text-sm font-semibold text-[#1E293B]">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={selectedStatus}
                  className="flex h-11 w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4ED8] focus-visible:ring-offset-2"
                >
                  <option value="all">All Status</option>
                  <option value="running">Running</option>
                  <option value="hit_tp">Hit TP</option>
                  <option value="hit_sl">Hit SL</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <Button type="submit" size="lg" className="bg-[#1E293B] hover:bg-[#0F172A] font-bold">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Signals Table */}
        <Card className="border-[#E2E8F0] shadow-lg">
          {signals.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC]">
                    <TableHead className="font-bold text-[#64748B]">Pair</TableHead>
                    <TableHead className="text-right font-bold text-[#64748B]">Entry</TableHead>
                    <TableHead className="text-right font-bold text-[#64748B]">Stop Loss</TableHead>
                    <TableHead className="text-right font-bold text-[#64748B]">Take Profit</TableHead>
                    <TableHead className="text-right font-bold text-[#64748B]">RR</TableHead>
                    <TableHead className="text-right font-bold text-[#64748B]">Status</TableHead>
                    <TableHead className="text-right font-bold text-[#64748B]">Date</TableHead>
                    <TableHead className="text-right font-bold text-[#64748B]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signals.map((signal) => {
                    const config = statusConfig[signal.status];
                    return (
                      <TableRow key={signal.id} className="hover:bg-[#F8FAFC]">
                        <TableCell className="font-bold text-[#1E293B]">{signal.pair}</TableCell>
                        <TableCell className="text-right text-[#64748B] font-medium">
                          {signal.entry}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#EF4444]">
                          {signal.stopLoss}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#10B981]">
                          {signal.takeProfit}
                        </TableCell>
                        <TableCell className="text-right text-[#1E293B] font-bold">
                          {signal.riskReward}:1
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={config.variant} className="gap-1.5">
                            <span>{config.icon}</span>
                            {statusLabels[signal.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-[#64748B] font-medium">
                          {formatDate(signal.signalDate)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="link" className="text-[#1E4ED8] hover:text-[#1D4ED8] font-bold p-0">
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
                  <h3 className="text-lg font-bold text-[#1E293B]">No signals found</h3>
                  <p className="text-[#64748B]">Try adjusting your search filters.</p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </section>
    </main>
  );
}

function PublicNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <Image
            src="/logo.webp"
            alt="AxellTrade Logo"
            width={40} 
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-[#1E293B]">AxellTrade</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/public/signals" className="text-sm font-bold text-[#1E4ED8]">
            Signals
          </Link>
          <Link href="/public/backtests" className="text-sm font-medium text-[#64748B] hover:text-[#1E293B] transition-colors">
            Backtests
          </Link>
          <Button asChild size="default" className="bg-[#1E4ED8] hover:bg-[#1D4ED8] text-white font-semibold shadow-md">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}

function StatCard({ 
  title, 
  value, 
  icon,
  valueColor = "text-[#1E293B]"
}: { 
  title: string
  value: string
  icon: string
  valueColor?: string
}) {
  return (
    <Card className="border-[#E2E8F0] shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
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