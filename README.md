# AML Monitoring Platform – Rule-Based Anti-Money Laundering Transaction Monitoring System

The AML Monitoring Platform is a full-stack financial crime monitoring system designed to simulate how financial institutions monitor customer transactions, detect suspicious activity, and manage AML investigations.

Unlike customer-facing banking applications, this platform is an internal banking compliance system used by administrators and AML analysts to monitor customer activity, identify potentially suspicious transactions, review generated alerts, and manage investigations.

The system uses a deterministic, rule-based AML engine to evaluate transactions against predefined monitoring rules, calculate transaction risk scores, and automatically generate alerts when suspicious patterns are detected.

Analysts can investigate alerts, record investigation notes, update investigation statuses, and adjust a customer's overall risk profile based on their findings.

This project was developed as a portfolio project inspired by real-world banking operations, transaction monitoring, and financial crime compliance workflows.

# Live Demo

**Application:** [AML Monitoring Platform](YOUR_DEPLOYED_APP_URL)

**GitHub Repository:** [AML Monitoring Platform](https://github.com/Mohiuuddin/aml-monitoring-platform)

## Overview

### User Roles

**Administrator (Admin)**

Administrators are responsible for:

- Accessing the administrative dashboard
- Managing customers and bank accounts
- Creating and monitoring transactions
- Viewing AML alerts
- Reviewing investigations
- Managing customer risk profiles
- Viewing audit logs
- Viewing configured AML monitoring rules

**AML Analyst (Analyst)**

AML analysts are responsible for:

- Accessing the AML monitoring dashboard
- Managing customer and account records
- Creating and reviewing transactions
- Monitoring suspicious transaction alerts
- Starting investigations
- Reviewing triggered AML rules
- Adding investigation notes
- Updating investigation statuses
- Updating customer risk levels
- Reviewing audit history

## Features

### Authentication & Authorization

Secure authentication and role-based access control using Better Auth.

- Email and password authentication
- Session management
- Role-based authorization
- ADMIN and ANALYST roles
- User account status management

### Dashboard

A centralized dashboard providing an overview of AML monitoring activities.

Dashboard statistics include:

- Total customers
- Total bank accounts
- Total transactions
- Total AML alerts
- Open investigations
- Risk distribution

Additional dashboard features:

- Transaction and alert trends
- Alert risk distribution chart
- Recent AML alerts
- Quick action shortcuts

### Customer Management

Administrators and analysts can manage customer records.

Customer information includes:

- Customer number
- Customer name
- Email address
- Phone number
- Country
- Customer risk level
- Customer status

Features:

- Create customer records
- View customer details
- Manage customer information
- View associated bank accounts
- View customer transactions
- View customer alerts
- Monitor customer risk profiles

### Bank Account Management

Manage bank accounts associated with customers.

Account information includes:

- Account number
- Associated customer
- Currency
- Account balance
- Account status
- Account opening date

Features:

- Create bank accounts
- View account details
- Monitor account balances
- Track account transactions
- Support active, inactive, blocked, and closed account statuses

### Transaction Management

The transaction management module allows users to create and monitor banking transactions.

Supported transaction types:

- Cash Deposit
- Cash Withdrawal
- Transfer
- Card Payment
- International Transfer

Transaction information includes:

- Transaction ID
- Customer
- Bank account
- Transaction amount
- Currency
- Transaction type
- Transaction direction (Credit / Debit)
- Counterparty information
- Counterparty country
- Transaction description
- Transaction date

Features:

- Create transactions
- View transaction history
- View transaction details
- Update account balances automatically
- Validate transaction amounts
- Restrict transactions on inactive accounts
- Automatically evaluate transactions using the AML rule engine

### Rule-Based AML Monitoring Engine

The platform includes a deterministic AML rule engine that evaluates transactions against predefined monitoring rules.

The engine retrieves active AML rules from the database and evaluates each transaction against the corresponding rule conditions.

**AML Monitoring Rules**

**1. Large Cash Transaction**

Detects large cash deposits or withdrawals.

- Applies to cash deposits and withdrawals
- Supports BDT transactions
- Triggers when a single cash transaction reaches or exceeds 1,000,000 BDT

**2. Structured Cash Activity**

Detects potentially structured cash transactions designed to avoid individual transaction thresholds.

- Evaluates multiple cash deposits and withdrawals
- Groups transactions by customer and transaction date
- Calculates the total daily cash transaction amount
- Requires at least two cash transactions
- Triggers when the total reaches or exceeds 1,000,000 BDT and at least one transaction is below the threshold

**3. Unusual Transaction**

Identifies transactions significantly larger than a customer's recent transaction history.

- Evaluates previous transactions within a 30-day lookback period
- Requires at least five previous transactions
- Calculates the average transaction amount
- Triggers when the current transaction is at least five times the previous average

**4. Rapid Fund Movement**

Detects rapid movement of incoming funds out of a customer's account.

- Evaluates outgoing debit transactions
- Reviews incoming credit transactions within the previous 24 hours
- Calculates the total incoming amount
- Triggers when outgoing funds are at least 80% of incoming funds

**5. High-Risk Jurisdiction**

Identifies international transfers involving jurisdictions classified as high-risk or subject to increased monitoring in the platform's jurisdiction reference dataset.

- Applies to international transfers
- Uses country codes to identify jurisdictions
- Checks active jurisdiction records
- Supports increased monitoring and call-for-action classifications

The jurisdiction reference data is seeded using a FATF June 2026 reference snapshot. These classifications are used for portfolio-project monitoring scenarios and should not be treated as a live regulatory compliance determination.

### Risk Scoring Engine

The platform calculates transaction risk scores based on the risk weights of triggered AML rules.

Each AML rule has an assigned risk weight.

The total risk score is calculated by adding the weights of all triggered rules, with the final score capped at 100.

**Risk Classification**

| Risk Score | Risk Level |
| ---------- | ---------- |
| 0–29       | LOW        |
| 30–59      | MEDIUM     |
| 60–79      | HIGH       |
| 80–100     | CRITICAL   |

Features:

- Automatic risk score calculation
- Rule-based risk weighting
- Multiple triggered rule support
- Risk score capped at 100
- Automatic transaction risk classification

### AML Alert Management

When a transaction triggers one or more AML monitoring rules, the system automatically generates an alert.

Alert information includes:

- Alert title
- Associated customer
- Associated transaction
- Risk score
- Risk level
- Alert status
- Triggered AML rules
- Alert description
- Creation date

Features:

- Automatic alert generation
- View all generated alerts
- Alert details
- View triggered AML rules
- Filter and search alerts
- Pagination
- Monitor alert statuses

Alert statuses:

- OPEN
- INVESTIGATING
- ESCALATED
- FALSE_POSITIVE
- CLOSED

Transactions that do not trigger any AML rule do not generate alerts.

### Investigation Management

The investigation module allows AML analysts to review suspicious transaction alerts and document their findings.

Features:

- Start an investigation from an AML alert
- View investigation details
- Review associated customer information
- Review associated transaction details
- Review triggered AML rules
- Add investigation notes
- Track investigation progress
- Update investigation status

Investigation statuses:

- OPEN
- IN_PROGRESS
- ESCALATED
- RESOLVED

Each investigation records the assigned analyst, investigation summary, notes, and timestamps.

### Customer Risk Profile Management

The platform maintains a separate risk profile for each customer.

Customer risk levels:

- LOW
- MEDIUM
- HIGH
- CRITICAL

Unlike transaction risk, which is calculated automatically for an individual transaction, the customer's overall risk profile can be updated by an analyst based on investigation findings.

Features:

- View current customer risk level
- Update customer risk level
- Record previous and new risk levels in audit logs
- Maintain customer risk information independently of individual transaction scores

### Jurisdiction Management

The platform maintains a reference dataset of jurisdictions used by the AML monitoring engine.

Jurisdiction information includes:

- Country name
- Country code
- Jurisdiction risk classification
- Reference source
- Active / Inactive status

Supported classifications:

- NORMAL
- INCREASED_MONITORING
- CALL_FOR_ACTION

The AML engine uses this information when evaluating international transactions.

The AML Rules page provides administrators with a read-only view of configured monitoring rules.

### Audit Logging

System activities are recorded to maintain an audit trail of important operations.

Recorded activities include:

- Customer and account operations
- Transaction creation
- Customer risk profile updates
- Investigation creation
- Investigation updates
- Alert status changes
- Other recorded administrative operations

Audit log information includes:

- User who performed the action
- Action type
- Entity type
- Entity ID
- Additional metadata
- Timestamp

Features:

- View audit logs
- View individual audit log details
- Track user activities
- Review historical changes

## Tech Stack

### Frontend

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- Recharts
- Lucide React
- Sonner

### Backend

- Next.js Server Actions
- Prisma ORM 7
- PostgreSQL (Supabase)
- Better Auth
- Prisma PostgreSQL Adapter

### Database

- PostgreSQL
- Supabase
- Prisma ORM

### Testing

- Vitest
- Unit testing
- Mocking with Vitest

## Testing

The project uses Vitest for automated testing of core application logic.

**Risk Scoring Tests**

- Risk score calculation
- LOW, MEDIUM, HIGH, and CRITICAL classification
- Maximum risk score limitation

**AML Rule Engine Tests**

- Large cash transaction detection
- Structured cash activity detection
- Unusual transaction detection
- Rapid fund movement detection
- High-risk jurisdiction detection
- Positive and negative rule scenarios

Prisma dependencies are mocked to test AML rule evaluation without connecting to the actual database.

**Transaction Processing Tests**

- Successful transaction creation
- Account balance update
- Zero and negative amount validation
- Inactive account transaction restriction

Run tests in watch mode:

```bash
npm run test
```

Run all tests once:

```bash
npm run test:run
```

## Project Structure

aml-monitoring-platform/
├── prisma/
│ ├── schema.prisma
│ ├── seed.ts
│ └── migrations/
│
├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ ├── (dashboard)/
│ │ └── api/
│ │
│ ├── components/
│ │ ├── dashboard/
│ │ ├── customers/
│ │ ├── accounts/
│ │ ├── transactions/
│ │ ├── alerts/
│ │ ├── investigations/
│ │ ├── audit-logs/
│ │ └── ui/
│ │
│ ├── lib/
│ │ ├── aml/
│ │ │ ├── **tests**/
│ │ │ ├── rule-engine.ts
│ │ │ ├── risk-scoring.ts
│ │ │ ├── create-alert.ts
│ │ │ └── get-country-code.ts
│ │ │
│ │ ├── auth/
│ │ ├── audit/
│ │ ├── dashboard/
│ │ ├── investigations/
│ │ ├── transactions/
│ │ │ └── **tests**/
│ │ └── prisma.ts
│ │
│ └── generated/
│ └── prisma/
│
├── prisma.config.ts
├── vitest.config.ts
├── package.json
└── README.md

## Installation

### 1. Clone the Repository

```bash
git clone <https://github.com/Mohiuuddin/aml-monitoring-platform>
```

### 2. Navigate to the Project Directory

```bash
cd aml-monitoring-platform
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migrations

```bash
npx prisma migrate deploy
```

### 6. Seed the Database

```bash
npx prisma db seed
```

### 7. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

# Screenshots

## Login

![Login](./screenshots/login%20screenshot.png)

## Admin Dashboard

![Dashboard](./screenshots/admin%20dashboard%20screenshot1.png)
![Dashboard](./screenshots/admin%20dashboard%20screenshot2.png)
![Dashboard](./screenshots/admin%20dashboard%20screenshot3.png)

## Customer Management

![Customer Management](./screenshots/customer%20management%20screenshot.png)
![Customer Management](./screenshots/customer%20management%20screenshot2.png)

## Customer Details

![Customer Details](./screenshots/customer%20details%20screenshot.png)

## Transaction Management

![Transaction Management](./screenshots/transaction%20list%20screenshot.png)

## Transaction Creation

![Transaction Creation](./screenshots/transaction%20creation%20screenshot.png)

## AML Alerts

![AML Alerts](./screenshots/AML%20alerts%20screenshot.png)

## Alert Details

![Alert Details](./screenshots/alert%20details%20screenshot1.png)
![Alert Details](./screenshots/alert%20details%20screenshot2.png)

## Investigation Details

![Investigation Details](./screenshots/investigation%20screenshot.png)

## Audit Logs

![Audit Logs](./screenshots/audit%20logs%20screenshot.png)

## AML Rules

![AML Rules](./screenshots/AML%20rules%20screenshot.png)

## Future Improvements

- Advanced transaction monitoring rules
- Configurable AML rule thresholds
- Transaction pattern analysis across multiple accounts
- Customer transaction network analysis
- CSV transaction import and bulk processing
- Exportable investigation reports
- PDF audit report generation
- Email notifications for critical alerts
- Advanced investigation assignment and collaboration
- Two-factor authentication
- More comprehensive automated integration testing

## Learning Outcomes

This project demonstrates practical experience with:

- Full-stack application development
- Banking and FinTech workflows
- AML transaction monitoring concepts
- Rule-based detection systems
- Risk scoring and classification
- Authentication and role-based authorization
- Next.js App Router and Server Actions
- Prisma ORM
- PostgreSQL database design
- Supabase integration
- Transaction processing and account balance management
- Investigation workflows
- Audit logging
- Vitest and automated testing
- Financial data management

## License

This project was created for educational and portfolio purposes. It simulates AML monitoring workflows and is not intended to replace a production AML compliance system or provide regulatory compliance advice.
