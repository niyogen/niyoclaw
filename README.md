# OpenClaw Multi-Tenant Vibe Coding Plugin

This repository houses the strictly typed, high-performance routing plugin and agent personas for the **OpenClaw** multi-tenant ecosystem. It strictly leverages the 7-Stage "Vibe Coding" lifecycle for perfect human-AI collaboration constraints.

## Features
- Dynamic WhatsApp Meta Webhook parsing (`meta-webhook.interfaces.ts`)
- Strict Multi-Tenant Persona Routing (DealMate vs TourGuardian)
- Fully typed AI tool execution constraints (Zod validators)
- Isolated PostgreSQL billing rules and Stripe Top-Up integrations
- Local Node.js / PM2 runtime configuration for robust EC2 VPS deployments

## Continuous Integration & Deployment
This project natively utilizes GitHub Actions (`.github/workflows/ci-cd.yml`).
Every push to the `main` branch will automatically spin up an Ubuntu runner to compile your TypeScript and execute the strict `tsx` routing test suite. 

If the routing logic successfully passes the tests, the pipeline securely SSHs into your production EC2 box and executes `deploy.sh` to seamlessly upgrade your live PM2 server!

---
*Built with ❤️ by Antigravity under the 7-Stage Vibe Coding Rulebook.*
