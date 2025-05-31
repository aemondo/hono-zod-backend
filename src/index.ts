import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import dealsRouter from "./deals/dealsRouter";
import { describeRoute, openAPISpecs } from "hono-openapi";
import { resolver } from "hono-openapi/zod";
import z from "zod";
import { swaggerUI } from "@hono/swagger-ui";

const app = new Hono();

app.use(cors());
app.use(logger());

app.get(
  "/health",
  describeRoute({
    tags: ["health"],
    summary: "Health check",
    description: "Check if the server is running",
    responses: {
      200: {
        description: "OK",
        content: {
          json: { schema: resolver(z.object({ message: z.string() })) },
        },
      },
    },
  }),
  (c) => {
    return c.json({ message: "OK" });
  }
);

app.route("/deals", dealsRouter);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Hono API",
        version: "1.0.0",
        description: "Greeting API",
      },
      servers: [{ url: "http://localhost:3000", description: "Local Server" }],
    },
  })
);

app.get("/ui", swaggerUI({ url: "/openapi" }));

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
