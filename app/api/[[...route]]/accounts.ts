import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { HTTPException } from "hono/http-exception"

import { db } from "@/db/drizzle"
import { accounts } from "@/db/schema"


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
                return c.json({ error: "Unauthorized" } , 401)
                
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

export default app