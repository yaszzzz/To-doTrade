import { pgTable, uuid, varchar, text, timestamp, integer, decimal, pgEnum, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const marketTypeEnum = pgEnum("market_type", ["crypto_futures", "crypto_spot", "saham"]);
export const positionTypeEnum = pgEnum("position_type", ["long", "short"]);
export const tradeResultEnum = pgEnum("trade_result", ["win", "loss", "breakeven"]);
export const signalStatusEnum = pgEnum("signal_status", ["running", "hit_tp", "hit_sl", "cancelled"]);
export const assetTypeEnum = pgEnum("asset_type", ["crypto", "saham", "cash"]);

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }), // nullable for OAuth users
  name: varchar("name", { length: 255 }).notNull(),
  avatar: text("avatar"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Trading Journal (Trades)
export const trades = pgTable("trades", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  marketType: marketTypeEnum("market_type").notNull(),
  pair: varchar("pair", { length: 50 }).notNull(), // e.g., BTCUSDT, AAPL
  positionType: positionTypeEnum("position_type").notNull(),
  entryPrice: decimal("entry_price", { precision: 20, scale: 8 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 20, scale: 8 }).notNull(),
  takeProfit: decimal("take_profit", { precision: 20, scale: 8 }).notNull(),
  riskPercentage: decimal("risk_percentage", { precision: 5, scale: 2 }).notNull(),
  positionSize: decimal("position_size", { precision: 20, scale: 8 }).notNull(),
  rrRatio: decimal("rr_ratio", { precision: 10, scale: 2 }).notNull(),
  tradeDate: timestamp("trade_date").notNull(),
  result: tradeResultEnum("result"),
  profitLoss: decimal("profit_loss", { precision: 20, scale: 2 }),
  screenshotEntry: text("screenshot_entry"), // Cloudinary URL
  screenshotExit: text("screenshot_exit"), // Cloudinary URL
  tradingReason: text("trading_reason"),
  psychologyNotes: text("psychology_notes"),
  evaluationNotes: text("evaluation_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("trades_user_id_idx").on(table.userId),
  tradeDateIdx: index("trades_trade_date_idx").on(table.tradeDate),
}));

// Trade Tags
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Trade Tags Junction Table
export const tradeTags = pgTable("trade_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  tradeId: uuid("trade_id").references(() => trades.id, { onDelete: "cascade" }).notNull(),
  tagId: uuid("tag_id").references(() => tags.id, { onDelete: "cascade" }).notNull(),
}, (table) => ({
  tradeIdIdx: index("trade_tags_trade_id_idx").on(table.tradeId),
  tagIdIdx: index("trade_tags_tag_id_idx").on(table.tagId),
}));

// Backtest Strategies
export const backtestStrategies = pgTable("backtest_strategies", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  strategyName: varchar("strategy_name", { length: 255 }).notNull(),
  market: varchar("market", { length: 50 }).notNull(),
  timeframe: varchar("timeframe", { length: 20 }).notNull(),
  rrTarget: varchar("rr_target", { length: 20 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("backtest_strategies_user_id_idx").on(table.userId),
}));

// Backtest Trades (Samples)
export const backtestTrades = pgTable("backtest_trades", {
  id: uuid("id").defaultRandom().primaryKey(),
  strategyId: uuid("strategy_id").references(() => backtestStrategies.id, { onDelete: "cascade" }).notNull(),
  tradeNumber: integer("trade_number").notNull(),
  pair: varchar("pair", { length: 50 }).notNull(),
  entryDate: timestamp("entry_date").notNull(),
  result: tradeResultEnum("result").notNull(),
  rrAchieved: decimal("rr_achieved", { precision: 10, scale: 2 }).notNull(),
  screenshot: text("screenshot"), // Cloudinary URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  strategyIdIdx: index("backtest_trades_strategy_id_idx").on(table.strategyId),
}));

// Trading Signals
export const signals = pgTable("signals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  pair: varchar("pair", { length: 50 }).notNull(),
  entry: decimal("entry", { precision: 20, scale: 8 }).notNull(),
  stopLoss: decimal("stop_loss", { precision: 20, scale: 8 }).notNull(),
  takeProfit: decimal("take_profit", { precision: 20, scale: 8 }).notNull(),
  riskReward: decimal("risk_reward", { precision: 10, scale: 2 }).notNull(),
  signalDate: timestamp("signal_date").notNull(),
  analysis: text("analysis"),
  chartScreenshot: text("chart_screenshot"), // Cloudinary URL
  // After Signal Fields
  status: signalStatusEnum("status").default("running").notNull(),
  result: tradeResultEnum("result"),
  profitLoss: decimal("profit_loss", { precision: 20, scale: 2 }),
  rrAchieved: decimal("rr_achieved", { precision: 10, scale: 2 }),
  resultScreenshot: text("result_screenshot"), // Cloudinary URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("signals_user_id_idx").on(table.userId),
  signalDateIdx: index("signals_signal_date_idx").on(table.signalDate),
}));

