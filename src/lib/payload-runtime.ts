type RuntimeImport = (specifier: string) => Promise<Record<string, any>>;

const importRuntime = new Function("specifier", "return import(specifier)") as RuntimeImport;

export async function getCmsPayload() {
  const [{ default: config }, { getPayload }] = await Promise.all([importRuntime("@payload-config"), importRuntime("payload")]);
  return getPayload({ config });
}
