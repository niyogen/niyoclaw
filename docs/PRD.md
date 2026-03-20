# Product Requirements Document (PRD)
**Project:** AI Agent Platform for Retailers & Businesses (WhatsApp-first)
**Status:** Draft
**Date:** 2026-03-17

---

## 1. Problem Statement

Retailers and businesses need a cost-effective, always-on AI agent on WhatsApp that allows their customers to **chat, book, and pay** — without building a custom app or integration from scratch.

This platform is offered as a B2B SaaS service: businesses subscribe to an AI agent instance, and their end customers interact via WhatsApp.

---

## 2. Goals

- Deploy a **B2B SaaS platform** for retailers and companies to have their own AI agent on WhatsApp
- Support **chat, booking, and payment** workflows out-of-the-box
- Launch on **WhatsApp first** (Telegram and others later)
- Charge businesses based on **token consumption**
- Keep infrastructure cost low (~$10-15/month to start)

---

## 3. Non-Goals

- Building a native iOS/Android app
- Running local AI inference (GPU hardware)
- RAG at launch (deferred to a future phase using AWS services e.g. Bedrock Knowledge Base)
- Replacing WhatsApp/Telegram as a communication platform

---

## 4. Target Users

| User Type | Description |
|---|---|
| **Business Clients** | Retailers, hospitality, services companies — subscribe to the platform |
| **End Customers** | Their customers who chat, book, and pay via WhatsApp |
| **Operators** | You — managing the platform, billing, and plugin deployments |

---

## 5. Core Features

### 5.1 Messaging Interface
- Accept user messages via **WhatsApp Business API** and **Telegram Bot API**
- Respond within a natural conversational flow
- Maintain **session memory** within a conversation

### 5.2 AI Agent (OpenClaw)
- Powered by **NVIDIA Nemotron** models via NVIDIA Cloud API
- Context window: 131,072 tokens
- Always-on agent running on a VPS server

### 5.3 Custom Plugin (OpenClaw Plugin SDK)
- Register custom **slash commands** (e.g. `/help`, `/status`, `/book`, `/pay`)
- Handle incoming messages with custom business logic
- Pluggable **booking integration layer** — supports both REST APIs (Calendly, custom endpoints) and **MCP (Model Context Protocol)** connections
- **Stripe** payment integration for in-chat payment flows

### 5.4 Token Metering & Monetization
- Track token usage per business client in a database
- Deduct balance on each request
- Block requests when balance is zero
- Business clients top-up / subscribe via **Stripe**

### 5.5 Self-Serve Business Onboarding
- Business clients sign up and configure their agent via a **self-serve portal**
- Connect their WhatsApp number
- Configure integrations (booking APIs, MCP endpoints)
- Manage token balance and billing through Stripe

### 5.5 Security & Sandboxing (NemoClaw)
- Run OpenClaw inside an OpenShell sandbox
- Network egress policy enforcement
- Filesystem isolation (`/sandbox` and `/tmp` only)

---

## 6. Optional / Future Features

- [ ] RAG pipeline (vector DB + document Q&A)
- [ ] Admin dashboard for usage analytics
- [ ] Multi-tenant support (multiple agents for different customers)
- [ ] Support for additional messaging channels (SMS, Slack)
- [ ] Local inference via NIM/vLLM for cost reduction at scale

---

## 7. Technical Stack

| Layer | Technology |
|---|---|
| Messaging | WhatsApp Business API, Telegram Bot API |
| Agent Runtime | OpenClaw |
| Plugin | OpenClaw Plugin SDK (TypeScript) |
| Sandboxing | NemoClaw + NVIDIA OpenShell |
| Inference | NVIDIA Cloud API (`nemotron-3-super-120b-a12b`) |
| Public URL | Cloudflare Tunnel |
| Database | PostgreSQL or SQLite |
| Hosting | Ubuntu 22.04 VPS ($5-10/month) |

---

## 8. Architecture

See [architecture.md](./architecture.md) for the full system diagram.

---

## 9. Monetization Model

**Token-based billing** — businesses are charged for the tokens their customers consume.

| Tier | Token Allowance | Price (example) |
|---|---|---|
| Starter | 1M tokens/month | $29/mo |
| Growth | 5M tokens/month | $99/mo |
| Enterprise | Custom | Custom |

> _Cost to serve: ~$0.002 per 1K tokens (NVIDIA Cloud API)_
> _Your margin: price tokens above your NVIDIA cost_

---

## 10. Infrastructure Cost Estimate

| Item | Monthly |
|---|---|
| VPS (Hetzner / DigitalOcean) | $4-6 |
| Cloudflare Tunnel | Free |
| WhatsApp Business API | Free (≤1,000 conversations/mo) |
| NVIDIA Cloud API (dev usage) | ~$2-5 |
| **Total** | **~$10-15** |

---

## 11. Setup Milestones

### Phase 1 — Foundation ✅ Partially Done

