# PRD - ToDoTrade

## Project Overview

### Project Name

ToDoTrade

### Project Type

Web Application (SaaS)

### Description

ToDoTrade adalah platform Trading Journal dan Trading Performance Tracker yang dirancang untuk trader Crypto Futures dan Saham.

Platform ini membantu trader mencatat setiap transaksi, melakukan backtest strategi, mengelola portofolio, menyimpan dokumentasi trading, serta menampilkan performa trading melalui dashboard analitik yang mudah dipahami.

Tujuan utama ToDoTrade adalah membantu trader menjadi lebih disiplin, objektif, dan data-driven dalam mengambil keputusan trading.

---

# Problem Statement

Sebagian besar trader:

* Tidak memiliki jurnal trading yang rapi.
* Tidak mengetahui performa strategi mereka secara statistik.
* Tidak menyimpan dokumentasi trade dengan baik.
* Sulit mengevaluasi kesalahan yang berulang.
* Tidak memiliki track record signal yang transparan.

ToDoTrade hadir sebagai pusat dokumentasi dan analisis trading dalam satu platform.

---

# Goals

### Primary Goals

* Membantu trader mendokumentasikan seluruh aktivitas trading.
* Menyediakan statistik performa trading secara otomatis.
* Menyediakan sistem backtest yang terstruktur.
* Menyimpan histori signal trading.
* Menampilkan perkembangan portofolio secara visual.

### Secondary Goals

* Meningkatkan disiplin trader.
* Membantu validasi strategi sebelum digunakan.
* Membangun track record signal yang transparan.

---

# Target Users

## Trader Crypto Futures

Karakteristik:

* Scalper
* Day Trader
* Swing Trader

## Trader Saham

Karakteristik:

* Swing Trader
* Position Trader

## Trading Educator

Karakteristik:

* Membagikan signal kepada komunitas.
* Menampilkan histori performa signal.

---

# Core Features

## 1. Authentication

### User Login

* Google OAuth
* Email Session Management

### User Profile

Data:

* Full Name
* Email
* Avatar
* Join Date

---

# 2. Dashboard

Menampilkan ringkasan performa trading.

### Metrics

* Total Trade
* Total Profit
* Total Loss
* Win Rate
* Average RR
* Profit Factor
* Current Drawdown
* Best Trade
* Worst Trade
* Average Monthly Return

### Charts

* Portfolio Growth
* Monthly Performance
* Win vs Loss Distribution

---

# 3. Trading Journal

Fitur utama aplikasi.

### Create Trade

Field:

* Market Type

  * Crypto Futures
  * Crypto Spot
  * Saham

* Pair / Ticker

* Long / Short

* Entry Price

* Stop Loss

* Take Profit

* Risk Percentage

* Position Size

* RR Ratio

* Trade Date

### Trade Result

* Win
* Loss
* Break Even

### Documentation

* Screenshot Entry
* Screenshot Exit

### Notes

* Trading Reason
* Psychology Notes
* Evaluation Notes

### Trade Tags

Contoh:

* Breakout
* Retest
* Double Top
* Double Bottom
* Liquidity Grab
* DCL
* WCL
* Scalping
* Swing

---

# 4. Backtest Center

Digunakan untuk menyimpan hasil pengujian strategi.

## Strategy Information

Data:

* Strategy Name
* Market
* Timeframe
* RR Target
* Description

Contoh:

Double Top Breakout

BTCUSDT
15M
RR 1:2

---

## Backtest Dataset

Target:

100 Trade Sample

Data per Trade:

* Trade Number
* Pair
* Entry Date
* Result
* RR
* Screenshot

---

## Backtest Statistics

Automatic Calculation:

* Total Trade
* Win Trade
* Loss Trade
* Win Rate
* Average RR
* Expectancy
* Profit Factor
* Max Drawdown
* Consecutive Wins
* Consecutive Losses

---

# 5. Trading Signal

Menyimpan histori signal trading.

## Before Signal

Data:

* Pair
* Entry
* Stop Loss
* Take Profit
* Risk Reward
* Signal Date
* Analysis
* Chart Screenshot

---

## After Signal

Data:

* Result
* Profit/Loss
* RR Achieved
* Result Screenshot

Status:

* Running
* Hit TP
* Hit SL
* Cancelled

---

# 6. Portfolio Tracker

Mengelola aset yang dimiliki.

### Asset Information

* Asset Name
* Quantity
* Average Price
* Current Value
* Profit/Loss

### Asset Type

* Crypto
* Saham
* Cash

---

### Portfolio Analytics

* Total Portfolio Value
* Total Invested Capital
* Unrealized Profit
* Realized Profit

---

# 7. Strategy Vault

Tempat menyimpan SOP strategi.

## Strategy Detail

Data:

* Strategy Name
* Rules
* Entry Criteria
* Exit Criteria
* Risk Management

Contoh:

Double Top Strategy

Checklist:

* Trend Up
* Double Top Formation
* Stochastic Overbought
* Neckline Break

---

# 8. Playbook

Evaluasi sebelum dan sesudah entry.

## Pre Trade Checklist

* Setup Valid?
* RR Minimum 1:2?
* Risk <= 1%?
* Trend Confirmed?

## Post Trade Review

* Apa yang berjalan baik?
* Apa yang salah?
* Apa yang perlu diperbaiki?

---

# 9. Analytics

Analisis performa trading.

## Performance Metrics

### By Pair

* BTC
* ETH
* BNB
* AAPL
* TSLA

### By Setup

* Breakout
* Retest
* DCL
* WCL

### By Time

* Daily
* Weekly
* Monthly

---

# Future Features

## AI Trading Coach

Analisis otomatis terhadap jurnal.

Contoh insight:

* Pair paling profitable
* Jam trading terbaik
* Setup terbaik
* Kesalahan yang sering dilakukan

---

## Auto Import Trading History

Integrasi:

* Binance
* Bybit
* OKX

---

## TradingView Integration

* Import Screenshot
* Save Analysis

---

# Non Functional Requirements

## Performance

* Page Load < 2 Seconds
* Optimized Image Loading
* Lazy Loading Charts

## Security

* OAuth Authentication
* Protected Routes
* Role Based Access Control

## Scalability

* Serverless Architecture
* Cloud Storage
* Edge Deployment

---

# Tech Stack

## Frontend

* Next.js 16
* React 19
* Tailwind CSS
* Shadcn UI

## Backend

* Next.js Server Actions
* API Routes

## Database

* Turso (libSQL)

## ORM

* Prisma ORM

## Authentication

* Auth.js (Google OAuth)

## File Storage

* Cloudinary

## Charts

* Recharts

## Deployment

* Vercel

---

# MVP Scope

Version 1.0

Features:

* Authentication
* Dashboard
* Trading Journal
* Backtest Center
* Trading Signal
* Portfolio Tracker
* Screenshot Upload
* Basic Analytics

Target Launch:

MVP dalam 4-6 minggu pengembangan.
