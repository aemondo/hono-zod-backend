import {
  dealsTable,
  toDeal,
  toDealInsert,
  type DealInsert,
} from "./dealsSchema";

import db from "../../db/database";
import { eq } from "drizzle-orm/sql";
import { HTTPException } from "hono/http-exception";
import type { Deal } from "../deal";

class DealsRepository {
  async createDeal(deal: DealInsert): Promise<Deal> {
    const result = await db
      .insert(dealsTable)
      .values(toDealInsert(deal))
      .$returningId();

    if (!result) {
      throw new HTTPException(500, { message: "Failed to create deal" });
    }

    return await this.getDealById(result[0].id);
  }

  async getDealById(id: number): Promise<Deal> {
    const result = await db.query.dealsTable.findFirst({
      where: eq(dealsTable.id, id),
    });

    if (!result) {
      throw new HTTPException(404, { message: "Deal not found" });
    }

    return toDeal(result);
  }

  async getDeals(): Promise<Deal[]> {
    const result = await db.query.dealsTable.findMany();

    return result.map(toDeal);
  }

  async updateDeal(id: number, deal: DealInsert): Promise<Deal> {
    await db
      .update(dealsTable)
      .set(toDealInsert(deal))
      .where(eq(dealsTable.id, id));
    return await this.getDealById(id);
  }

  async deleteDeal(id: number): Promise<void> {
    await db.delete(dealsTable).where(eq(dealsTable.id, id));
  }
}

export const dealsRepository = new DealsRepository();
