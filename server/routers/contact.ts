import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";

export const contactRouter = router({
  /**
   * Submit a contact form (public — from a business's website)
   */
  submit: publicProcedure
    .input(
      z.object({
        businessSlug: z.string(),
        name: z.string().min(1).max(255),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const business = await ctx.db.business.findUnique({
        where: { slug: input.businessSlug, isActive: true },
      });
      if (!business) throw new TRPCError({ code: "NOT_FOUND" });

      // Upsert contact
      const contact = await ctx.db.contact.upsert({
        where: {
          businessId_email: {
            businessId: business.id,
            email: input.email,
          },
        },
        update: {
          name: input.name,
          phone: input.phone,
          message: input.message,
        },
        create: {
          businessId: business.id,
          email: input.email,
          name: input.name,
          phone: input.phone,
          message: input.message,
          source: "contact_form",
        },
      });

      return { success: true, contactId: contact.id };
    }),

  /**
   * List contacts for current business (dashboard)
   */
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const owner = await ctx.db.businessOwner.findUnique({
        where: { userId: ctx.user.id },
      });
      if (!owner) throw new TRPCError({ code: "NOT_FOUND" });

      const contacts = await ctx.db.contact.findMany({
        where: { businessId: owner.businessId },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined;
      if (contacts.length > input.limit) {
        const nextItem = contacts.pop();
        nextCursor = nextItem?.id;
      }

      return { contacts, nextCursor };
    }),
});
