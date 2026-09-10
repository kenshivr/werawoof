import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/* Tests unitarios sin levantar Nuxt. Los auto-imports de Nitro se registran
   como globales en tests/setup.ts y #supabase/server apunta a un mock, así
   que ningún test toca Supabase ni el SMTP. */
export default defineConfig({
  resolve: {
    alias: [
      { find: /^~\//, replacement: fromRoot('./') },
      { find: '#supabase/server', replacement: fromRoot('./tests/mocks/supabase-server.ts') },
    ],
  },
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
  },
})
