# CYTO Technical Documentation

Welcome to the technical documentation for the CYTO platform. This document provides an overview of the system, architecture layers, infrastructure, and technical specifications of the platform.

---

## System Overview

### Core Components

- **Frontend**: Next.js 14 application with App Router.
- **Authentication**: Supabase Auth with email/password and Google OAuth.
- **Database**: Supabase (PostgreSQL) with Row Level Security.
- **State Management**: React Context + Custom Hooks.
- **Internationalization**: i18next with language detection.
- **Bug Detection tool**: Sentry.io

### Technology Stack

- Framework: Next.js 14 (React).
- Styling: Tailwind CSS + shadcn/ui.
- Database: Supabase (PostgreSQL).
- Authentication: Supabase Auth.
- Type Safety: TypeScript.
- Icons: Lucide React.
- Form Handling: React Hook Form + Zod.
- PDF Generation: `@react-pdf/renderer`.

### Key Design Patterns

- Singleton Pattern: Supabase client.
- Provider Pattern: Auth context, Theme provider.
- Container Pattern: Auth container components.
- Repository Pattern: Database access layers.
- Observer Pattern: Real-time subscriptions.

---

## Architecture Layers

### Frontend Architecture

The application uses the Next.js App Router with the following structure:

```plaintext
app/
├── (auth)/         # Auth routes (login, register)
├── (protected)/    # Protected routes
├── dashboard/      # Dashboard features
├── clients/        # Client management
├── invoices/       # Invoice management
├── products/       # Product management
└── settings/       # User settings
```

The frontend leverages modern development practices like component-based architecture, React Context, and custom hooks to manage state efficiently.

### Backend Services
The platform uses Supabase for backend services, including:

* Authentication & Authorization with JWT and OAuth integration.
* Real-time Database with subscriptions for live updates.
* Row Level Security for granular access control and policy-based data access.
* Storage for managing user-uploaded documents.

### Database Structure
The system is built around core tables that support key features:

* clients – stores client data.
* invoice_companies – stores companies related to invoices.
* invoices – contains invoice details.
* invoice_items – line items for each invoice.
* product_lines – product catalog for invoices.

### APIs
APIs are implemented via Supabase Client for:

* Auth API – managing user authentication.
* Database API – querying and managing the database.
* Real-time Subscriptions – enabling live updates.
* Storage API – uploading and retrieving files.

### Infrastructure
#### Deployment Architecture
* Frontend: Hosted on Netlify for static site generation.
* Backend: Deployed on Supabase Cloud.
* Database: Powered by Supabase Postgres with RLS for enhanced security.

### Security Measures
The platform employs robust security mechanisms:

#### Authentication
* JWT-based authentication.
* OAuth integration with providers like Google.

#### Authorization
* Row Level Security (RLS) policies for access control.
* User-scoped data access.

#### Data Protection
* Input validation using Zod.
* Type safety with TypeScript.
* Prepared statements to prevent SQL injection.

### Scalability Considerations
#### Frontend
* Static page generation for improved performance.
* Code splitting and dynamic imports for faster loading.

#### Backend
* Efficient Row Level Security policies.
* Indexed queries to optimize database performance.
* Connection pooling for high concurrency support.

### Technical Specifications
#### Programming Languages
* TypeScript for frontend and backend logic.
* SQL (PostgreSQL) for database queries.
* CSS (Tailwind) for styling.

#### Core Dependencies
Key libraries and tools used in the platform include:

{
  "next": "14.1.0",
  "react": "18.2.0",
  "typescript": "5.3.3",
  "@supabase/auth-helpers-nextjs": "0.9.0",
  "@react-pdf/renderer": "3.1.14",
  "tailwindcss": "3.4.1",
  "i18next": "23.10.0"
}


### Development Tools

* Package Manager: npm
* Build Tool: Next.js built-in
* Type Checking: TypeScript
* Linting: ESLint
* Formatting: Prettier

### Version Control Strategy

The project follows modern version control practices:

* Feature-based branching for parallel development
* Conventional commits for meaningful and consistent commit messages
* Semantic versioning for clear release management
* Environment-based configuration for deployment flexibility

### Conclusion

The CYTO platform architecture is designed to follow modern best practices, with a strong focus on scalability, security, and developer productivity. By leveraging Next.js for the frontend and Supabase for backend services, the system provides a seamless experience for both developers and end users. Its modular design, robust type safety, and real-time capabilities ensure the platform is future-proof and adaptable to evolving business needs.

