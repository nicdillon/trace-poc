import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('trace-poc');

// Core tracing function
export function withSpan<T>(
  name: string,
  fn: () => T | Promise<T>,
  attributes?: Record<string, string | number | boolean>
): T | Promise<T> {
  return tracer.startActiveSpan(name, (span) => {
    if (attributes) {
      span.setAttributes(attributes);
    }

    try {
      const result = fn();

      if (result instanceof Promise) {
        return result
          .then((value) => {
            span.setStatus({ code: SpanStatusCode.OK });
            span.end();
            return value;
          })
          .catch((error) => {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: error.message,
            });
            span.recordException(error);
            span.end();
            throw error;
          });
      }

      span.setStatus({ code: SpanStatusCode.OK });
      span.end();
      return result;
    } catch (error: any) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      span.recordException(error);
      span.end();
      throw error;
    }
  });
}

// Auto-trace with function name inference
export function autoTrace<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    prefix?: string;
    attributes?: Record<string, string | number | boolean>;
  }
): T {
  return ((...args: any[]) => {
    const spanName = options?.prefix
      ? `${options.prefix}.${fn.name || 'anonymous'}`
      : fn.name || 'anonymous';

    return withSpan(spanName, () => fn(...args), options?.attributes);
  }) as T;
}

// Semantic helpers for common operations
export const db = {
  query: <T>(operation: () => T | Promise<T>, statement?: string) =>
    withSpan(
      'db.query',
      operation,
      statement
        ? {
            'db.system': 'postgresql',
            'db.statement': statement,
          }
        : { 'db.system': 'postgresql' }
    ),
};

export const api = {
  call: <T>(operation: () => T | Promise<T>, url: string, method = 'GET') =>
    withSpan('external.api.call', operation, {
      'http.method': method,
      'http.url': url,
      'net.peer.name': new URL(url).hostname,
    }),
};

export const component = {
  load: <T>(
    name: string,
    operation: () => T | Promise<T>,
    attributes?: Record<string, string | number | boolean>
  ) => withSpan(`${name}.load`, operation, attributes),

  fetch: <T>(
    name: string,
    operation: () => T | Promise<T>,
    attributes?: Record<string, string | number | boolean>
  ) => withSpan(`${name}.fetch`, operation, attributes),

  process: <T>(
    operation: () => T | Promise<T>,
    type?: string,
    recordCount?: number
  ) =>
    withSpan('data.processing', operation, {
      ...(type && { 'processing.type': type }),
      ...(recordCount !== undefined && { 'processing.record_count': recordCount }),
    }),
};
