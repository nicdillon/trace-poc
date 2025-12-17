import { NextResponse } from 'next/server';
import { withSpan, db, api, component } from '@/lib/tracing';

export async function GET() {
  return withSpan('api.data.handler', async () => {
    // Simulate database query with custom span
    const data = await db.query(
      () => ({
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 3, name: 'Charlie' },
        ],
      }),
      'SELECT * FROM users'
    );

    // Simulate external API call with custom span
    const externalData = await api.call(
      () => ({
        status: 'success',
        timestamp: new Date().toISOString(),
      }),
      'https://api.example.com/status'
    );

    // Simulate data processing with custom span
    const processedData = await component.process(
      () => ({
        ...data,
        metadata: externalData,
        processedAt: new Date().toISOString(),
      }),
      'transform',
      data.users.length
    );

    return NextResponse.json(processedData);
  });
}
