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

const statusClasses: Record<SignalStatus, string> = {
  running: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  hit_tp: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  hit_sl: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  cancelled: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
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

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/signals"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Signals
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {signal.pair}
              </h1>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  statusClasses[signal.status]
                }`}
              >
                {statusLabels[signal.status]}
              </span>
            </div>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Signal created on {formatDate(signal.signalDate)}
            </p>
          </div>

          {signal.result && (
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-right dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Result
              </p>
              <p
                className={`text-2xl font-bold ${
                  signal.result === "win"
                    ? "text-green-600"
                    : signal.result === "loss"
                      ? "text-red-600"
                      : "text-slate-900 dark:text-white"
                }`}
              >
                {resultLabels[signal.result]}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <MetricCard title="Entry" value={signal.entry} />
        <MetricCard title="Stop Loss" value={signal.stopLoss} color="text-red-600" />
        <MetricCard
          title="Take Profit"
          value={signal.takeProfit}
          color="text-green-600"
        />
        <MetricCard title="Planned RR" value={`${signal.riskReward}:1`} />
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-8 xl:col-span-2">
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Analysis
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-slate-700 dark:text-slate-300">
              {signal.analysis || "No analysis provided."}
            </p>
          </section>

          {signal.chartScreenshot && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Chart Screenshot
              </h2>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signal.chartScreenshot}
                alt={`${signal.pair} chart screenshot`}
                className="mt-4 w-full rounded-lg border border-slate-200 object-contain dark:border-slate-800"
              />
            </section>
          )}

          {(signal.profitLoss || signal.rrAchieved || signal.resultScreenshot) && (
            <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Outcome
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <MetricCard
                  title="Profit / Loss"
                  value={
                    profitLoss === null ? "-" : formatCurrency(profitLoss)
                  }
                  color={
                    profitLoss === null
                      ? "text-slate-900 dark:text-white"
                      : profitLoss > 0
                        ? "text-green-600"
                        : profitLoss < 0
                          ? "text-red-600"
                          : "text-slate-900 dark:text-white"
                  }
                />
                <MetricCard
                  title="RR Achieved"
                  value={signal.rrAchieved ? `${signal.rrAchieved}:1` : "-"}
                />
              </div>

              {signal.resultScreenshot && (
                <>
                  <h3 className="mt-6 font-semibold text-slate-900 dark:text-white">
                    Result Screenshot
                  </h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={signal.resultScreenshot}
                    alt={`${signal.pair} result screenshot`}
                    className="mt-3 w-full rounded-lg border border-slate-200 object-contain dark:border-slate-800"
                  />
                </>
              )}
            </section>
          )}
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Update Status
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Mark whether the signal is still running, hit target, stopped out,
            or cancelled.
          </p>

          <div className="mt-6">
            <SignalStatusForm
              signalId={signal.id}
              currentStatus={signal.status}
              currentResult={signal.result}
              currentProfitLoss={signal.profitLoss}
              currentRrAchieved={signal.rrAchieved}
              currentResultScreenshot={signal.resultScreenshot}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  color = "text-slate-900 dark:text-white",
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}