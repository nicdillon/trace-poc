import { component } from '@/lib/tracing';

async function fetchStaticData() {
  return component.fetch('static.component', async () => {
    // Simulate fetching configuration data
    const config = await component.load(
      'static.config',
      () => ({
        theme: 'light',
        version: '1.0.0',
        features: ['tracing', 'analytics', 'caching'],
      }),
      {
        'data.source': 'config',
        'cache.hit': false,
      }
    );

    // Simulate loading static content
    const content = await component.load(
      'static.content',
      () => ({
        title: 'Static Content Section',
        description:
          'This component is rendered statically at build time with custom tracing spans.',
        items: [
          'Traced configuration loading',
          'Traced content rendering',
          'Traced data transformation',
        ],
      }),
      {
        'content.type': 'static',
        'content.locale': 'en',
      }
    );

    // Simulate data transformation
    return component.process(
      () => ({
        ...content,
        config,
        renderedAt: new Date().toISOString(),
      }),
      'merge',
      2
    );
  });
}

export async function StaticComponent() {
  const data = await fetchStaticData();

  return (
    <div className="border border-blue-500 rounded-lg p-6 bg-blue-50 dark:bg-blue-950">
      <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">
        {data.title}
      </h2>
      <p className="mb-4 text-blue-800 dark:text-blue-200">{data.description}</p>
      <div className="space-y-2">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Traced Operations:</h3>
        <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
          {data.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900 rounded">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Config:</strong> Theme: {data.config.theme}, Version: {data.config.version}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Features:</strong> {data.config.features.join(', ')}
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Rendered At:</strong> {data.renderedAt}
        </p>
      </div>
    </div>
  );
}
