import { createPinia, setActivePinia } from 'pinia'
import { computed, ref } from 'vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Profile } from '~/types/auth'
import { useAuthStore } from '~/stores/auth'

const profile = (role: Profile['role']): Profile =>
  ({
    id: 'user-1',
    name: 'Kenshi',
    role,
  }) as Profile

/* Claims del JWT que devuelve useSupabaseUser() en @nuxtjs/supabase 2.x */
const claims = ref<{ sub: string; email: string } | null>({
  sub: 'user-1',
  email: 'kenshi@werawoof.test',
})

/* Cliente de Supabase falso: solo lo que usa fetchProfile */
const single = vi.fn()
const eq = vi.fn(() => ({ single }))
const select = vi.fn(() => ({ eq }))
const supabase = { from: vi.fn(() => ({ select })) }

/* Auto-imports de Nuxt que usa el store */
vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('useSupabaseClient', () => supabase)
vi.stubGlobal('useSupabaseUser', () => claims)

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
  claims.value = { sub: 'user-1', email: 'kenshi@werawoof.test' }
})

describe('useAuthStore.isAdmin', () => {
  it('es false sin perfil cargado', () => {
    const store = useAuthStore()
    expect(store.isAdmin).toBe(false)
  })

  it('es false para un usuario con role user', async () => {
    single.mockResolvedValue({ data: profile('user'), error: null })
    const store = useAuthStore()
    await store.fetchProfile()
    expect(store.isAdmin).toBe(false)
  })

  it('es true solo cuando el perfil tiene role admin', async () => {
    single.mockResolvedValue({ data: profile('admin'), error: null })
    const store = useAuthStore()
    await store.fetchProfile()
    expect(store.isAdmin).toBe(true)
  })

  it('vuelve a false al cerrar sesión', async () => {
    single.mockResolvedValue({ data: profile('admin'), error: null })
    const store = useAuthStore()
    await store.fetchProfile()
    store.profile = null
    expect(store.isAdmin).toBe(false)
  })
})
