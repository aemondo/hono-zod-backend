import { Hono } from "hono";
import { dealsRepository } from "./db/dealsRepository";
import { zValidator } from "@hono/zod-validator";
import { dealSchema } from "./dealsValidators";

const dealsRouter = new Hono();

dealsRouter
  .get("/", async (c) => {
    const deals = await dealsRepository.getDeals();
    return c.json(deals);
  })
  .post("/", zValidator("json", dealSchema), async (c) => {
    const dealRequest = c.req.valid("json");
    const deal = await dealsRepository.createDeal(dealRequest);
    return c.json(deal);
  })
  .get("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    const deal = await dealsRepository.getDealById(id);
    return c.json(deal);
  })
  .patch("/:id", zValidator("json", dealSchema), async (c) => {
    const id = Number(c.req.param("id"));
    const dealRequest = c.req.valid("json");
    const deal = await dealsRepository.updateDeal(id, dealRequest);
    return c.json(deal);
  })
  .delete("/:id", async (c) => {
    const id = Number(c.req.param("id"));
    await dealsRepository.deleteDeal(id);
    return c.json({ message: "Deal deleted" });
  });

export default dealsRouter;
export type DealsRouterType = typeof dealsRouter;
