"use client";

import {
  updateSignalStatus,
  type SignalResult,
  type SignalStatus,
} from "@/lib/actions/signals.actions";
import { uploadImage } from "@/lib/actions/upload.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignalStatusForm({
  signalId,
  currentStatus,
  currentResult,
  currentProfitLoss,
  currentRrAchieved,
  currentResultScreenshot,
}: {
  signalId: string;
  currentStatus: SignalStatus;
  currentResult: SignalResult | null;
  currentProfitLoss: string | null;
  currentRrAchieved: string | null;
  currentResultScreenshot: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resultScreenshotUrl, setResultScreenshotUrl] = useState(
    currentResultScreenshot ?? ""
  );

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
      setResultScreenshotUrl(result.url);
    }

    setUploading(false);
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");

    formData.set("resultScreenshot", resultScreenshotUrl);

    const result = await updateSignalStatus(signalId, formData);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Status" htmlFor="status">
          <select
            id="status"
            name="status"
            defaultValue={currentStatus}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="running">Running</option>
            <option value="hit_tp">Hit TP</option>
            <option value="hit_sl">Hit SL</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </Field>

        <Field label="Result" htmlFor="result">
          <select
            id="result"
            name="result"
            defaultValue={currentResult ?? ""}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="">No Result</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="breakeven">Breakeven</option>
          </select>
        </Field>

        <Field label="Profit / Loss" htmlFor="profitLoss">
          <input
            id="profitLoss"
            name="profitLoss"
            type="number"
            step="any"
            defaultValue={currentProfitLoss ?? ""}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </Field>

        <Field label="RR Achieved" htmlFor="rrAchieved">
          <input
            id="rrAchieved"
            name="rrAchieved"
            type="number"
            step="any"
            defaultValue={currentRrAchieved ?? ""}
            placeholder="0.00"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </Field>
      </div>

      <Field label="Result Screenshot" htmlFor="resultScreenshotFile">
        <input
          id="resultScreenshotFile"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={(event) =>
            void handleUpload(event.target.files?.[0] ?? null)
          }
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
        {uploading && (
          <p className="mt-2 text-sm text-slate-500">Uploading screenshot...</p>
        )}
        {resultScreenshotUrl && (
          <div className="mt-3">
            <p className="mb-2 text-sm text-green-600">Screenshot uploaded</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultScreenshotUrl}
              alt="Signal result screenshot"
              className="max-h-64 rounded-lg border border-slate-200 object-contain dark:border-slate-800"
            />
          </div>
        )}
      </Field>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Signal"}
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