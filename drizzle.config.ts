import { config } from 'dotenv';

import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local'})

export default defineConfig ({
    schema: "./db/schema.ts",    
    dialect:"postgresql",    
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true
});



// import { defineConfig } from "drizzle-kit";
 
// export default defineConfig({
//   schema: "./schema/*",
//   out: "./drizzle",
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DB_URL,
//   }
// });