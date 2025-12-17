import { StaticComponent } from '@/components/StaticComponent';
import { DynamicComponent } from '@/components/DynamicComponent';
import { withSpan, sleep } from '@/lib/tracing';

async function fetchApiData() {
  return withSpan('page.fetch.api', async () => {
    // Simulate API call to our endpoint
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const response = await withSpan(
      'page.http.request',
      async () => {
        // In production, this would be a real fetch
        // For this demo, we'll simulate it
        await sleep(100);
        return {
          ok: true,
          json: async () => ({
            users: [
              { id: 1, name: 'Alice' },
              { id: 2, name: 'Bob' },
              { id: 3, name: 'Charlie' },
            ],
            metadata: {
              status: 'success',
              timestamp: new Date().toISOString(),
            },
            processedAt: new Date().toISOString(),
          }),
        };
      },
      {
        'http.method': 'GET',
        'http.url': `${baseUrl}/api/data`,
        'http.target': '/api/data',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return response.json();
  });
}

export default async function Home() {
  const apiData = await fetchApiData();

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Vercel Trace POC
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This page demonstrates Vercel session tracing with custom spans in different scenarios:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
            <li><strong>API Route:</strong> External API calls with database and processing spans</li>
            <li><strong>Static Component:</strong> Server-side static rendering with configuration loading</li>
            <li><strong>Dynamic Component:</strong> Dynamic rendering with user-specific data</li>
            <li><strong>Page-level Tracing:</strong> HTTP request tracing at the page level</li>
          </ul>

          <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
              API Response Data:
            </h3>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>Users:</strong> {apiData.users.map((u: any) => u.name).join(', ')}
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>Status:</strong> {apiData.metadata.status}
            </p>
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>Processed:</strong> {apiData.processedAt}
            </p>
          </div>
        </div>

        <StaticComponent />
        <DynamicComponent />

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            How to View Traces
          </h2>
          <div className="space-y-2 text-gray-700 dark:text-gray-300">
            <p>
              <strong>1. Deploy to Vercel:</strong> Push this project to a Git repository and deploy
              it on Vercel.
            </p>
            <p>
              <strong>2. Enable Observability:</strong> In your Vercel dashboard, go to your project
              settings and enable observability features.
            </p>
            <p>
              <strong>3. View Traces:</strong> Navigate to the Observability tab to see detailed
              traces with all custom spans for API calls, component rendering, and data fetching.
            </p>
            <p className="mt-4 text-sm italic">
              Each span includes custom attributes like database operations, HTTP requests,
              personalization logic, and more.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
