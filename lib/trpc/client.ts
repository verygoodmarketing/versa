import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/root";

/**
 * React hook factory for tRPC — use in Client Components.
 * Import `trpc` and use as `trpc.business.getCurrent.useQuery()`
 */
export const trpc = createTRPCReact<AppRouter>();
