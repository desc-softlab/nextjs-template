
# 🧩 Next.js Starter Template – Desc Softlab Ltd
<img src="/public/logo/Desc Softlab Logo.png" alt="Desc Softlab Logo" width="150" />

Welcome to the official Next.js starter template from **[Desc Softlab Ltd](https://descsoftlab.com)** – a modern and opinionated boilerplate designed to help developers kickstart robust web applications with minimal setup and maximum flexibility.

## ✨ Features

This template comes pre-configured with production-grade tools and best practices, including:

- ⚡ **Next.js** with App Router
- 🌐 **NextAuth.js** with OAuth (Google & GitHub pre-configured)
- 💾 **Prisma ORM** for seamless database interactions
- 🔐 Authentication middleware ready to go
- 🧠 **Server Actions** built in (`/actions` folder)
- 🧱 Pre-built reusable UI components
- 🎨 Icons via `lucide-react`
- 🧼 ESLint, Prettier, TailwindCSS, TypeScript
- 🛡️ Sensible security and performance defaults

## 🗂️ Project Structure

```
.
├── actions/
│   ├── users/
│   └── logs/
├── components/
├── lib/
├── prisma/
├── public/
├── styles/
├── app/
│   ├── api/
│   └── (routes...)
├── .env
├── next.config.ts
└── ...
```

### 🔄 Server Actions (`/actions`)

The `actions` directory contains server-side functions, categorized by domain. These are useful for handling backend logic in a clean, organized way. A few example use cases:

#### Example: User Action

```ts
// actions/users/createUser.ts

'use server'

import { prisma } from '@/lib/prisma'

export async function createUser(data: { email: string; name: string }) {
  return await prisma.user.create({
    data,
  })
}
```

This can be used directly inside your server components or form actions for seamless database operations.

#### Example: Log Action

```ts
// actions/logs/createLog.ts

'use server'

import { prisma } from '@/lib/prisma'

export async function createLog(message: string) {
  return await prisma.log.create({
    data: { message },
  })
}
```

Perfect for audit trails or analytics.

---

## 🚀 Getting Started

Clone the template and start building right away:

```bash
npx create-next-app -e https://github.com/your-repo/nextjs-template
```

Then follow the comments inside `.env` and `prisma/schema.prisma` to configure your database and auth providers.

> **Note:** The installation process is intentionally excluded from this README as this template is ready for immediate use with minimal adjustments.

---

## 🔧 Technologies Used

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Lucide Icons](https://lucide.dev/)

---

## 🧪 Testing

Basic testing and development practices are encouraged. You may integrate tools such as:

- **Jest** or **Vitest** for unit testing
- **Cypress** for E2E tests
- **Zod** for runtime schema validation

---

## 📦 Deployment

This template is fully compatible with platforms like:

- **Vercel** (recommended)
- **Netlify**
- **Render**
- **Dockerized environments**

---

## 👨‍💻 Maintained by Desc Softlab Ltd

Crafted with care by [Desc Softlab Ltd](https://descsoftlab.com), a software studio focused on building modern, scalable, and reliable web applications.

Have questions or want to contribute? Feel free to fork, submit issues, or reach out through our website.

---

## 📄 License

This project is licensed under the MIT License.
