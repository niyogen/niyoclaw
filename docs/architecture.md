# OpenClaw Tool — Final Production Architecture

## Overview

A WhatsApp-accessible AI agent service built on OpenClaw + NemoClaw Plugin SDK,
with inference routed to NVIDIA Cloud (no local GPU required).

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Mobile)                            │
│                   WhatsApp / Telegram App                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ send message
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              Meta WhatsApp Business API                         │
│              (or Telegram Bot API)                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │ POST webhook
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VPS / EC2 Server                             │
│                  (Ubuntu 22.04, $5-10/mo)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  OpenClaw (core agent)                   │   │
│  │   - Session & conversation memory                        │   │
│  │   - Channel routing (WhatsApp / Telegram / TUI)          │   │
│  │   - Plugin host                                          │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │         Your Plugin (OpenClaw Plugin SDK)        │    │   │
│  │  │   - Custom slash commands                        │    │   │
│  │  │   - Business logic & automation                  │    │   │
│  │  │   - Token usage tracking (per user)              │    │   │
│  │  │   - User balance enforcement                     │    │   │
│  │  │   - (Optional) RAG context injection             │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  ┌──────────────────┐   ┌─────────────────────────┐    │   │
│  │  │  NemoClaw Plugin │   │  Telegram Bridge Service │    │   │
│  │  │  (sandbox/ops)   │   │  (scripts/telegram-      │    │   │
│  │  │                  │   │   bridge.js)              │    │   │
│  │  └──────────────────┘   └─────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Cloudflare Tunnel (cloudflared)              │   │
│  │         Public HTTPS URL → webhook endpoint               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Your Database (PostgreSQL / SQLite)          │   │
│  │   - User accounts & balances                             │   │
│  │   - Token usage logs                                     │   │
│  │   - (Optional) Vector store for RAG                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────────┘
                            │ inference API call
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│               NVIDIA Cloud (integrate.api.nvidia.com)           │
│               Model: nvidia/nemotron-3-super-120b-a12b          │
│               Billing: per token (your NVIDIA_API_KEY)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components

| Component | Technology | Role |
|---|---|---|
| **Messaging Layer** | WhatsApp Business API / Telegram Bot API | User-facing interface on mobile |
| **Core Agent** | OpenClaw | Session memory, channel routing, plugin host |
| **Your Plugin** | OpenClaw Plugin SDK (TypeScript) | Business logic, token metering, commands |
| **Secure Runtime** | NemoClaw + OpenShell | Sandboxed environment, policy enforcement |
| **Public Tunnel** | Cloudflare Tunnel (cloudflared) | Exposes webhook URL to external services |
| **Inference** | NVIDIA Cloud API (Nemotron) | LLM responses, pay-per-token |
| **Database** | PostgreSQL or SQLite | Users, billing, token logs, optional RAG |
| **Server** | Any Ubuntu 22.04 VPS ($5-10/mo) | Hosts everything above |

---

## Data Flow — Incoming Message

```
1. User sends WhatsApp message
2. WhatsApp API POSTs to your Cloudflare Tunnel URL
3. OpenClaw receives the message via its WhatsApp channel
4. OpenClaw calls your plugin's command handler
5. Plugin:
   a. Checks user balance in DB → block if zero
   b. (Optional) Fetches RAG context from vector DB
   c. Injects context into prompt
6. OpenClaw sends prompt to NVIDIA Cloud API
7. Nemotron model generates response
8. Token count recorded in DB, balance deducted
9. OpenClaw replies back through WhatsApp
## Multi-Tenant Plugin Architecture (DealMate vs TourGuardian)

Because this single B2B SaaS platform is powering two distinct products, the custom OpenClaw Plugin will act as a **Router** and **Context Manager**.

When a user sends a message on WhatsApp, they are messaging a specific WhatsApp Business Phone Number belonging to either DealMate or TourGuardian.

```
WhatsApp User A ────▶ [DealMate Phone Number] ───┐
                                                 │
