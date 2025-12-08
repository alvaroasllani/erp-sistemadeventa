# Nexus ERP

Sistema de gestión empresarial moderno para retail (Ferreterías, Farmacias, Tiendas).

## 🏗️ Estructura del Proyecto

```
nexus-erp/
├── apps/
│   ├── web/              # Frontend (Next.js 16)
│   └── api/              # Backend (NestJS)
├── packages/
│   ├── database/         # Prisma Schema
│   └── types/            # Tipos compartidos
└── pnpm-workspace.yaml
```

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- pnpm 8+
- PostgreSQL

### Instalación

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp env.example .env
# Edita .env con tu DATABASE_URL

# 3. Generar cliente Prisma y migrar BD
pnpm db:generate
pnpm db:migrate

# 4. Sembrar datos iniciales
pnpm db:seed
```

### Desarrollo

```bash
# Frontend (localhost:3000)
pnpm dev

# Backend (localhost:4000)
pnpm dev:api

# Ambos a la vez
pnpm dev:all
```

## 📚 Documentación API

Swagger disponible en: `http://localhost:4000/docs`

## 🔐 Credenciales Demo

- **Email:** admin@nexus.com
- **Password:** admin123

## 📦 Tech Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 16, Tailwind, Shadcn/ui, Zustand |
| Backend | NestJS 10, Passport JWT |
| Database | PostgreSQL, Prisma ORM |
| Monorepo | pnpm workspaces |
