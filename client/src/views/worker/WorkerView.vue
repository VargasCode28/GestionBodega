
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import router from '@/routes'

import Swal from 'sweetalert2'



const user = JSON.parse(localStorage.getItem('user') || '{}')

const tools = ref<any[]>([])
const error = ref('')

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})



const loadTools = async () => {
  try {
    const res = await api.get('/tools')

    tools.value = res.data.filter(
      (tool:any) => tool.status === 'AVAILABLE'
    )

  } catch (err) {
    error.value = 'No se pudieron cargar herramientas'
  }
}



const logout = async () => {

  if (!localStorage.getItem('token')) return

  const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Tu sesión actual se cerrará',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar'
  })

  if (!result.isConfirmed) return

  localStorage.removeItem('token')
  localStorage.removeItem('user')

  await Swal.fire({
    icon: 'success',
    title: 'Sesión cerrada',
    timer: 1000,
    showConfirmButton: false
  })

  router.replace('/')
}




onMounted(() => {
  
  if (!localStorage.getItem('token')) {
    router.push('/')
  } else {
    loadTools()
  }
})



const borrowTool = async (toolId: string) => {

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

  } catch (err) {

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo pedir la herramienta'
    })

  }
}



</script>



<template>
  <div class="dashboard-wrapper">
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-3">
      <div class="container">
        <a class="navbar-brand fw-bolder tracking-tighter" href="#">
          <i class="bi bi-cone-striped text-warning me-2"></i>CONSTRU<span class="text-muted">SOFT</span>
        </a>
        <div class="d-flex align-items-center">
          <span class="me-3 d-none d-md-inline text-muted small">ID: #{{ user._id?.slice(-5) || '000' }}</span>
          <button @click="logout" class="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">
            Salir <i class="bi bi-box-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </nav>

    <div class="container py-5 animate-fade-up">
      <header class="row mb-5 align-items-center">
        <div class="col-md-8">
          <h6 class="text-warning text-uppercase fw-bold mb-2 small tracking-widest">Panel de Operaciones</h6>
          <h1 class="display-6 fw-bold">Buen día, {{ user.name }}</h1>
          <p class="text-muted lead mb-0">Gestione sus tareas y herramientas asignadas para hoy.</p>
        </div>
        <div class="col-md-4 text-md-end mt-4 mt-md-0">
          <div class="stats-card p-3 d-inline-block bg-white shadow-sm border rounded-4">
            <span class="text-muted small d-block">Herramientas activas</span>
            <span class="h3 fw-bold mb-0">{{ tools.length }}</span>
          </div>
        </div>
      </header>

      <div v-if="error" class="alert alert-danger border-0 shadow-sm d-flex align-items-center rounded-4" role="alert">
        <i class="bi bi-exclamation-octagon-fill fs-4 me-3"></i>
        <div>
          <strong class="d-block">Error de sistema</strong>
          <span class="small">{{ error }}</span>
        </div>
      </div>

      <div class="row g-4 mt-2">
        <div v-for="(tool, index) in tools" :key="tool._id" class="col-12 col-md-6 col-xl-4">
          <div class="card tool-card h-100" :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <div class="icon-container shadow-sm">
                  <i class="bi bi-tools fs-4 text-dark"></i>
                </div>
                <span class="badge rounded-pill bg-light text-dark border fw-normal px-3">Activo</span>
              </div>
              
              <h5 class="fw-bold mb-2">{{ tool.name }}</h5>
              <p class="text-muted small line-clamp">{{ tool.description }}</p>
              
              <div class="mt-4 d-grid">
              

                <button @click="borrowTool(tool._id)">
                Pedir Herramienta
                </button>

              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>






<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');

.dashboard-wrapper {
  background-color: #fcfcfc;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Tipografía y Espaciado */
.tracking-tighter { letter-spacing: -1px; }
.tracking-widest { letter-spacing: 3px; }

/* Animación de entrada escalonada */
.animate-fade-up {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tarjetas de Herramientas Estilizadas */
.tool-card {
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 20px;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
  border-color: #ffc107; /* El amarillo de seguridad al pasar el mouse */
}

.icon-container {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 15px;
}

/* Limitar texto a 2 líneas para mantener simetría */
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.btn-dark {
  background-color: #1a1a1a;
  border: none;
}

.btn-dark:hover {
  background-color: #000;
  transform: scale(1.02);
}

.stats-card {
  border-radius: 18px;
  min-width: 160px;
}
</style>