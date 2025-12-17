import { NextResponse } from 'next/server';
import { withSpan, sleep } from '@/lib/tracing';

export async function GET() {
  return withSpan('api.data.handler', async () => {
    // Simulate database query with custom span
    const data = await withSpan(
      'database.query',
      async () => {
        await sleep(100); // Simulate DB latency
        return {
          users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' },
          ],
        };
      },
      {
        'db.system': 'postgresql',
        'db.operation': 'SELECT',
        'db.statement': 'SELECT * FROM users',
      }
    );

    // Simulate external API call with custom span
    const externalData = await withSpan(
      'external.api.call',
      async () => {
        await sleep(150); // Simulate network latency
        return {
          status: 'success',
          timestamp: new Date().toISOString(),
        };
      },
      {
        'http.method': 'GET',
        'http.url': 'https://api.example.com/status',
        'net.peer.name': 'api.example.com',
      }
    );

    // Simulate data processing with custom span
    const processedData = await withSpan(
      'data.processing',
      async () => {
        await sleep(50); // Simulate processing time
        return {
          ...data,
          metadata: externalData,
          processedAt: new Date().toISOString(),
        };
      },
      {
        'processing.type': 'transform',
        'processing.record_count': data.users.length,
      }
    );

    return NextResponse.json(processedData);
  });
}
