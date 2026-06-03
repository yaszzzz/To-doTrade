export function calculatePublicBacktestStats(
  trades: Array<{
    result: "win" | "loss" | "breakeven";
    rrAchieved: string;
  }>
) {
  const totalTrades = trades.length;
  const wins = trades.filter((trade) => trade.result === "win").length;
  const losses = trades.filter((trade) => trade.result === "loss").length;
  const breakevens = trades.filter((trade) => trade.result === "breakeven").length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  const rrValues = trades.map((trade) => Number(trade.rrAchieved) || 0);
  const averageRR =
    totalTrades > 0 ? rrValues.reduce((sum, rr) => sum + rr, 0) / totalTrades : 0;

  const grossProfit = rrValues.filter((rr) => rr > 0).reduce((sum, rr) => sum + rr, 0);
  const grossLoss = Math.abs(
    rrValues.filter((rr) => rr < 0).reduce((sum, rr) => sum + rr, 0)
  );
  const profitFactor =
    grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? grossProfit : 0;

  return {
    totalTrades,
    wins,
    losses,
    breakevens,
    winRate,
    averageRR,
    profitFactor,
  };
}