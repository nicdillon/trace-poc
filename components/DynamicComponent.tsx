import { cookies } from 'next/headers';
import { component, withSpan } from '@/lib/tracing';

async function fetchDynamicData() {
  return component.fetch('dynamic.component', async () => {
    // Force dynamic rendering by accessing cookies
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value || 'anonymous';

    // Simulate fetching user-specific data
    const userData = await component.load(
      'dynamic.user.data',
      () => ({
        sessionId,
        userId: Math.floor(Math.random() * 1000),
        preferences: {
          notifications: true,
          theme: 'auto',
        },
      }),
      {
        'user.session_id': sessionId,
        'data.source': 'session',
        'cache.enabled': false,
      }
    );

    // Simulate real-time data fetch
    const realtimeData = await component.load(
      'dynamic.realtime',
      () => ({
        timestamp: new Date().toISOString(),
        requests: Math.floor(Math.random() * 100),
        activeUsers: Math.floor(Math.random() * 50),
      }),
      {
        'data.type': 'realtime',
        'data.freshness': 'live',
      }
    );

    // Simulate personalization logic
    const personalizedContent = await withSpan(
      'dynamic.personalize.content',
      () => ({
        greeting: `Hello, User ${userData.userId}!`,
        recommendations: [
          'Enable real-time tracing',
          'Configure custom spans',
          'Monitor performance metrics',
        ],
      }),
      {
        'personalization.user_id': userData.userId.toString(),
        'personalization.type': 'content',
      }
    );

    return {
      userData,
      realtimeData,
      personalizedContent,
    };
  });
}

export async function DynamicComponent() {
  const data = await fetchDynamicData();

  return (
    <div className="border border-green-500 rounded-lg p-6 bg-green-50 dark:bg-green-950">
      <h2 className="text-2xl font-bold mb-4 text-green-900 dark:text-green-100">
        Dynamic Content Section
      </h2>
      <p className="mb-4 text-green-800 dark:text-green-200">
        This component is rendered dynamically on each request with custom tracing spans.
      </p>

      <div className="space-y-4">
        <div className="p-3 bg-green-100 dark:bg-green-900 rounded">
          <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">User Data:</h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>Session:</strong> {data.userData.sessionId}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>User ID:</strong> {data.userData.userId}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>Preferences:</strong> Notifications: {data.userData.preferences.notifications ? 'On' : 'Off'},
            Theme: {data.userData.preferences.theme}
          </p>
        </div>

        <div className="p-3 bg-green-100 dark:bg-green-900 rounded">
          <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">Real-time Stats:</h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>Timestamp:</strong> {data.realtimeData.timestamp}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>Active Requests:</strong> {data.realtimeData.requests}
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>Active Users:</strong> {data.realtimeData.activeUsers}
          </p>
        </div>

        <div className="p-3 bg-green-100 dark:bg-green-900 rounded">
          <h3 className="font-semibold mb-2 text-green-900 dark:text-green-100">
            {data.personalizedContent.greeting}
          </h3>
          <p className="text-sm font-semibold mb-1 text-green-800 dark:text-green-200">Recommendations:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-700 dark:text-green-300">
            {data.personalizedContent.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
