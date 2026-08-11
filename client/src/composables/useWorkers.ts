import { ref } from 'vue'
import { dashboardService, type Worker } from '@/services/dashboardService'

export function useWorkers() {
const workers = ref<Worker[]>([])
const selectedId = ref<string | null>(null)

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const loadWorkers = async () => {
    try {
    workers.value = await dashboardService.getWorkers()
    } catch {
    error.value = 'Error al cargar trabajadores'
    }
}

const selectWorker = (w: Worker) => {
    selectedId.value = w._id
    name.value = w.name
    email.value = w.email
}

const clearForm = () => {
    selectedId.value = null
    name.value = ''
    email.value = ''
    password.value = ''
    error.value = ''
}

const createWorker = async () => {
    error.value = ''

    if (!name.value || !email.value || !password.value) {
    error.value = 'Todos los campos son obligatorios'
    return
    }

    try {
    await dashboardService.createWorker({
        name: name.value,
        email: email.value,
        password: password.value
    })
    clearForm()
    await loadWorkers()
    } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al crear trabajador'
    }
}

const updateWorker = async () => {
    if (!selectedId.value) return

    try {
    await dashboardService.updateWorker(selectedId.value, {
        name: name.value,
        email: email.value
    })
    clearForm()
    await loadWorkers()
    } catch {
    error.value = 'Error al editar trabajador'
    }
}

const deleteWorker = async () => {
    if (!selectedId.value) return
    if (!confirm('¿Seguro que deseas eliminar?')) return

    try {
    await dashboardService.deleteWorker(selectedId.value)
    clearForm()
    await loadWorkers()
    } catch {
    error.value = 'Error al eliminar trabajador'
    }
}

const toggleWorker = async (id: string) => {
    try {
    await dashboardService.toggleWorker(id)
    await loadWorkers()
    } catch {
    error.value = 'Error al cambiar estado'
    }
}

return {
    // estado

    workers,
    selectedId,
    name,
    email,
    password,
    error,


    // acciones
    loadWorkers,
    selectWorker,
    clearForm,
    createWorker,
    updateWorker,
    deleteWorker,
    toggleWorker
    }
}