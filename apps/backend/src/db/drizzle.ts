import { drizzle } from 'drizzle-orm/d1';
import { schema } from './index';
import type { Env } from "../types";

export const getDb = (env: Env) => drizzle(env.exam_grade_db, { schema });

export type Db = ReturnType<typeof getDb>;