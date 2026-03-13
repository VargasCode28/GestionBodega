<script setup lang="ts">
import router from '@/routes';
import Swal from 'sweetalert2';
import { tools, loadTools } from '@/composables/useTools'




const user = JSON.parse(localStorage.getItem('user') || '{}');



const logout = async () => {

if (!localStorage.getItem('token')) return;

const result = await Swal.fire({
    title: '¿Cerrar sesión?',
    text: 'Tu sesión actual se cerrará',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, salir',
    cancelButtonText: 'Cancelar'
});

if (!result.isConfirmed) return

localStorage.removeItem('token')
localStorage.removeItem('user')

await Swal.fire({
    icon: 'success',
    title: 'Sesión cerrada',
    timer: 1000,
    showConfirmButton: false
});

router.replace('/');
}

</script>



<template>
<div class="container py-2 animate-fade-up">

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
</div>















 <header class="container py-5">
      <div class="row align-items-center">
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
      </div>
    </header>








    <main>
    <RouterView />
    </main>
    

    </div>
</template>