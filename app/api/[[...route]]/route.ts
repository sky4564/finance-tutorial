import { z } from "zod";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

export const runtime = 'edge'

import authors from './authors'
import books from './books'

const app = new Hono().basePath('/api')

app
    .get(
        '/hello',
        clerkMiddleware(),
        
    )

app.route('/authors', authors)
app.route('/books', books)

export const GET = handle(app);
export const POST = handle(app);