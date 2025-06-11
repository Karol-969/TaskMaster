import { Pool as PgPool } from 'pg';
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';
import { Pool as NeonPool, neonConfig } from '@neondatabase/serverless';
import { drizzle as neonDrizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Check if we're using local PostgreSQL (Docker) or Neon serverless
const isLocalPostgres = process.env.DATABASE_URL.includes('postgresql://postgres:postgres@db:') || 
                        process.env.NODE_ENV === 'production';

let pool: PgPool | NeonPool;
let db: ReturnType<typeof pgDrizzle> | ReturnType<typeof neonDrizzle>;

if (isLocalPostgres) {
  // Use standard PostgreSQL driver for Docker/local deployments
  pool = new PgPool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: false // Disable SSL for local connections
  });
  
  db = pgDrizzle(pool, { schema });
} else {
  // Use Neon serverless for cloud deployments
  neonConfig.webSocketConstructor = ws;
  
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = neonDrizzle({ client: pool, schema });
}

export { db, pool };