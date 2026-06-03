import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate RR Ratio
export function calculateRR(entry: number, stopLoss: number, takeProfit: number): number {
  const risk = Math.abs(entry - stopLoss);
  const reward = Math.abs(takeProfit - entry);
  return risk > 0 ? reward / risk : 0;
}

// Calculate Position Size
export function calculatePositionSize(
  capital: number,
  riskPercentage: number,
  entry: number,
  stopLoss: number
): number {
  const riskAmount = capital * (riskPercentage / 100);
  const riskPerUnit = Math.abs(entry - stopLoss);
  return riskPerUnit > 0 ? riskAmount / riskPerUnit : 0;
}

// Calculate Profit/Loss
export function calculatePL(
  positionSize: number,
  entry: number,
  exit: number,
  positionType: "long" | "short"
): number {
  if (positionType === "long") {
    return positionSize * (exit - entry);
  } else {
    return positionSize * (entry - exit);
  }
}

// Format currency
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

// Format date
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

// Format datetime
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}