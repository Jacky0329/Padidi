
PADIDI is a fashion e-commerce platform structured as a **monorepo** with a clear separation between two frontends and a shared backend API. The overall system follows a **Layered Architecture** pattern, where each tier has a well-defined responsibility and communicates only with the tier directly below it.

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                    │
│  ┌──────────────────────┐   ┌───────────────────────┐  │
│  │   Back-Office Portal │   │    User/Shop Portal   │  │
│  │   (React + Vite)     │   │   (React + Vite)      │  │
│  └──────────┬───────────┘   └──────────┬────────────┘  │
│             │                          │                │
│             └─────────┬────────────────┘                │
│                       │  @padidi/shared (API + Types)   │
└───────────────────────┼─────────────────────────────────┘
                        │ HTTP (REST / JSON)
┌───────────────────────▼─────────────────────────────────┐
│                    API LAYER (Controllers)               │
│             ASP.NET Core 8 Minimal Host                  │
├─────────────────────────────────────────────────────────┤
│              SERVICE LAYER (Business Logic)             │
│  Interfaces in Services/Interfaces/ + Implementations  │
├─────────────────────────────────────────────────────────┤
│              DATA LAYER (EF Core + PostgreSQL)          │
│   AdminDbContext (admin + ads)   ClientDbContext        │
│   (products, categories, orders, buyers)               │
└─────────────────────────────────────────────────────────┘
```
