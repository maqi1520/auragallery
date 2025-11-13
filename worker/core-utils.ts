/**
 * Core utilities for the application.
 * This file contains the environment definition and API response helpers.
 */
import type { ApiResponse } from "@shared/types";
import type { Context } from "hono";
export interface Env {
  R2_BUCKET: R2Bucket;
  DB: D1Database;
}
// API HELPERS
export const ok = <T>(c: Context, data: T) => c.json({ success: true, data } as ApiResponse<T>);
export const bad = (c: Context, error: string, status: number = 400) => {
  return c.json({ success: false, error } as ApiResponse, { status });
};
export const notFound = (c: Context, error = 'not found') => {
  return c.json({ success: false, error } as ApiResponse, { status: 404 });
};
export const isStr = (s: unknown): s is string => typeof s === 'string' && s.length > 0;