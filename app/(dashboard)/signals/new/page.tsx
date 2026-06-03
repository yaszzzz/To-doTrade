import Link from "next/link";
import { SignalForm } from "@/components/signals/signal-form";

export default function NewSignalPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/signals"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Signals
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 dark:text-white">
          New Trading Signal
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Document your entry plan, risk setup, and chart analysis before the
          signal plays out.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <SignalForm />
      </div>
    </div>
  );
}