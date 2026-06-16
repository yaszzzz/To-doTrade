import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSignalById,
  type SignalResult,
  type SignalStatus,
} from "@/lib/actions/signals.actions";
import { SignalStatusForm } from "@/components/signals/signal-status-form";
import { formatCurrency, formatDate } from "@/lib/utils";

type SignalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<SignalStatus, string> = {
  running: "Running",
  hit_tp: "Hit TP",
  hit_sl: "Hit SL",
  cancelled: "Cancelled",
};

const resultLabels: Record<SignalResult, string> = {
  win: "Win",
  loss: "Loss",
  breakeven: "Breakeven",
};

const statusConfig: Record<SignalStatus, { bg: string; text: string; icon: string }> = {
  running: { bg: "bg-[#DBEAFE]", text: "text-[#1E4ED8]", icon: "⏱️" },
  hit_tp: { bg: "bg-[#D1FAE5]", text: "text-[#10B981]", icon: "✅" },
  hit_sl: { bg: "bg-[#FEE2E2]", text: "text-[#EF4444]", icon: "❌" },
  cancelled: { bg: "bg-[#F3F4F6]", text: "text-[#64748B]", icon: "🚫" },
};

export default async function SignalDetailPage({
  params,
}: SignalDetailPageProps) {
  const { id } = await params;

  let signal;
  try {
    signal = await getSignalById(id);
  } catch {
    notFound();
  }

  const profitLoss = signal.profitLoss ? parseFloat(signal.profitLoss) : null;
  const config = statusConfig[signal.status];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/signals"
          className="text-sm text-[#1E4ED8] hover:text-[#1D4ED8] font-semibold transition-colors"
        >
          ← Back to Signals
        </Link>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-bold text-[#1E293B]">
                {signal.pair}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold ${config.bg} ${config.text}`}>
                <span>{config.icon}</span>
                {statusLabels[signal.status]}
              </span>
            </div>
            <p className="mt-2 text-[#64748B] font-medium">
              Signal created on {formatDate(signal.signalDate)}
            </p>
          </div>

          {signal.result && (
            <div className="bg-white rounded-[20px] border border-[#E2E8F0] px-8 py-4 text-right shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">
                Result
              </p>
              <p
                className={`text-3xl font-bold ${
                  signal.result === "win"
                    ? "text-[#10B981]"
                    : signal.result === "loss"
                      ? "text-[#EF4444]"
                      : "text-[#1E293B]"
                }`}
              >
                {resultLabels[signal.result]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Entry" value={signal.entry} icon="🎯" />
        <MetricCard title="Stop Loss" value={signal.stopLoss} icon="🛑" color="text-[#EF4444]" />
        <MetricCard
          title="Take Profit"
          value={signal.takeProfit}
          icon="🏁"
          color="text-[#10B981]"
        />
        <MetricCard title="Planned RR" value={`${signal.riskReward}:1`} icon="⚖️" />
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          {/* Analysis Section */}
          <section className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <h2 className="text-xl font-bold text-[#1E293B] mb-6 flex items-center gap-2">
              <span>📝</span> Analysis
            </h2>
            <p className="text-[#1E293B] whitespace-pre-wrap leading-relaxed font-medium">
              {signal.analysis || "No analysis provided."}
            </p>
          </section>

          {/* Chart Screenshot */}
          {signal.chartScreenshot && (
            <section className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h2 className="text-xl font-bold text-[#1E293B] mb-6 flex items-center gap-2">
                <span>🖼️</span> Chart Screenshot
              </h2>
              <div className="rounded-2xl overflow-hidden border border-[#E2E8F0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signal.chartScreenshot}
                  alt={`${signal.pair} chart screenshot`}
                  className="w-full object-contain"
                />
              </div>
            </section>
          )}

          {/* Outcome Section */}
          {(signal.profitLoss || signal.rrAchieved || signal.resultScreenshot) && (
            <section className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h2 className="text-xl font-bold text-[#1E293B] mb-6 flex items-center gap-2">
                <span>🏁</span> Outcome
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
                <MetricCard
                  title="Profit / Loss"
                  icon="💰"
                  value={
                    profitLoss === null ? "-" : formatCurrency(profitLoss)
                  }
                  color={
                    profitLoss === null
                      ? "text-[#1E293B]"
                      : profitLoss > 0
                        ? "text-[#10B981]"
                        : profitLoss < 0
                          ? "text-[#EF4444]"
                          : "text-[#1E293B]"
                  }
                />
                <MetricCard
                  title="RR Achieved"
                  icon="⚖️"
                  value={signal.rrAchieved ? `${signal.rrAchieved}:1` : "-"}
                />
              </div>

              {signal.resultScreenshot && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#1E293B]">
                    Result Screenshot
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-[#E2E8F0]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={signal.resultScreenshot}
                      alt={`${signal.pair} result screenshot`}
                      className="w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar - Update Status */}
        <aside className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] h-fit sticky top-8">
          <h2 className="text-xl font-bold text-[#1E293B] mb-2">
            Update Status
          </h2>
          <p className="text-sm text-[#64748B] font-medium mb-8">
            Mark whether the signal is still running, hit target, stopped out,
            or cancelled.
          </p>

          <SignalStatusForm
            signalId={signal.id}
            currentStatus={signal.status}
            currentResult={signal.result}
            currentProfitLoss={signal.profitLoss}
            currentRrAchieved={signal.rrAchieved}
            currentResultScreenshot={signal.resultScreenshot}
          />
        </aside>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color = "text-[#1E293B]",
}: {
  title: string;
  value: string;
  icon?: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)] hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">{title}</span>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}