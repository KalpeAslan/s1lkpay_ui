# S1lk PAY — Crypto Payment Links

[![License: MIT](https://img.shields.io/badge/License-MIT-14F195.svg)](LICENSE)
[![Solana](https://img.shields.io/badge/Solana-devnet-9945FF)](https://solana.com)
[![Hackathon](https://img.shields.io/badge/Colosseum-2026-14F195)](https://colosseum.org)

> Accept crypto payments with a single link — no wallet setup required for your customers. Merchants create payment links in seconds, receive funds in any supported token, and withdraw to any Solana address or bank card.

[Live Demo](http://194.32.140.219:9090) · [Video Walkthrough](#) · [Colosseum Submission](#)

---

## Problem and Solution

### 1. Crypto Payments Are Too Complex
- **Problem:** Accepting crypto requires merchants to manage wallets, handle multiple tokens, and manually verify transactions.
- **S1lk PAY:** One link, one click — the system handles wallet creation, payment detection, and token conversion automatically.

### 2. Token Fragmentation
- **Problem:** Customers hold different tokens (USDC, USDT, SOL, meme coins) — merchants either reject payment or juggle multiple wallets.
- **S1lk PAY:** `acceptAnyToken` mode lets merchants receive any supported token; the system converts it to the merchant's preferred currency.

### 3. No Visibility Into Crypto Revenue
- **Problem:** Merchants have no dashboard to track payment links, revenue, or wallet balances in one place.
- **S1lk PAY:** Full analytics dashboard with payment history, balance across all tokens, and one-click withdrawal.

---

## Why Solana

- **Speed** — Payments confirmed in seconds, not minutes; Helius webhooks notify the backend the moment funds arrive
- **Cost** — Near-zero transaction fees make micro-payments economically viable
- **Token ecosystem** — Native SPL token standard means USDC, USDT, and custom tokens all work the same way
- **Developer tooling** — `@solana/web3.js` and Helius APIs let us build production-grade wallet infrastructure fast

---

## Summary of Features

- Merchant registration with automatic Solana wallet creation (keys encrypted with AES-256-GCM)
- Payment link creation: specify token, amount, deadline, and customer info
- `acceptAnyToken` mode — accept any supported SPL token, not just the one specified
- Real-time payment detection via Helius webhooks
- QR code generation for every payment link
- Public pay page — no login required for customers
- Dashboard: payment stats, revenue, recent transactions
- Wallet balance across all tokens (SOL, USDC, USDT, KZTE, PEPE)
- Withdraw to any external Solana address or mock bank card (fiat off-ramp)
- Token conversion between supported assets

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React · Vite · TailwindCSS |
| Backend | NestJS · TypeORM · PostgreSQL |
| Blockchain | Solana devnet · `@solana/web3.js` · SPL Token |
| Payment monitoring | Helius Webhooks |
| Auth | JWT · Passport |
| Key storage | AES-256-GCM encryption |
| API docs | Swagger / OpenAPI |
| Process manager | PM2 |

---

## Architecture

```
┌──────────────┐     ┌─────────────────────────┐     ┌──────────────────┐
│   Merchant   │────▶│      NestJS Backend      │────▶│  PostgreSQL DB   │
│  (React UI)  │     │  ┌───────────────────┐   │     └──────────────────┘
└──────────────┘     │  │  Payment Links    │   │
                     │  └────────┬──────────┘   │     ┌──────────────────┐
┌──────────────┐     │  ┌────────▼──────────┐   │────▶│  Solana devnet   │
│   Customer   │────▶│  │  Wallet Service   │   │     │  (SPL Tokens)    │
│  (pay page)  │     │  └────────┬──────────┘   │     └──────────────────┘
└──────────────┘     │  ┌────────▼──────────┐   │
                     │  │ Conversion Service│   │     ┌──────────────────┐
                     │  └───────────────────┘   │◀────│ Helius Webhooks  │
                     └─────────────────────────┘     └──────────────────┘
```

---

## Supported Tokens

| Token | Network | Mint Address |
|-------|---------|-------------|
| SOL | Solana devnet | native |
| USDC | Solana devnet | `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` |
| USDT | Solana devnet | `45zcDDKqkWktUKLCdKYHLYznWg4Ypa9XShvuBqnNpgDp` |
| KZTE | Solana devnet | `Fc5LwYYMLr5Ea5CFnZ3TGPcyV7od4qu8r3Yot6ewmd3r` |
| PEPE | Solana devnet | `HCK7Hu7ZoX9wEiK3dETpBS88J4vj3A659Cj3FUi231dG` |

---

## Quick Start

**Prerequisites:** Node.js 18+, PostgreSQL

```bash
# Clone the repository
git clone https://github.com/KalpeAslan/s1lkpay_ui.git
cd s1lkpay_ui

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your DB credentials, JWT secret, Helius API key

# Start backend
npm run start:dev

# Start frontend (in root directory)
cd .. && npm run dev
```

---

## Environment Variables

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=fintech_hack

JWT_SECRET=your-secret-key
WALLET_ENCRYPTION_KEY=your-long-random-secret

SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY
HELIUS_API_KEY=your-helius-api-key
WEBHOOK_BASE_URL=https://your-server.com

PORT=3000
```

---

## API Documentation

Swagger UI is available at `/api` after starting the backend.

Main endpoints:
- `POST /auth/register` — merchant registration (auto-creates Solana wallet)
- `POST /auth/login` — JWT authentication
- `POST /payment-links` — create payment link
- `GET /payment-links/pay/:slug` — public pay page data
- `POST /payment-links/confirm/:slug` — confirm payment
- `GET /wallet/balance` — wallet balances across all tokens
- `POST /wallet/withdraw` — withdraw to external address
- `GET /dashboard/stats` — revenue and payment analytics

---

## Roadmap

- [x] Merchant auth with auto wallet creation
- [x] Payment link creation with QR codes
- [x] Multi-token support (SOL, USDC, USDT, KZTE, PEPE)
- [x] Helius webhook payment detection
- [x] Token conversion between supported assets
- [x] Dashboard with analytics
- [x] Fiat withdrawal (mock)
- [ ] Mainnet deployment
- [ ] Real DEX integration (Jupiter) for token swaps
- [ ] Email/Telegram notifications on payment receipt
- [ ] Multi-currency fiat off-ramp

---

## Resources

- [Live Application](http://194.32.140.219:9090)
- [Video Demo](#)
- [API Docs](http://194.32.140.219:9090/api)

---

## License

MIT — see [LICENSE](LICENSE)
