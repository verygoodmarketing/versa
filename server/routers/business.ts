import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const businessRouter = router({
  /**
   * Get the current user's business (dashboard use)
   */
  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const owner = await ctx.db.businessOwner.findUnique({
      where: { userId: ctx.user.id },
      include: { business: true },
    });

    if (!owner) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No business found for this user",
      });
    }

    return owner.business;
  }),

  /**
   * Create a new business account (onboarding)
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        slug: z
          .string()
          .min(2)
          .max(63)
          .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
        email: z.string().email(),
        phone: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check slug uniqueness
      const existing = await ctx.db.business.findUnique({
        where: { slug: input.slug },
      });
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "That URL is already taken. Please choose a different one.",
        });
      }

      const business = await ctx.db.business.create({
        data: {
          ...input,
          owners: {
            create: {
              userId: ctx.user.id,
              role: "OWNER",
            },
          },
        },
      });

      return business;
    }),

  /**
   * Update business profile
   */
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255).optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        category: z.string().optional(),
        description: z.string().optional(),
        logoUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const owner = await ctx.db.businessOwner.findUnique({
        where: { userId: ctx.user.id },
      });
      if (!owner) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return ctx.db.business.update({
        where: { id: owner.businessId },
        data: input,
      });
    }),

  /**
   * Get a business by slug (public site rendering)
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const business = await ctx.db.business.findUnique({
        where: { slug: input.slug, isActive: true },
        include: { site: { include: { pages: true } } },
      });

      if (!business) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return business;
    }),
});
