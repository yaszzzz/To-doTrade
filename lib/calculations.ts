export type BacktestResult = "win" | "loss" | "breakeven";
export type AssetType = "crypto" | "saham" | "cash";

export function calculateBacktestStats(
  trades: Array<{
    result: BacktestResult;
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
    totalTrades > 0
      ? rrValues.reduce((sum, rr) => sum + rr, 0) / totalTrades
      : 0;

  const grossProfit = rrValues
    .filter((rr) => rr > 0)
    .reduce((sum, rr) => sum + rr, 0);
  const grossLoss = Math.abs(
    rrValues.filter((rr) => rr < 0).reduce((sum, rr) => sum + rr, 0)
  );
  const profitFactor =
    grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? grossProfit : 0;
  const expectancy = averageRR;

  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let consecutiveWins = 0;
  let consecutiveLosses = 0;
  let currentWins = 0;
  let currentLosses = 0;

  for (const trade of trades) {
    const rr = Number(trade.rrAchieved) || 0;
    equity += rr;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);

    if (trade.result === "win") {
      currentWins += 1;
      currentLosses = 0;
    } else if (trade.result === "loss") {
      currentLosses += 1;
      currentWins = 0;
    } else {
      currentWins = 0;
      currentLosses = 0;
    }

    consecutiveWins = Math.max(consecutiveWins, currentWins);
    consecutiveLosses = Math.max(consecutiveLosses, currentLosses);
  }

  return {
    totalTrades,
    wins,
    losses,
    breakevens,
    winRate,
    averageRR,
    expectancy,
    profitFactor,
    maxDrawdown,
    consecutiveWins,
    consecutiveLosses,
  };
}

export function calculatePortfolioStats(
  assets: Array<{
    assetType: AssetType;
    quantity: string;
    averagePrice: string;
    currentPrice: string | null;
  }>
) {
  const totalInvestedCapital = assets.reduce((sum, asset) => {
    return sum + Number(asset.quantity) * Number(asset.averagePrice);
  }, 0);

  const totalPortfolioValue = assets.reduce((sum, asset) => {
    const currentPrice = Number(asset.currentPrice || asset.averagePrice);
    return sum + Number(asset.quantity) * currentPrice;
  }, 0);

  const unrealizedProfit = totalPortfolioValue - totalInvestedCapital;

  const allocation = assets.reduce<Record<AssetType, number>>(
    (acc, asset) => {
      const currentPrice = Number(asset.currentPrice || asset.averagePrice);
      acc[asset.assetType] += Number(asset.quantity) * currentPrice;
      return acc;
    },
    { crypto: 0, saham: 0, cash: 0 }
  );

  return {
    totalAssets: assets.length,
    totalInvestedCapital,
    totalPortfolioValue,
    unrealizedProfit,
    allocation,
  };
}