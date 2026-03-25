
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

NormalUser -  normal user are allowed to check products, check ads, check product details, addtocart, and loginregsiter.
<img width="1152" height="744" alt="image" src="https://github.com/user-attachments/assets/d5cbbf38-631d-49b2-ad30-39dbca0995b0" />
<img width="1081" height="714" alt="image" src="https://github.com/user-attachments/assets/e4b1f71a-ba6d-4309-9ae9-6f0e491844f2" />


BackOffice - backoffice user are able to manage products, categories, ads, order and admin user acc
<img width="1917" height="721" alt="image" src="https://github.com/user-attachments/assets/0959781c-6242-4e08-9bde-97c590bbd6a3" />