WhatsApp User B ────▶ [TourGuardian Phone #] ────┼──▶ Cloudflare Tunnel ──▶ OpenClaw API
```

### The Plugin Routing Logic

1. **Receive the Webhook:** The plugin receives the JSON from Meta containing both `From` (the user) and `To` (the business phone number).
2. **Identify the Tenant:** The plugin looks up the `To` phone number in the Database to find the corresponding Tenant (DealMate or TourGuardian).
3. **Inject the Persona:** 
    - If **DealMate**: The plugin injects the DealMate System Prompt (*"You are DealMate, a helpful grocery comparison assistant..."*) and gives the AI access to the `SearchGroceryDeals` API tool.
    - If **TourGuardian**: The plugin injects the TourGuardian System Prompt (*"You are TourGuardian, a knowledgeable tour companion..."*) and gives the AI access to the `GetItinerary` API tool.
4. **Isolate the Memory:** OpenClaw maintains conversation memory isolated to the specific user's phone number + tenant ID.
5. **Generate Response:** The NVIDIA API (Nemotron) answers perfectly in-character, and the plugin routes the response back out via the correct WhatsApp Phone Number.

---

## Monetization Layer (You Build This)

```
User pays you (Stripe subscription or top-up)
    → Credits added to their balance in your DB
    → Plugin deducts tokens per message
    → Plugin blocks requests when balance is zero
    → You pay NVIDIA per token (your cost)
```

| You charge users | You pay NVIDIA |
|---|---|
| Flat subscription or per-message credits | ~$0.002 per 1K tokens (Nemotron) |

---

## Optional: RAG Pipeline

Only add this if your tool needs to answer from a specific document corpus:

```
Your Documents
    → Chunk + Embed (LangChain / LlamaIndex)
    → Vector DB (pgvector / Pinecone)
    → Plugin fetches top-K relevant chunks
    → Injected into prompt before NVIDIA API call
```

---

## Infrastructure Cost Estimate

| Item | Monthly Cost |
|---|---|
| VPS (DigitalOcean / Hetzner) | $4-6 |
| Cloudflare Tunnel | Free |
| WhatsApp Business API | Free (up to 1000 conversations/month) |
| NVIDIA Cloud API | Pay per token (~$2-5 for dev usage) |
| Database (self-hosted on same VPS) | $0 |
| **Total (dev/early stage)** | **~$10-15/month** |

---

## Setup Order

1. Provision Ubuntu VPS
2. Install NemoClaw (`curl -fsSL https://nvidia.com/nemoclaw.sh | bash`)
3. Run `nemoclaw onboard` (configure NVIDIA API key + sandbox)
4. Set up Cloudflare Tunnel → get public HTTPS URL
5. Register WhatsApp Business API → point webhook to tunnel URL
6. Scaffold your plugin from the NemoClaw plugin structure
7. Deploy plugin into OpenClaw
8. Add your database + billing logic to the plugin

---

## Plugin Local Codebase Structure (The "Super Fast Search" Standard)

To strictly enforce the AI-Driven Development rules (No Magic Folders, Domain-Based Isolation), the plugin will be physically structured perfectly flat, explicitly named, and segmented by business intent.

```text
/openclaw-multi-tenant-plugin
├── CODE_MAP.md                  # Living index of ALL files and their 1-sentence purpose
├── package.json                 # Core dependencies (express, pg, stripe)
├── tsconfig.json

# --- FOUNDATION & ENTRY ---
├── src/entrypoint/
│   └── whatsapp-webhook.ts      # Receives Meta payload, extracts Phone # and User ID
├── src/router/
│   └── tenant-routing-engine.ts # Checks number, decides if DealMate or TourGuardian
├── src/shared-kernel/
│   └── pure-formatters.ts       # Pure, stateless utility functions only (no business logic)

# --- THE TENANTS (100% Isolated Logic) ---
├── src/tenants/dealmate/
│   ├── dealmate-persona.ts      # The specific system prompt for the grocery assistant
│   └── dealmate-tools.ts        # The functions the AI can call (e.g. searchGroceryPrices)
├── src/tenants/tourguardian/
│   ├── tour-persona.ts          # The specific system prompt for the tour assistant
│   └── tour-tools.ts            # The functions the AI can call (e.g. fetchItinerary)

# --- BILLING & MONEY ---
├── src/billing/
│   ├── stripe-webhook.ts        # Listens for Stripe payments and tops up DB balance
│   └── token-deductor.ts        # Intercepts agent responses, deducts token cost from DB

# --- DATA LAYER ---
├── src/database/
│   ├── postgres-client.ts       # Raw DB connection / generic client
│   ├── queries-tenant-lookup.ts # Check which Tenant owns which WhatsApp number
│   └── queries-balances.ts      # Checks user DB balance before responding
```

### Architectural Principles of this Structure
- **No generic `utils/` or `helpers/`:** There is no generic dumping ground. Functions live in the domain they serve. If a price formatter is strictly specific to DealMate, it lives in `/tenants/dealmate/`. If it is a universal, stateless pure function, it belongs in `/shared-kernel/`.
- **Absolute Domain Isolation:** A bug in `src/tenants/tourguardian` physically cannot crash the `dealmate` tenant because the files never import each other. The `/router/` orchestrates them.
- **Instant Human Review:** A human developer reading just the file tree instantly understands how money is handled (`billing/`), where the bots live (`tenants/`), and how traffic enters (`entrypoint/`).
