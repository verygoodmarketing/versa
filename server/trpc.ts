import { initTRPC, TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";

/**
 * tRPC context — created for every request.
 * Provides Supabase session and Prisma client.
 */
export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    req: opts.req,
    supabase,
    user,
    db: prisma,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC — one instance per application.
 */
const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Reusable middleware for authentication checks.
 */
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

/**
 * Public procedure — no auth required.
 * Use for public-facing routes (site rendering, contact forms).
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure — requires authenticated Supabase session.
 * Use for dashboard/admin routes.
 */
export const protectedProcedure = t.procedure.use(enforceAuth);

export const router = t.router;
export const middleware = t.middleware;
