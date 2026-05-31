import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token:    null,
      user:     null,

      setAuth: ({ access_token, user_id, full_name, email }) =>
        set({
          token: access_token,
          user:  { id: user_id, full_name, email },
        }),

      signout: () => set({ token: null, user: null }),
    }),
    {
      name: 'asset-tracker-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
)
