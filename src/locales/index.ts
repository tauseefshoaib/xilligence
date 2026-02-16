import en from './en.json';

type Messages = typeof en;

type Primitive = string | number | boolean | null | undefined;

const messages: Messages = en;

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function t(key: string, params?: Record<string, Primitive>): string {
  const value = getNestedValue(messages as unknown as Record<string, unknown>, key);
  if (typeof value !== 'string') return key;

  if (!params) return value;

  return Object.entries(params).reduce((text, [paramKey, paramValue]) => {
    return text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue ?? ''));
  }, value);
}
