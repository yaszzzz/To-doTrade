import Link from "next/link";
import { SignalForm } from "@/components/signals/signal-form";

export default function NewSignalPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/signals"
          className="text-sm text-[#1E4ED8] hover:text-[#1D4ED8] font-semibold transition-colors"
        >
          ← Back to Signals
        </Link>
        <h1 className="mt-6 text-3xl font-bold text-[#1E293B]">
          New Trading Signal
        </h1>
        <p className="mt-2 text-[#64748B] font-medium">
          Document your entry plan, risk setup, and chart analysis before the
          signal plays out.
        </p>
      </div>

      <div className="bg-white rounded-[20px] border border-[#E2E8F0] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <SignalForm />
      </div>
    </div>
  );
}