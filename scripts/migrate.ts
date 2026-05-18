import "dotenv/config";

import type { DrizzleAdapter } from "@payloadcms/drizzle/types";

import { pushDevSchema } from "@payloadcms/drizzle";
import { getPayload } from "payload";

import config from "../src/payload/payload.config";

(async () => {
  process.env.PAYLOAD_MIGRATING = "true";
  process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = "true";

  const payload = await getPayload({ config });
  await pushDevSchema(payload.db as unknown as DrizzleAdapter);

  console.log("Schema push complete");
  await payload.destroy();
  process.exit(0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