// Portfolio Assets
export const portfolioAssets = pgTable("portfolio_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  assetType: assetTypeEnum("asset_type").notNull(),
  assetName: varchar("asset_name", { length: 100 }).notNull(),
  quantity: decimal("quantity", { precision: 20, scale: 8 }).notNull(),
  averagePrice: decimal("average_price", { precision: 20, scale: 8 }).notNull(),
  currentPrice: decimal("current_price", { precision: 20, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("portfolio_assets_user_id_idx").on(table.userId),
}));

// Strategy Vault
export const strategies = pgTable("strategies", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  strategyName: varchar("strategy_name", { length: 255 }).notNull(),
  rules: text("rules"),
  entryCriteria: text("entry_criteria"),
  exitCriteria: text("exit_criteria"),
  riskManagement: text("risk_management"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("strategies_user_id_idx").on(table.userId),
}));

// Playbook Entries
export const playbookEntries = pgTable("playbook_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  tradeId: uuid("trade_id").references(() => trades.id, { onDelete: "cascade" }),
  // Pre Trade Checklist
  setupValid: boolean("setup_valid"),
  rrMinimum: boolean("rr_minimum"),
  riskAcceptable: boolean("risk_acceptable"),
  trendConfirmed: boolean("trend_confirmed"),
  // Post Trade Review
  whatWentWell: text("what_went_well"),
  whatWentWrong: text("what_went_wrong"),
  whatToImprove: text("what_to_improve"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("playbook_entries_user_id_idx").on(table.userId),
  tradeIdIdx: index("playbook_entries_trade_id_idx").on(table.tradeId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  trades: many(trades),
  backtestStrategies: many(backtestStrategies),
  signals: many(signals),
  portfolioAssets: many(portfolioAssets),
  strategies: many(strategies),
  playbookEntries: many(playbookEntries),
}));

export const tradesRelations = relations(trades, ({ one, many }) => ({
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
  }),
  tradeTags: many(tradeTags),
  playbookEntry: one(playbookEntries),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  tradeTags: many(tradeTags),
}));

export const tradeTagsRelations = relations(tradeTags, ({ one }) => ({
  trade: one(trades, {
    fields: [tradeTags.tradeId],
    references: [trades.id],
  }),
  tag: one(tags, {
    fields: [tradeTags.tagId],
    references: [tags.id],
  }),
}));

export const backtestStrategiesRelations = relations(backtestStrategies, ({ one, many }) => ({
  user: one(users, {
    fields: [backtestStrategies.userId],
    references: [users.id],
  }),
  backtestTrades: many(backtestTrades),
}));

export const backtestTradesRelations = relations(backtestTrades, ({ one }) => ({
  strategy: one(backtestStrategies, {
    fields: [backtestTrades.strategyId],
    references: [backtestStrategies.id],
  }),
}));

export const signalsRelations = relations(signals, ({ one }) => ({
  user: one(users, {
    fields: [signals.userId],
    references: [users.id],
  }),
}));

export const portfolioAssetsRelations = relations(portfolioAssets, ({ one }) => ({
  user: one(users, {
    fields: [portfolioAssets.userId],
    references: [users.id],
  }),
}));

export const strategiesRelations = relations(strategies, ({ one }) => ({
  user: one(users, {
    fields: [strategies.userId],
    references: [users.id],
  }),
}));

export const playbookEntriesRelations = relations(playbookEntries, ({ one }) => ({
  user: one(users, {
    fields: [playbookEntries.userId],
    references: [users.id],
  }),
  trade: one(trades, {
    fields: [playbookEntries.tradeId],
    references: [trades.id],
  }),
}));

// Type exports for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Trade = typeof trades.$inferSelect;
export type NewTrade = typeof trades.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type BacktestStrategy = typeof backtestStrategies.$inferSelect;
export type NewBacktestStrategy = typeof backtestStrategies.$inferInsert;
export type BacktestTrade = typeof backtestTrades.$inferSelect;
export type NewBacktestTrade = typeof backtestTrades.$inferInsert;
export type Signal = typeof signals.$inferSelect;
export type NewSignal = typeof signals.$inferInsert;
export type PortfolioAsset = typeof portfolioAssets.$inferSelect;
export type NewPortfolioAsset = typeof portfolioAssets.$inferInsert;
export type Strategy = typeof strategies.$inferSelect;
export type NewStrategy = typeof strategies.$inferInsert;
export type PlaybookEntry = typeof playbookEntries.$inferSelect;
export type NewPlaybookEntry = typeof playbookEntries.$inferInsert;