| # | Step | Status | Notes |
|---|---|---|---|
| 1.1 | Clone NemoClaw repo | ✅ Done | `/openclaw` folder |
| 1.2 | Define architecture & PRD | ✅ Done | `/docs` folder |
| 1.3 | Register Meta WhatsApp Business Account | ✅ Done | Already completed |
| 1.4 | Get NVIDIA Cloud API key (`nvapi-...`) | ✅ Done | [build.nvidia.com](https://build.nvidia.com) |
| 1.5 | Create Stripe account + get API keys | ⬜ Pending | For billing |

---

### Phase 2 — Infrastructure

| # | Step | Status | Notes |
|---|---|---|---|
| 2.1 | Provision Ubuntu 22.04 VPS ($5-10/mo) | ✅ Done | EC2 (t3.small) |
| 2.2 | Point a domain/subdomain to the VPS | ⬜ Pending | e.g. `api.yourdomain.com` |
| 2.3 | Install Docker + Node.js 22 on VPS | ✅ Done | Installed via script |
| 2.4 | Install OpenClaw + NemoClaw (`install.sh`) | ✅ Done | Installed via npm |
| 2.5 | Run `nemoclaw onboard` (configure API key + sandbox) | ✅ Done | Verified with setup-spark |
| 2.6 | Install & configure Cloudflare Tunnel | ✅ Done | `intl-mood-surge-hamburg.trycloudflare.com` |
| 2.7 | Set up PostgreSQL database on VPS | ⬜ Pending | For multi-tenant data, token logs, billing |

---

### Phase 3 — WhatsApp Integration

| # | Step | Status | Notes |
|---|---|---|---|
| 3.1 | Create WhatsApp App in Meta Developer Portal | ✅ Done | Already have Business Account ✅ |
| 3.2 | Get WhatsApp Phone Number ID + Access Token | ✅ Done | From Meta App Dashboard |
| 3.3 | Register webhook URL with Meta | ✅ Done | Points to Cloudflare Tunnel URL |
| 3.4 | Set webhook verify token + handle verification | ✅ Done | Verified! Pending Tech Provider review (5 days) |
| 3.5 | Test sending/receiving a message end-to-end | ⬜ Pending | Confirm OpenClaw responds via WhatsApp |

---

### Phase 4 — Core Plugin Development

| # | Step | Status | Notes |
|---|---|---|---|
| 4.1 | Scaffold plugin from NemoClaw structure | ⬜ Pending | Copy `nemoclaw/src/` as template |
| 4.2 | Implement multi-tenant routing | ⬜ Pending | Route WhatsApp messages by business client ID |
| 4.3 | Implement token metering middleware | ⬜ Pending | Count tokens, check balance, deduct, block if zero |
| 4.4 | Build pluggable booking integration layer | ⬜ Pending | REST API adapter + MCP connector |
| 4.5 | Build Stripe in-chat payment flow | ⬜ Pending | Generate payment link, confirm payment, update DB |
| 4.6 | Register plugin with OpenClaw | ⬜ Pending | Via `openclaw.plugin.json` |

---

### Phase 5 — Self-Serve Onboarding Portal

| # | Step | Status | Notes |
|---|---|---|---|
| 5.1 | Build sign-up / login (email + password) | ⬜ Pending | For business clients |
| 5.2 | Business config screen | ⬜ Pending | Agent name, welcome message, integrations |
| 5.3 | Token balance & billing dashboard | ⬜ Pending | Stripe subscription + usage display |
| 5.4 | Webhook / API key management | ⬜ Pending | For clients connecting booking APIs |
| 5.5 | WhatsApp number connect flow (Standard tier) | ⬜ Pending | Assign client routing ID on shared number |

---

### Phase 6 — Testing & Launch

| # | Step | Status | Notes |
|---|---|---|---|
| 6.1 | Unit tests for token metering plugin | ⬜ Pending | |
| 6.2 | End-to-end test: WhatsApp → booking → payment | ⬜ Pending | |
| 6.3 | Load test (simulate multiple clients) | ⬜ Pending | |
| 6.4 | Security review (NemoClaw sandbox policies) | ⬜ Pending | |
| 6.5 | Onboard 2-3 pilot business clients (beta) | ⬜ Pending | |
| 6.6 | Monitor token usage + costs for 2 weeks | ⬜ Pending | |
| 6.7 | Public launch | ⬜ Pending | |

---

## 12. Open Questions

- [x] Booking: Pluggable — REST APIs + MCP integrations
- [x] Payments: Stripe
- [x] Onboarding: Self-serve portal
- [x] **WhatsApp number model:**

| Tier | Number Model | Details |
|---|---|---|
| **Standard (default)** | Shared platform number | Agent routes by business client ID. Simple to onboard, no Meta approval needed per client. |
| **Premium (paid upgrade)** | Dedicated per-client number | Client registers their own WhatsApp Business number and connects to the platform. Full brand identity. |

> Most B2B WhatsApp SaaS platforms (Wati, Interakt) use this exact model.
