# Rodney Uber Server

Backend application built with TypeScript, Node.js, Express, Mongoose, Resend API, JWT, Multer, Winston, and Socket.io.

## Features

- **Authentication API:** Secure token-based authentication (JWT) with bcrypt password hashing.
- **Email Service:** Transactional email sending via the official **Resend API SDK** (`resend`).
- **File Upload:** Managed via Multer with validation and processing.
- **Data Validation:** Robust schema and request validation using Zod and Mongoose.
- **Code Quality & Testing:** Jest test suite with TypeScript integration (`ts-jest`), ESLint, and Prettier.
- **Logging:** Structured logging with Winston and daily log rotation.
- **Real-Time Communication:** WebSockets via Socket.io.

## Tech Stack

- TypeScript
- Node.js
- Express
- Mongoose / MongoDB
- Resend SDK (`resend`)
- Bcrypt / JSONWebToken (JWT)
- Winston / Morgan
- Jest / ts-jest
- Socket.io

## Email Service Configuration (Resend)

The application uses Resend API for transactional emails (account verification, password reset, coupon verification).

### 1. Create a Resend API Key

1. Log in to your [Resend Dashboard](https://resend.com).
2. Go to [API Keys](https://resend.com/api-keys).
3. Click **Create API Key**.
4. Set permission to **Sending access** (or Full access) and select your verified domain (`zeroproofdrive.org`).
5. Copy the generated API key.

### 2. Configure Environment Variables

Create or update your `.env` file in the project root:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key
MAIL_FROM="ZeroProofDrive <noreply@zeroproofdrive.org>"
```

> **Note:**
> - `RESEND_API_KEY`: Server-side API key from Resend. Never commit this to Git or expose it to clients.
> - `MAIL_FROM`: The sender address. Must use your verified Resend domain (e.g., `noreply@zeroproofdrive.org`).

### 3. Verification & DNS Status

- Verified domain: `zeroproofdrive.org`
- No additional DNS changes are required if the domain is already verified in Resend.

## Running Tests

Run the automated test suite (uses mocked Resend API, so no real emails are sent):

```bash
pnpm test
```

## Performing a Real Email Integration Test

To explicitly test sending a real transactional email with valid Resend credentials:

```bash
npx ts-node scripts/sendTestEmail.ts your_email@example.com
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm

### Installation

```bash
pnpm install
```

### Running Locally

```bash
# Start development server
pnpm run dev

# Build project
pnpm run build

# Start production server
pnpm start
```
