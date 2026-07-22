type RuntimeImport = (specifier: string) => Promise<Record<string, any>>;

const importRuntime = (specifier: string) => eval(`import('${specifier}')`) as Promise<Record<string, any>>;

export async function getCmsPayload() {
  const [{ default: config }, { getPayload }] = await Promise.all([importRuntime("@payload-config"), importRuntime("payload")]);
  return getPayload({ config });
}
