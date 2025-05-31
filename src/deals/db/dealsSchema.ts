import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core";
import type { Deal } from "../deal";

export const dealsTable = mysqlTable("deals_table", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type DealSelect = typeof dealsTable.$inferSelect;
export type DealInsert = typeof dealsTable.$inferInsert;

export const toDeal = (dealSelect: DealSelect): Deal => {
  return {
    id: dealSelect.id,
    name: dealSelect.name,
    email: dealSelect.email,
    createdAt: dealSelect.createdAt,
  };
};

export const toDealInsert = (
  deal: Omit<Deal, "id" | "createdAt">
): DealInsert => {
  const drizzleInsert: DealInsert = {
    name: deal.name,
    email: deal.email,
  };
  return drizzleInsert;
};
