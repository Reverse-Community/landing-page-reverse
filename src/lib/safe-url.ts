const DEFAULT_ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

export function isSafeUrl(value: unknown, allowedProtocols = DEFAULT_ALLOWED_PROTOCOLS) {
  if (typeof value !== "string") return false;

  const trimmed = value.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("#")) return true;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;

  try {
    return allowedProtocols.has(new URL(trimmed).protocol);
  } catch {
    return false;
  }
}

export function optionalSafeUrl(value: unknown) {
  return isSafeUrl(value) && typeof value === "string" ? value.trim() : undefined;
}

export function validateSafeUrl(value: unknown) {
  if (typeof value === "undefined" || value === null) return true;
  if (typeof value === "string" && !value.trim()) return true;

  return isSafeUrl(value) || "Use a valid http(s), root-relative, or anchor URL.";
}

export function validateRequiredSafeUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "URL is required.";

  return isSafeUrl(value) || "Use a valid http(s), root-relative, or anchor URL.";
}
