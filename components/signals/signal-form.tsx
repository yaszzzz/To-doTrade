"use client";

import { createSignal } from "@/lib/actions/signals.actions";
import { uploadImage } from "@/lib/actions/upload.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignalForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File | null) {
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);
    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setScreenshotUrl(result.url);
    }

    setUploading(false);
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");

    formData.set("chartScreenshot", screenshotUrl);

    const result = await createSignal(formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    if (result.signalId) {
      router.push(`/signals/${result.signalId}`);
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Field label="Pair" htmlFor="pair">
          <input
            id="pair"
            name="pair"
            type="text"
            required
            placeholder="BTCUSDT / BBCA"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </Field>

        <Field label="Entry Price" htmlFor="entry">
          <input
            id="entry"
            name="entry"
            type="number"
            step="any"
            required
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </Field>

        <Field label="Stop Loss" htmlFor="stopLoss">
          <input
            id="stopLoss"
            name="stopLoss"
            type="number"
            step="any"
            required
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </Field>

        <Field label="Take Profit" htmlFor="takeProfit">
          <input
            id="takeProfit"
            name="takeProfit"
            type="number"
            step="any"
            required
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </Field>
      </div>

      <Field label="Analysis" htmlFor="analysis">
        <textarea
          id="analysis"
          name="analysis"
          rows={6}
          placeholder="Explain setup, confirmation, invalidation, and market context..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </Field>

      <Field label="Chart Screenshot" htmlFor="chartScreenshotFile">
        <input
          id="chartScreenshotFile"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        {uploading && (
          <p className="mt-2 text-sm text-slate-500">Uploading screenshot...</p>
        )}
        {screenshotUrl && (
          <div className="mt-3">
            <p className="mb-2 text-sm text-green-600">Screenshot uploaded</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl}
              alt="Uploaded chart screenshot"
              className="max-h-64 rounded-lg border border-slate-200 object-contain dark:border-slate-800"
            />
          </div>
        )}
      </Field>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create Signal"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      {children}
    </div>
  );
}