
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'



const workers = ref<any[]>([])
const selectedId = ref<string | null>(null)



const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')


const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})



api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})






const loadWorkers = async () => {
  try {
    const res = await api.get('/users')
    workers.value = res.data
  } catch {
    error.value = 'Error al cargar trabajadores'
  }
}




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
  // loadTools()
  // loadBorrows()

  setInterval(() => {
    // loadBorrows()
  }, 5000)
})















































</script>








<template>
  <div class="admin-container animate-fade-up">
    <header class="mb-1 d-flex align-items-center justify-content-between">
      <div>
        <h2 class="fw-bold text-dark mb-1">Gestión Empresarial</h2>
        <p class="text-muted small">Administra el personal operativo y el inventario de herramientas.</p>
      </div>
      <div class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
        CONSTRU-SOFT v1.0
      </div>
    </header>

    <div class="row g-4">
      <div class="col-xl-8">
        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-header bg-white border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
            <h5 class="fw-bold mb-0"><i class="bi bi-people me-2"></i>Trabajadores</h5>
          </div>
          
          <div class="card-body px-4 pb-4">
            <div class="table-responsive">
              <table class="table table-hover align-middle custom-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Estado</th>
                    <!-- <th class="text-end">Acciones</th> -->
                    <th class="text-end">
                    <i class="bi bi-gear-fill me-1 text-secondary"></i>
                    Acciones
                  </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="w in workers" :key="w._id" :class="{'table-light': selectedId === w._id}">
                    <td>
                      <div class="fw-bold">{{ w.name }}</div>
                      <div class="text-muted x-small">ID: {{ w._id.slice(-6) }}</div>
                    </td>
                    <td>{{ w.email }}</td>
                    <td>
                      <span :class="w.active ? 'status-active' : 'status-blocked'">
                        {{ w.active ? 'Activo' : 'Bloqueado' }}
                      </span>
                    </td>
                    <td class="text-end">
                      <button @click="toggleWorker(w._id)" class="btn btn-icon me-1" :title="w.active ? 'Desactivar' : 'Activar'">
                        <i :class="w.active ? 'bi bi-person-x text-danger' : 'bi bi-person-check text-success'"></i>
                      </button>
                      <button @click="selectWorker(w)" class="btn btn-icon" title="Editar">
                        <i class="bi bi-pencil-square text-primary"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </div>

      <div class="col-xl-4">
        <div class="card border-0 shadow-sm rounded-4 mb-4 sticky-form">
          <div class="card-body p-4">
            <h6 class="text-uppercase text-muted fw-bold mb-4 small tracking-widest">
              {{ selectedId ? 'Modificar Trabajador' : 'Registrar Nuevo' }}
            </h6>
            
            <div class="mb-3">
              <label class="form-label small fw-bold">Nombre Completo</label>
              <input v-model="name" class="form-control custom-input" placeholder="Ej. Juan Pérez" />
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold">Correo Electrónico</label>
              <input v-model="email" class="form-control custom-input" placeholder="juan@obra.com" />
            </div>
            <div class="mb-4" v-if="!selectedId">
              <label class="form-label small fw-bold">Contraseña Inicial</label>
              <input v-model="password" type="password" class="form-control custom-input" placeholder="••••••••" />
            </div>

            <div v-if="error" class="alert alert-danger py-2 small mb-3 border-0">{{ error }}</div>

            <div class="d-grid gap-2">
              <button v-if="!selectedId" @click="createWorker" class="btn btn-dark fw-bold py-2">Crear Trabajador</button>
              <template v-else>
                <button @click="updateWorker" class="btn btn-dark fw-bold">Guardar Cambios</button>
                <div class="row g-2">
                  <div class="col-6">
                    <button @click="deleteWorker" class="btn btn-outline-danger btn-sm w-100">Eliminar</button>
                  </div>
                  <div class="col-6">
                    <button @click="clearForm" class="btn btn-light btn-sm w-100 border">Cancelar</button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div> 

  </div>
    </div>
  </div>

</template>










<style scoped

src="/src/styles/DashboardAdmin.css"
>

</style>