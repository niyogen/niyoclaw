# CODE_MAP.md

*This is a living index of all files in the `openclaw-multi-tenant-plugin` repository. This map must be updated immediately whenever a file is added, moved, or deleted to maintain structural predictability.*

## Core Configuration
- `package.json`: Manages project dependencies (installed: `typescript`, `@types/node`).
- `tsconfig.json`: TypeScript compiler configuration ensuring strict types for the project.

## Domain Architecture
- `/src/entrypoint/`: Handles receiving webhooks directly from external APIs (like Meta).
- `/src/router/`: Inspects context (like phone number) and orchestrates dispatch to the correct tenant.
- `/src/shared-kernel/`: Exclusive home for pure, stateless formatting and utility functions to prevent code duplication. No business logic permitted here.
- `/src/tenants/dealmate/`: Strictly isolated business logic, persona, and API tools exclusively for DealMate.
- `/src/tenants/tourguardian/`: Strictly isolated business logic, persona, and API tools exclusively for TourGuardian.
- `/src/billing/`: Stripe hooks, token metering, and balance deduction logic to handle monetization.
- `/src/database/`: PostgreSQL client, table schema migrations, and tenant-lookup query functions.
