import {
  createStrategy,
  getStrategies,
} from "@/lib/actions/strategy.actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StrategyVaultPage() {
  const strategies = await getStrategies();

  async function createAction(formData: FormData) {
    "use server";
    const result = await createStrategy(formData);
    if (result.strategyId) {
      redirect(`/strategy-vault/${result.strategyId}`);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Trading Knowledge Base
        </p>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Strategy Vault
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Dokumentasikan rule, entry criteria, exit criteria, dan risk
          management agar eksekusi trading tetap konsisten.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">
          Simpan Strategy Baru
        </h2>
        <form action={createAction} className="space-y-4">
          <input
            name="strategyName"
            required
            placeholder="Nama strategi"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Textarea name="rules" placeholder="Rules utama..." />
            <Textarea name="entryCriteria" placeholder="Entry criteria..." />
            <Textarea name="exitCriteria" placeholder="Exit criteria..." />
            <Textarea name="riskManagement" placeholder="Risk management..." />
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Simpan Strategy
          </button>
        </form>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {strategies.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 md:col-span-2">
            Belum ada strategy.
          </div>
        ) : (
          strategies.map((strategy) => (
            <Link
              key={strategy.id}
              href={`/strategy-vault/${strategy.id}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {strategy.strategyName}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">
                {strategy.rules || strategy.entryCriteria || "Belum ada detail strategy."}
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Updated {strategy.updatedAt.toLocaleDateString("id-ID")}
              </p>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}

function Textarea({ name, placeholder }: { name: string; placeholder: string }) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      rows={5}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
    />
  );
}