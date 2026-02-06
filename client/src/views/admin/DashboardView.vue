
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'


const workers = ref<any[]>([])
const selectedId = ref<string | null>(null)


const tools = ref<any[]>([])
const toolSelectedId = ref<string | null>(null)


const  toolName = ref('')
const toolDescription = ref('')



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




const loadTools = async () => {
  const res = await api.get('/tools')
  tools.value = res.data
}





// Seleccionar herramienta
const selectTool = (t:any) => {
  toolSelectedId.value = t._id
  toolName.value = t.name
  toolDescription.value = t.description
}








const createTool = async () => {
  error.value = ''

  try {
    await api.post('/tools', {
      name: toolName.value,
      description: toolDescription.value
    })

    clearToolForm()
    loadTools()

  } catch (err: any) {
    console.log(err)
    error.value = err.response?.data?.message || 'Error al crear herramienta'
  }
}












const updateTool = async () => {
  if (!toolSelectedId.value) return

  error.value = ''

  try {
    await api.put(`/tools/${toolSelectedId.value}`, {
      name: toolName.value,
      description: toolDescription.value
    })

    clearToolForm()
    loadTools()

  } catch (err: any) {
    console.log(err)
    error.value = err.response?.data?.message || 'Error al editar herramienta'
  }
}




















const deleteTool = async () => {
  if (!toolSelectedId.value) return
  if (!confirm('¿Eliminar herramienta?')) return

  error.value = ''

  try {
    await api.delete(`/tools/${toolSelectedId.value}`)

    clearToolForm()
    loadTools()

  } catch (err: any) {
    console.log(err)
    error.value = err.response?.data?.message || 'Error al eliminar herramienta'
  }
}













// Limpiar formulario
const clearToolForm = () => {
  toolSelectedId.value = null
  toolName.value = ''
  toolDescription.value = ''
}


// cargar herramientas al montar
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
  <div class="admin-container animate-fade-up">
    <header class="mb-4 d-flex align-items-center justify-content-between">
      <div>
        <h2 class="fw-bold text-dark mb-1">Gestión Empresarial</h2>
        <p class="text-muted small">Administra el personal operativo y el inventario de herramientas.</p>
      </div>
      <div class="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
        CONSTRU-SOFT v3.5
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
                    <th class="text-end">Acciones</th>
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
                    <td class="fw-bold">{{ t.name }}</td>
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
                <button @click="updateWorker" class="btn btn-primary fw-bold">Guardar Cambios</button>
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
      </div>
    </div>
  </div> 


















<div class="card border-0 shadow-sm rounded-4 mt-4">
  <div class="card-header bg-white border-0 pt-4 px-4">
    <h5 class="fw-bold mb-0">
      <i class="bi bi-clipboard-check me-2"></i>
      Seguimiento de Herramientas
    </h5>
  </div>

  <div class="card-body px-4 pb-4">
    <div class="table-responsive">
      <table class="table table-hover align-middle custom-table">
        <thead>
          <tr>
            <th>Trabajador</th>
            <th>Herramienta</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th class="text-end">Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="b in borrows" :key="b._id">

            <td>{{ b.user?.name }}</td>

            <td>{{ b.tool?.name }}</td>

            <td>
              {{ new Date(b.borrowedAt).toLocaleDateString() }}
            </td>

            <td>
              <span
                :class="b.status === 'BORROWED'
                  ? 'status-active'
                  : 'status-blocked'"
              >
                {{ b.status }}
              </span>
            </td>

            <td class="text-end">

              <button
                v-if="b.status === 'BORROWED'"
                @click="returnTool(b._id)"
                class="btn btn-success btn-sm"
              >
                Marcar devolución
              </button>

              <span v-else class="text-muted small">
                Entregado
              </span>

            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>


</template>

<style scoped>
/* Reset & Typography */
.admin-container {
  font-family: 'Inter', sans-serif;
  color: #2d3436;
}

.tracking-widest { letter-spacing: 0.15em; }
.x-small { font-size: 0.7rem; }

/* Table Styling */
.custom-table thead th {
  background-color: #f8f9fa;
  text-uppercase: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  color: #636e72; 
  border: none;
  padding: 1rem;
}

.custom-table tbody td {
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #f1f2f6; 
}

/* Status Badges */
.status-active {
  background: #00c059b4;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-blocked {
  background: #ec0000;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}



/* Inputs & Buttons */
.custom-input {
  border: 1px solid #dfe6e9; 
  
  border-radius: 8px;
  padding: 0.6rem 1rem;
  background-color: #fdfdfd; 

}

.custom-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.15);
  border-color: #ffc107;
}

.btn-icon {
  background: #dcdcdc; 
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.sticky-form {
  position: sticky;
  top: 90px;
}

/* Animation */
.animate-fade-up {
  animation: fadeUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsivo */
@media (max-width: 1200px) {
  .sticky-form { position: static; }
}
</style>