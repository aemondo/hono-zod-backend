import { Hono } from "hono";
import { dealsRepository } from "./db/dealsRepository";
import { zValidator } from "@hono/zod-validator";
import { dealUpdateSchema } from "./dealsValidators";
import { describeRoute } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import z from "zod";
import { DealSchema } from "./deal";

const dealsRouter = new Hono();

dealsRouter
  .get(
    "/",
    describeRoute({
      tags: ["deals"],
      summary: "Get all deals",
      description: "Retrieve a list of all deals",
      responses: {
        200: {
          description: "A list of deals",
          content: {
            json: { schema: resolver(z.array(DealSchema)) },
          },
        },
      },
    }),
    async (c) => {
      const deals = await dealsRepository.getDeals();
      return c.json(deals);
    }
  )
  .post(
    "/",
    describeRoute({
      tags: ["deals"],
      summary: "Create a new deal",
      description: "Create a new deal with the provided data",
      request: {
        body: {
          content: {
            json: { schema: resolver(dealUpdateSchema) },
          },
          description: "Deal data to create",
          required: true,
        },
      },
      responses: {
        200: {
          description: "The created deal",
          content: {
            json: { schema: resolver(DealSchema) },
          },
        },
      },
    }),
    zValidator("json", dealUpdateSchema),
    async (c) => {
      const dealRequest = c.req.valid("json");
      const deal = await dealsRepository.createDeal(dealRequest);
      return c.json(deal);
    }
  )
  .get(
    "/:id",
    describeRoute({
      tags: ["deals"],
      summary: "Get a single deal by ID",
      description: "Retrieve a specific deal by its ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "The ID of the deal to retrieve",
          schema: z.string().regex(/^\d+$/), // Ensure it's a numeric string
        },
      ],
      responses: {
        200: {
          description: "The requested deal",
          content: {
            json: { schema: resolver(DealSchema) },
          },
        },
        404: {
          description: "Deal not found",
          content: {
            json: { schema: resolver(z.object({ message: z.string() })) },
          },
        },
      },
    }),
    async (c) => {
      const id = Number(c.req.param("id"));
      const deal = await dealsRepository.getDealById(id);
      if (!deal) {
        return c.json({ message: "Deal not found" }, 404);
      }
      return c.json(deal);
    }
  )
  .patch(
    "/:id",
    describeRoute({
      tags: ["deals"],
      summary: "Update a deal by ID",
      description: "Update an existing deal with the provided data",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "The ID of the deal to update",
          schema: z.string().regex(/^\d+$/),
        },
      ],
      request: {
        body: {
          content: {
            json: { schema: resolver(dealUpdateSchema) },
          },
          description: "Deal data to update",
          required: true,
        },
      },
      responses: {
        200: {
          description: "The updated deal",
          content: {
            json: { schema: resolver(DealSchema) },
          },
        },
        404: {
          description: "Deal not found",
          content: {
            json: { schema: resolver(z.object({ message: z.string() })) },
          },
        },
      },
    }),
    zValidator("json", dealUpdateSchema),
    async (c) => {
      const id = Number(c.req.param("id"));
      const dealRequest = c.req.valid("json");
      const deal = await dealsRepository.updateDeal(id, dealRequest);
      if (!deal) {
        return c.json({ message: "Deal not found" }, 404);
      }
      return c.json(deal);
    }
  )
  .delete(
    "/:id",
    describeRoute({
      tags: ["deals"],
      summary: "Delete a deal by ID",
      description: "Delete a specific deal by its ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "The ID of the deal to delete",
          schema: z.string().regex(/^\d+$/),
        },
      ],
      responses: {
        200: {
          description: "Deal deleted successfully",
          content: {
            json: { schema: resolver(z.object({ message: z.string() })) },
          },
        },
        404: {
          description: "Deal not found",
          content: {
            json: { schema: resolver(z.object({ message: z.string() })) },
          },
        },
      },
    }),
    async (c) => {
      const id = Number(c.req.param("id"));
      await dealsRepository.deleteDeal(id);
      return c.json({ message: "Deal deleted" });
    }
  );

export default dealsRouter;
export type DealsRouterType = typeof dealsRouter;
