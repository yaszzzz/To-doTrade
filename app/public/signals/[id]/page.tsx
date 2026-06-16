import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicSignalById } from "@/lib/actions/public.actions";
import { formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/public/public-layout";

type PublicSignalDetailPageProps = {
  params: Promise<{ id: string }>;
};

const statusLabels = {
  running: "Running",
  hit_tp: "Hit TP",
  hit_sl: "Hit SL",
  cancelled: "Cancelled",
} as const;

const statusConfig = {
  running: { variant: "default" as const, icon: "⏱️" },
  hit_tp: { variant: "secondary" as const, icon: "✅" },
  hit_sl: { variant: "destructive" as const, icon: "❌" },
  cancelled: { variant: "outline" as const, icon: "🚫" },
};

export default async function PublicSignalDetailPage({
  params,
}: PublicSignalDetailPageProps) {
  const { id } = await params;
  const signal = await getPublicSignalById(id);

  if (!signal) {
    notFound();
  }

  const config = statusConfig[signal.status];

  return (
    <PublicLayout>
      <main className="mx-auto max-w-[1280px] px-6 py-12 lg:px-8 lg:py-16">
        {/* Back Link */}
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link href="/public/signals">
              ← Back to Signals
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-8">
          <div className="space-y-3">
            <Badge variant="outline" className="w-fit font-bold">
              PUBLIC SIGNAL DETAIL
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{signal.pair}</h1>
            <p className="text-muted-foreground">
              Published {formatDateTime(signal.signalDate)}
            </p>
          </div>
          <Badge variant={config.variant} className="gap-1.5 text-base px-4 py-2">
            <span>{config.icon}</span>
            {statusLabels[signal.status]}
          </Badge>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Metric label="Entry" value={signal.entry} />
          <Metric label="Stop Loss" value={signal.stopLoss} tone="red" />
          <Metric label="Take Profit" value={signal.takeProfit} tone="green" />
          <Metric label="Risk Reward" value={`${signal.riskReward}:1`} />
        </div>

        {/* Analysis & Outcome */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Analysis</h2>
              <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {signal.analysis || "Belum ada catatan analisis untuk signal ini."}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Outcome</h2>
              <dl className="space-y-4 text-sm">
                <Row label="Result" value={signal.result || "-"} />
                <Row label="RR Achieved" value={signal.rrAchieved ? `${signal.rrAchieved}R` : "-"} />
                <Row label="Last Update" value={formatDateTime(signal.updatedAt)} />
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Screenshots */}
        {(signal.chartScreenshot || signal.resultScreenshot) && (
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {signal.chartScreenshot && (
              <Screenshot title="Chart Setup" src={signal.chartScreenshot} />
            )}
            {signal.resultScreenshot && (
              <Screenshot title="Result Screenshot" src={signal.resultScreenshot} />
            )}
          </div>
        )}

        {/* Disclaimer */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <span className="text-xl">⚠️</span>
              <div className="space-y-2">
                <p className="font-bold text-yellow-900">Disclaimer</p>
                <p className="text-sm text-yellow-800">
                  Informasi ini bukan nasihat finansial. Selalu gunakan risk management dan validasi mandiri sebelum mengambil keputusan trading.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0">
      <dt className="font-semibold text-muted-foreground">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}

function Screenshot({ title, src }: { title: string; src: string }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <h2 className="mb-4 text-lg font-bold">{title}</h2>
        <div className="relative aspect-video overflow-hidden rounded-lg border">
          <Image src={src} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
        </div>
      </CardContent>
    </Card>
  );
}