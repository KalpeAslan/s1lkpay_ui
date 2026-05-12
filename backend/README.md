# Fintech Backend API

NestJS backend application for fintech operations including domestic transfers, international transfers, FX conversions, and payment orders.

## Features

- **TypeORM** integration with PostgreSQL
- **Swagger** API documentation
- **Class Validator** for DTO validation
- Entity relationships with Applications

## Entities

### 1. Domestic Transfers
- Recipient information (name, ID, IBAN, bank)
- Amount and currency
- KBE (resident status code)
- KBP (payment purpose code)
- Payment purpose description

### 2. Global Transfers
- Amount and currency
- Account from
- Receiver address and country
- Country code

### 3. FX Convert
- Buy/Sell amounts and currencies
- Exchange rate

### 4. Payment Orders
- KNP (payment purpose code)
- KVO (currency operation code)
- Optional message
- Amount and currency

### 5. Applications
- Application number
- Type (DOMESTIC_TRANSFER, GLOBAL_TRANSFER, FX_CONVERT, PAYMENT_ORDER)
- Status (PENDING, IN_PROGRESS, APPROVED, REJECTED, COMPLETED, CANCELLED)
- Relations to specific operation entities

## Installation

```bash
$ pnpm install
```

## Database Setup

1. Install PostgreSQL
2. Create database:
```bash
createdb fintech
```

3. Update `.env` file with your database credentials

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## API Documentation

Once the application is running, visit:
- Swagger UI: http://localhost:3000/api

## API Endpoints

### Domestic Transfers
- `POST /domestic-transfers` - Create domestic transfer
- `GET /domestic-transfers` - Get all domestic transfers
- `GET /domestic-transfers/:id` - Get transfer by ID

### Global Transfers
- `POST /global-transfers` - Create global transfer
- `GET /global-transfers` - Get all global transfers
- `GET /global-transfers/:id` - Get transfer by ID

### FX Convert
- `POST /fx-convert` - Create FX conversion
- `GET /fx-convert` - Get all conversions
- `GET /fx-convert/:id` - Get conversion by ID

### Payment Orders
- `POST /payment-orders` - Create payment order
- `GET /payment-orders` - Get all orders
- `GET /payment-orders/:id` - Get order by ID

### Applications
- `GET /applications` - Get all applications
- `GET /applications/:id` - Get application by ID
- `GET /applications/number/:number` - Get application by number

## Environment Variables

See `.env.example` for required environment variables.

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
