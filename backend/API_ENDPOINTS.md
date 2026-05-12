# API Endpoints Documentation

Base URL: `http://localhost:3000`
Swagger Documentation: `http://localhost:3000/api`

## Domestic Transfers

### Create Domestic Transfer
- **POST** `/domestic-transfers`
- **Request Body:**
```json
{
  "recipientName": "Иванов Иван Иванович",
  "recipientId": "123456789012",
  "recipientIban": "KZ12345678901234567890",
  "recipientBank": "Halyk Bank",
  "amount": 100000,
  "currency": "KZT",
  "kbe": "11",
  "kbp": "17",
  "paymentPurpose": "Оплата услуг"
}
```
- **Response:** Application object with embedded domestic transfer

### Get All Domestic Transfers
- **GET** `/domestic-transfers`
- **Response:** Array of applications with domestic transfers

### Get Domestic Transfer by ID
- **GET** `/domestic-transfers/:id`
- **Response:** Application object with embedded domestic transfer

---

## Global Transfers

### Create Global Transfer
- **POST** `/global-transfers`
- **Request Body:**
```json
{
  "amount": 50000,
  "currency": "USD",
  "accountFrom": "KZ12345678901234567890",
  "receiverAddress": "123 Main Street, New York, NY 10001",
  "receiverCountry": "UNITED STATES OF AMERICA",
  "receiverCountryCode": "USA"
}
```
- **Response:** Application object with embedded global transfer

### Get All Global Transfers
- **GET** `/global-transfers`
- **Response:** Array of applications with global transfers

### Get Global Transfer by ID
- **GET** `/global-transfers/:id`
- **Response:** Application object with embedded global transfer

---

## FX Convert

### Create FX Conversion
- **POST** `/fx-convert`
- **Request Body:**
```json
{
  "buyAmount": 100000,
  "buyCurrency": "KZT",
  "sellAmount": 213.5,
  "sellCurrency": "USD",
  "exchangeRate": 468.38
}
```
- **Response:** Application object with embedded FX conversion

### Get All FX Conversions
- **GET** `/fx-convert`
- **Response:** Array of applications with FX conversions

### Get FX Conversion by ID
- **GET** `/fx-convert/:id`
- **Response:** Application object with embedded FX conversion

---

## Payment Orders

### Create Payment Order
- **POST** `/payment-orders`
- **Request Body:**
```json
{
  "knp": "002",
  "kvo": "1111",
  "message": "Дополнительная информация",
  "amount": 500000,
  "currency": "KZT"
}
```
- **Response:** Application object with embedded payment order

### Get All Payment Orders
- **GET** `/payment-orders`
- **Response:** Array of applications with payment orders

### Get Payment Order by ID
- **GET** `/payment-orders/:id`
- **Response:** Application object with embedded payment order

---

## Applications

### Get All Applications
- **GET** `/applications`
- **Response:** Array of all applications with related entities

### Get Application by ID
- **GET** `/applications/:id`
- **Response:** Application object with all relations

### Get Application by Number
- **GET** `/applications/number/:number`
- **Response:** Application object with all relations

---

## Response Structure

### Application Response
```json
{
  "id": "uuid",
  "number": "DT-1704067200000-123",
  "type": "DOMESTIC_TRANSFER",
  "status": "PENDING",
  "description": "Внутренний перевод на Иванов Иван Иванович",
  "amount": 100000,
  "currency": "KZT",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "domesticTransfer": {
    "id": "uuid",
    "recipientName": "Иванов Иван Иванович",
    "recipientId": "123456789012",
    "recipientIban": "KZ12345678901234567890",
    "recipientBank": "Halyk Bank",
    "amount": 100000,
    "currency": "KZT",
    "kbe": "11",
    "kbp": "17",
    "paymentPurpose": "Оплата услуг",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### Application Types
- `DOMESTIC_TRANSFER` - Domestic transfer
- `GLOBAL_TRANSFER` - International transfer
- `FX_CONVERT` - Currency conversion
- `PAYMENT_ORDER` - Payment order

### Application Status
- `PENDING` - Awaiting processing
- `IN_PROGRESS` - Currently being processed
- `APPROVED` - Approved
- `REJECTED` - Rejected
- `COMPLETED` - Completed successfully
- `CANCELLED` - Cancelled

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["field must be a string", "field should not be empty"],
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Not Found"
}
```

