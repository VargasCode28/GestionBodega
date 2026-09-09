import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000

const ACTIVITY_EVENTS: Array<keyof WindowEventMap> = [
  'click',
  'keydown',
  'mousemove',
  'scroll',
  'touchstart'
]

export function useInactivityTimeout(timeoutMs = INACTIVITY_TIMEOUT_MS) {
  const authStore = useAuthStore()
  const router = useRouter()
  let inactivityTimer: ReturnType<typeof setTimeout> | undefined

  const clearInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = undefined
    }
  }

  const logoutAfterInactivity = () => {
    clearInactivityTimer()

    if (!authStore.isAuthenticated) {
      return
    }

    authStore.logout()
    void router.replace('/')
  }

  const resetInactivityTimer = () => {
    clearInactivityTimer()

    if (authStore.isAuthenticated) {
      inactivityTimer = setTimeout(logoutAfterInactivity, timeoutMs)
    }
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      resetInactivityTimer()
    }
  }

  onMounted(() => {
    ACTIVITY_EVENTS.forEach((eventName) => window.addEventListener(eventName, resetInactivityTimer))
    document.addEventListener('visibilitychange', handleVisibilityChange)
    resetInactivityTimer()
  })

  onBeforeUnmount(() => {
    ACTIVITY_EVENTS.forEach((eventName) => window.removeEventListener(eventName, resetInactivityTimer))
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    clearInactivityTimer()
  })
}