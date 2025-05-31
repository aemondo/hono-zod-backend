import { seed } from "drizzle-seed";
import db from "../../db/database";
import { dealsTable } from "./dealsSchema";

const seedDeals = async () => {
  await seed(db, { dealsTable, count: 10 });
};

seedDeals();
export default seedDeals;
