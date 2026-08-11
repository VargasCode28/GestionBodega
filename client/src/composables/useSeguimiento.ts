import { ref, onMounted, onUnmounted, computed } from 'vue'
import { seguimientoService, type Borrow } from '@/services/seguimientoService'

export function useSeguimiento(pollInterval = 5000) {
  const error = ref('')
  const showHistory = ref(false)
  const borrows = ref<Borrow[]>([])
  const loading = ref(false)

  const filteredBorrows = computed(() =>
    showHistory.value
      ? borrows.value
      : borrows.value.filter(b => b.status === 'BORROWED')
  )

  const loadBorrows = async () => {
    loading.value = true
    try {
      borrows.value = await seguimientoService.getBorrows()
      error.value = ''
    } catch {
      error.value = 'Error al cargar préstamos'
    } finally {
      loading.value = false
    }
  }

  const returnTool = async (id: string) => {
    try {
      await seguimientoService.returnTool(id)
      await loadBorrows()
    } catch {
      error.value = 'Error al devolver herramienta'
    }
  }

  let intervalId: ReturnType<typeof setInterval>

  onMounted(() => {
    loadBorrows()
    intervalId = setInterval(loadBorrows, pollInterval)
  })

  onUnmounted(() => {
    clearInterval(intervalId)
  })

  return {
    error,
    loading,
    showHistory,
    borrows,
    filteredBorrows,
    loadBorrows,
    returnTool
  }
}