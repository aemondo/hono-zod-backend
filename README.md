# Hono + Zod + OpenAPI + MySQL (Drizzle)

This project is a quick test on how to setup and simple backend using the Hono stack which uses zod to generate an openApi spec and swagger UI. This setup also works with the hono RPC feature.
[https://hono.dev/images/logo.svg]

## Stack

- [Hono](https://hono.dev/) - Backend Framework, Router
- [Zod](https://zod.dev/) - Schema Validation
- [Drizzle](https://orm.drizzle.team/) - ORM, Query Builder

## Thoughts

#### Open API

Having the OpenApi Doc generated from the code is great, but its a bit verbose in the code. It does beat maintaining docs tho.

```ts
const dealsRouter = new Hono();

dealsRouter.get(
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
);
```

#### Zod First

In this project, I tried the approach of having my types infered from Zod schemas, and although it makes the domain tightly coupled with the validation library, it offers good DX.

```ts
import { z } from "zod";

export const DealSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  amount: z.number().positive().default(0),
  createdAt: z.date(),
});

export type Deal = z.infer<typeof DealSchema>;
```

## Installation

Install dependencies:

```
yarn
```

## Usage

To start the development server:

```bash
yarn dev
```

To build the project:

```bash
yarn build
```

To start the production server:

```bash
yarn start
```

## Swagger

You can access the OpenAPI Doc through the SwaggerUI at `http://localhost:3000/ui`
