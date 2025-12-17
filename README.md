# Vercel Session Traces POC

A proof-of-concept Next.js application demonstrating Vercel's session tracing capabilities with custom OpenTelemetry spans across different rendering scenarios.

## Features

This POC showcases tracing in:

- **API Routes** - External API calls with custom spans for database queries, external API calls, and data processing
- **Static Components** - Server-side static rendering with configuration loading and content transformation
- **Dynamic Components** - Dynamic rendering with user-specific data and personalization logic
- **Page-level Tracing** - HTTP request tracing and data fetching at the page level

## Architecture

### Tracing Implementation

The project uses `@vercel/otel` and `@opentelemetry/api` to implement distributed tracing:

- **instrumentation.ts** - Initializes the OpenTelemetry SDK for the Node.js runtime
- **lib/tracing.ts** - Provides a `withSpan()` helper function for creating custom spans with automatic error handling
- Custom attributes on spans for enhanced observability

### Components

1. **API Route** (`app/api/data/route.ts`)
   - Simulates database queries with custom spans
   - Simulates external API calls
   - Demonstrates data processing traces
   - Includes semantic attributes following OpenTelemetry conventions

2. **StaticComponent** (`components/StaticComponent.tsx`)
   - Server-side rendered component
   - Traces configuration loading
   - Traces content fetching and transformation
   - Demonstrates static rendering with custom spans

3. **DynamicComponent** (`components/DynamicComponent.tsx`)
   - Dynamically rendered on each request
   - Traces user data fetching
   - Traces real-time data loading
   - Traces personalization logic
   - Uses `cookies()` to force dynamic rendering

4. **Home Page** (`app/page.tsx`)
   - Integrates all components
   - Demonstrates page-level API tracing
   - Shows how traces compose across different parts of the application

## Custom Spans

Each component creates multiple custom spans with descriptive names and attributes:

- `api.data.handler` - Main API route handler
- `database.query` - Simulated database operations
- `external.api.call` - Simulated external API calls
- `static.component.fetch` - Static component data loading
- `dynamic.component.fetch` - Dynamic component data loading
- `page.fetch.api` - Page-level API calls

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Building for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket
2. Import the project in Vercel
3. Deploy the application
4. Enable observability in your Vercel project settings
5. Navigate to the Observability tab to view traces

## Viewing Traces

When deployed on Vercel with observability enabled, you'll see:

- Complete trace waterfall for each request
- Custom spans with descriptive names
- Span attributes showing operation details
- Parent-child relationships between spans
- Performance metrics for each operation

## Key Files

- `instrumentation.ts` - OpenTelemetry initialization
- `lib/tracing.ts` - Tracing utility functions
- `app/api/data/route.ts` - API route with tracing
- `components/StaticComponent.tsx` - Static component with custom spans
- `components/DynamicComponent.tsx` - Dynamic component with custom spans
- `app/page.tsx` - Main page integrating all traced components
- `next.config.ts` - Next.js config with instrumentation hook enabled

## Technologies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- @vercel/otel
- @opentelemetry/api

## License

MIT
