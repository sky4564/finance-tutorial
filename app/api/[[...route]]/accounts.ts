import { Hono } from "hono";
import { and, eq, inArray } from "drizzle-orm";

import { z } from "zod";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from "hono/http-exception"
import { createId } from "@paralleldrive/cuid2"

import { db } from "@/db/drizzle"
import { accounts, insertAccountSchema } from "@/db/schema"
import { zValidator } from "@hono/zod-validator";


const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    async (c) => {
      const auth = getAuth(c);

      if (!auth?.userId) {
        //이건 간단하게 쓸수있어서 좋음
        //이거 써도 리턴타입에 안잡히게끔 추후 업데이트 예정인데 아직안된듯
        //이거 쓰다가 문제생기면 밑에 error 처리로 복귀하기
        return c.json({ error: "Unauthorized" }, 401)

        // 이걸쓰면 리턴 타입에 error 타입은 안잡혀서 깔끔함

        // throw new HTTPException(401, {
        //     res: c.json({ error: "Unauthorze man" })
        // })
      }


      const data = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId))

      return c.json({ data })
    })
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    clerkMiddleware(),

    async (c) => {

      console.log(c)
      const auth = getAuth(c)
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "Missing id" }, 400)
      }

      if (!auth?.userId) {
        return c.json({ error: "unauthorzied!!!" }, 400)
      }
      const [data] = await db
        .select({
          id: accounts.id,
          name: accounts.name,
        })
        .from(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id)
          ),
        )

      if (!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });

    }


  )
  .post(
    "/",
    clerkMiddleware(),
    zValidator("json", insertAccountSchema.pick({
      name: true
    })),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json")

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = await db.insert(accounts).values({
        id: createId(),
        userId: auth.userId,
        ...values,
      }).returning()
      return c.json({ data });
    }
  )
  .post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      const data = await db
        .delete(accounts)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            inArray(accounts.id, values.ids)
          )
        )
        .returning({
          id: accounts.id
        })

      return c.json({ data })
    },
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator(
      "json",
      insertAccountSchema.pick({
        name: true,
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const [data] = await db
        .update(accounts)
        .set(values)
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id),
          ),
        )
        .returning();

      if (!data) {
        return c.json({ error: "not found" }, 404);
      }

      return c.json({ data })
    }

  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");      
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      if (!auth?.userId) {
        return c.json({ error: "unauthorized" }, 401);
      }

      const [data] = await db
        .delete(accounts)        
        .where(
          and(
            eq(accounts.userId, auth.userId),
            eq(accounts.id, id),
          ),
        )
        .returning({
          id: accounts.id,
        });

      if (!data) {
        return c.json({ error: "not found" }, 404);
      }

      return c.json({ data })
    }

  )
export default app