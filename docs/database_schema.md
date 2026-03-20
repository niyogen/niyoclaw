# Database Schema & State Design

*Generated for Stage 2 of the Vibe Coding Lifecycle.*

## Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    BUSINESS_CLIENT ||--o{ TENANT_PROFILE : "owns"
    TENANT_PROFILE ||--o{ TOKEN_USAGE_LOG : "generates"
    TENANT_PROFILE ||--|{ WHATSAPP_NUMBER : "binds to"
    TENANT_PROFILE ||--o{ END_USER : "interacts with"
    END_USER ||--o{ TOKEN_USAGE_LOG : "triggers"

    BUSINESS_CLIENT {
        uuid id PK "DEFAULT gen_random_uuid()"
        string email "UNIQUE, NOT NULL"
        string stripe_customer_id "UNIQUE, NULLABLE"
        int available_tokens "NOT NULL, DEFAULT 0"
        int recStatus "NOT NULL, DEFAULT 1 (1=Active, 0=Inactive, -1=Deleted)"
        timestamp created_at "NOT NULL, DEFAULT now()"
        timestamp updated_at "NOT NULL, DEFAULT now()"
    }

    TENANT_PROFILE {
        uuid id PK "DEFAULT gen_random_uuid()"
        uuid business_client_id FK "NOT NULL"
        string tenant_name "NOT NULL"
        string system_prompt "NOT NULL"
        jsonb enabled_tools "NOT NULL, DEFAULT '[]'"
        int recStatus "NOT NULL, DEFAULT 1 (1=Active, 0=Inactive, -1=Deleted)"
        timestamp created_at "NOT NULL, DEFAULT now()"
        timestamp updated_at "NOT NULL, DEFAULT now()"
    }

    WHATSAPP_NUMBER {
        string phone_number_id PK "UNIQUE, NOT NULL"
        uuid tenant_profile_id FK "NOT NULL"
        string encrypted_access_token "NULLABLE (Premium Tier)"
        timestamp created_at "NOT NULL, DEFAULT now()"
        timestamp updated_at "NOT NULL, DEFAULT now()"
    }

    END_USER {
        uuid id PK "DEFAULT gen_random_uuid()"
        uuid tenant_profile_id FK "NOT NULL (Composite UNIQUE)"
        string phone_number "NOT NULL (Composite UNIQUE)"
        string name "NULLABLE"
        timestamp first_interacted_at "NOT NULL, DEFAULT now()"
        timestamp last_interacted_at "NOT NULL, DEFAULT now()"
    }

    TOKEN_USAGE_LOG {
        uuid id PK "DEFAULT gen_random_uuid()"
        uuid tenant_profile_id FK "NOT NULL"
        uuid end_user_id FK "NOT NULL"
        int input_tokens "NOT NULL, DEFAULT 0"
        int output_tokens "NOT NULL, DEFAULT 0"
        int total_cost_deducted "NOT NULL, DEFAULT 0"
        timestamp created_at "NOT NULL, DEFAULT now()"
    }
```

## State & Caching Dependencies

1. **Routing Cache:** The mapping between `WHATSAPP_NUMBER` and `TENANT_PROFILE` changes rarely. To avoid a database hit on every single incoming webhook to determine if it's DealMate or TourGuardian, this mapping should be cached in an in-memory Map (`src/router/tenant-routing-engine.ts`) and refreshed only when a client updates their phone number.
2. **Session Memory:** OpenClaw intrinsically handles AI conversation memory. We will pass a unique, composite string (`${phone_number_id}_${end_user_phone_number}`) as the `sessionId` into the OpenClaw agent instance so that memory is strictly isolated between both different end-users *and* different agent tenants.
