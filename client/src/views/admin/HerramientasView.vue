<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import toolService from '@/services/toolService'



const workers = ref<any[]>([])
const selectedId = ref<string | null>(null)


const tools = ref<any[]>([])
const toolSelectedId = ref<string | null>(null)


const  toolName = ref('')
const toolDescription = ref('')
const toolImageUrl = ref('')
const toolImageFile = ref<File | null>(null)
const imageInput = ref<HTMLInputElement | null>(null)



const borrows = ref<any[]>([])


const loadBorrows = async () => {
  try {
    const res = await api.get('/borrow')
    borrows.value = res.data
  } catch {
    error.value = 'Error al cargar préstamos'
  }
}


const returnTool = async (id:string) => {
  try {
    await api.put(`/borrow/return/${id}`)
    loadBorrows()
    loadTools()
  } catch {
    error.value = 'Error al devolver herramienta'
  }
}




const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')



const loadWorkers = async () => {
  try {
    const res = await api.get('/users')
    workers.value = res.data
  } catch {
    error.value = 'Error al cargar trabajadores'
  }
}


const loadTools = async () => {
  try {
    tools.value = await toolService.getAll()
  } catch {
    error.value = 'Error al cargar herramientas'
  }
}



const selectTool = (t:any) => {
  toolSelectedId.value = t._id
  toolName.value = t.name
  toolDescription.value = t.description
  toolImageUrl.value = t.imageUrl || ''
  toolImageFile.value = null
}

const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] || null
  toolImageFile.value = file
  if (file) toolImageUrl.value = URL.createObjectURL(file)
}



const createTool = async () => {
  error.value = ''

  try {
    await toolService.create({
      name: toolName.value,
      description: toolDescription.value,
      imageFile: toolImageFile.value
    })

    clearToolForm()
    loadTools()

  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Error al crear herramienta'
  }
}






const updateTool = async () => {
  if (!toolSelectedId.value) return

  error.value = ''

  try {
    await toolService.update(toolSelectedId.value, {
      name: toolName.value,
      description: toolDescription.value,
      imageFile: toolImageFile.value
    })

    clearToolForm()
    loadTools()

  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Error al editar herramienta'
  }
}





const deleteTool = async () => {
  if (!toolSelectedId.value) return

  if (!confirm('¿Eliminar herramienta?')) return

  error.value = ''

  try {
    await toolService.remove(toolSelectedId.value)

    clearToolForm()
    loadTools()

  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Error al eliminar herramienta'
  }
}









const clearToolForm = () => {
  toolSelectedId.value = null
  toolName.value = ''
  toolDescription.value = ''
  toolImageUrl.value = ''
  toolImageFile.value = null
  if (imageInput.value) imageInput.value.value = ''
}


onMounted(loadTools)



const selectWorker = (w: any) => {
  selectedId.value = w._id
  name.value = w.name
  email.value = w.email
}



const createWorker = async () => {
  error.value = ''

  if (!name.value || !email.value || !password.value) {
    error.value = 'Todos los campos son obligatorios'
    return
  }

  try {
    await api.post('/users', {
      name: name.value,
      email: email.value,
      password: password.value
    })

    name.value = ''
    email.value = ''
    password.value = ''

    loadWorkers()
  } catch (err: any) {
    error.value =
      err.response?.data?.message ||
      'Error al crear trabajador'
  }
}


const toggleWorker = async (id: string) => {
  try {
    await api.put(`/users/${id}/toggle`)
    loadWorkers()
  } catch {
    error.value = 'Error al cambiar estado'
  }
}

onMounted(loadWorkers)














const updateWorker =  async () => {
  if (!selectedId.value) return

  try {
    await api.put(`/users/${selectedId.value}`, {
      name: name.value,
      email: email.value
    })

    clearForm()
    loadWorkers()
  }catch {
    error.value = 'Error al editar trabajador'
  }
}




const deleteWorker = async () => {
  if (!selectedId.value) return


  if (!confirm('¿Seguro que deseas eliminar?'))return


  try {
    await api.delete(`/users/${selectedId.value}`)


    clearForm()
    loadWorkers()
  }catch {
    error.value = 'Error al eliminar trabajador'
  }
}



const clearForm = () => {
  selectedId.value = null
  name.value = ''
  email.value = ''
  password.value = ''
  error.value = ''
}

onMounted(loadWorkers)









onMounted(() => {
  loadWorkers()
  loadTools()
  loadBorrows()

  setInterval(() => {
    loadBorrows()
  }, 5000)
})



</script>






<template>



<div class="card border-0 shadow-sm rounded-4">
        <div class="card-header bg-white border-0 pt-4 px-4">
            <h5 class="fw-bold mb-0"><i class="bi bi-hammer me-2"></i>Inventario de Herramientas</h5>
        </div>
        <div class="card-body px-4 pb-4">
            <div class="table-responsive">
            <table class="table table-hover align-middle custom-table">
                <thead>
                <tr>
                    <th>Herramienta</th>
                    <th>Descripción</th>
                    <th class="text-end">Acciones</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="t in tools" :key="t._id" :class="{'table-light': toolSelectedId === t._id}">
                    <td class="fw-bold">
                      <div class="d-flex align-items-center gap-2">
                        <img v-if="t.imageUrl" :src="t.imageUrl" :alt="t.name" class="tool-thumbnail" />
                        <span v-else class="tool-thumbnail tool-thumbnail-placeholder"><i class="bi bi-tools"></i></span>
                        <span>{{ t.name }}</span>
                      </div>
                    </td>
                    <td class="text-muted small">{{ t.description }}</td>
                    <td class="text-end">
                    <button @click="selectTool(t)" class="btn btn-icon">
                        <i class="bi bi-gear-fill text-dark"></i>
                    </button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        </div>
    






        <div class="card border-0 shadow-sm rounded-4 sticky-form-tool">
        <div class="card-body p-4">
            <h6 class="text-uppercase text-muted fw-bold mb-4 small tracking-widest">
            {{ toolSelectedId ? 'Editar Herramienta' : 'Nueva Herramienta' }}
            </h6>
            <div class="mb-3">
            <input v-model="toolName" class="form-control custom-input" placeholder="Nombre de herramienta" />
            </div>
            <div class="mb-4">
            <textarea v-model="toolDescription" class="form-control custom-input" placeholder="Descripción técnica..." rows="2"></textarea>
            </div>
            <div class="mb-4">
            <label class="form-label small text-muted mb-1">Imagen de la herramienta</label>
            <input ref="imageInput" type="file" accept="image/*" class="form-control custom-input" @change="handleImageChange" />
            <img v-if="toolImageUrl" :src="toolImageUrl" :alt="toolName || 'Vista previa'" class="tool-preview mt-3" />
            </div>

            <div class="d-grid gap-2">
            <button v-if="!toolSelectedId" @click="createTool" class="btn btn-outline-dark fw-bold">Añadir al Stock</button>
            <template v-else>
                <button @click="updateTool" class="btn btn-dark">Actualizar</button>
                <div class="btn-group">
                <button @click="deleteTool" class="btn btn-sm btn-outline-danger border-0">Borrar</button>
                <button @click="clearToolForm" class="btn btn-sm btn-outline-secondary border-0">Cancelar</button>
                </div> 
            </template> 
            </div>
        </div>
        </div>
    


</template>



<style scoped 
src="/src/styles/Herramientas.css"
>
</style>





































































