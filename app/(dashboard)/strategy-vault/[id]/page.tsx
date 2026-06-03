import {
  getStrategyById,
  updateStrategy,
} from "@/lib/actions/strategy.actions";
import Link from "next/link";

export default async function StrategyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const strategy = await getStrategyById(id);

  async function updateAction(formData: FormData) {
    "use server";
    await updateStrategy(id, formData);
  }

  return (
    <div className="space-y-8">
      <Link href="/strategy-vault" className="text-sm font-medium text-blue-600">
        ← Strategy Vault
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {strategy.strategyName}
        </h1>
        <p className="mt-2 text-slate-500">
          Terakhir diupdate {strategy.updatedAt.toLocaleDateString("id-ID")}
        </p>
      </div>

      <form
        action={updateAction}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="space-y-5">
          <Field label="Strategy Name">
            <input
              name="strategyName"
              required
              defaultValue={strategy.strategyName}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
            />
          </Field>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Rules">
              <textarea
                name="rules"
                rows={8}
                defaultValue={strategy.rules || ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              />
            </Field>
            <Field label="Entry Criteria">
              <textarea
                name="entryCriteria"
                rows={8}
                defaultValue={strategy.entryCriteria || ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              />
            </Field>
            <Field label="Exit Criteria">
              <textarea
                name="exitCriteria"
                rows={8}
                defaultValue={strategy.exitCriteria || ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              />
            </Field>
            <Field label="Risk Management">
              <textarea
                name="riskManagement"
                rows={8}
                defaultValue={strategy.riskManagement || ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              />
            </Field>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
            Update Strategy
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
    </label>
  );
}