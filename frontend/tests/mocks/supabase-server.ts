import { vi } from 'vitest'

/* Reemplaza #supabase/server (alias en vitest.config.ts). Cada spec decide
   qué devuelve el cliente admin con vi.mocked(serverSupabaseServiceRole). */
export const serverSupabaseServiceRole = vi.fn()
export const serverSupabaseUser = vi.fn()
