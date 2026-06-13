import { defineStore } from 'pinia'
import { login } from '@/services/authService'

interface User {
    id: number
    email: string
    role: 'ADMIN' | 'WORKER'
}

interface AuthState {
   token: string | null    // ✅ | no ||
    user: User | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') ?? 'null')
}),

getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN'
},

actions: {
    async login(email: string, password: string) {
      const { token, user } = await login(email, password)  //  = agregado

    this.token = token
    this.user = user

    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
    this.token = null
    this.user = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    }
}
})