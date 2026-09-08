
import { ref } from 'vue'
import api from '@/services/api'
import Swal from 'sweetalert2'

const apiOrigin = new URL(import.meta.env.VITE_API_URL).origin

const normalizeImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return imageUrl

  try {
    const image = new URL(imageUrl, apiOrigin)
    return image.pathname.startsWith('/uploads/')
      ? `${apiOrigin}${image.pathname}${image.search}`
      : imageUrl
  } catch {
    return imageUrl
  }
}

export const tools = ref<any[]>([])
export const error = ref('')




export const loadTools = async () => {
  try {
    const res = await api.get('/tools')
    tools.value = res.data
      .filter((tool: any) => tool.status === 'AVAILABLE')
      .map((tool: any) => ({
        ...tool,
        imageUrl: normalizeImageUrl(tool.imageUrl)
      }))
  } catch {
    error.value = 'No se pudieron cargar herramientas'
  }
}



export const borrowTool = async (toolId: string) => {
  const confirm = await Swal.fire({
    title: '¿Solicitar herramienta?',
    text: 'La herramienta será asignada a tu usuario',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Solicitar',
    cancelButtonText: 'Cancelar'
  })

  if (!confirm.isConfirmed) return

  try {
    await api.post('/borrow', { toolId })
    await loadTools()
    Swal.fire({
      icon: 'success',
      title: 'Herramienta solicitada',
      timer: 1500,
      showConfirmButton: false
    })
  } catch {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo pedir la herramienta'
    })
  }
}
















