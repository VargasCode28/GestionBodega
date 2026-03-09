<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

import Swal from 'sweetalert2'


const logout = async () => {
  const result = await Swal.fire({
    title: '¿Cerrar sesion?',
    text: 'Se cerrara tu sesion actual',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Si, cerrar sesion',
    cancelButtonText: 'cancelar'
  })


  if (result.isConfirmed) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')


    Swal.fire({
      icon: 'success',
      title: 'Sesion cerrada',
      showConfirmButton: false,
      timer: 1500
    })


    setTimeout(() => {
      window.location.href ='/'
    },1500)
  }
}



</script>

<template>
  <div class="admin-wrapper">
    <aside class="sidebar shadow-lg">
      <div class="sidebar-header">
        <div class="logo-box">
          <i class="bi bi-building-fill-gear text-warning fs-3"></i>

        </div>

        <h2 class="brand-name">CONSTRU <span>SOFT</span></h2>
        <p class="role-badge">ADMINISTRADOR</p>

      </div>

      <nav class="sidebar-nav">
        <router-link :to="{name: 'admin'}" class="nav-item" active-class="active">
          <i class="bi bi-people"></i>
          <span>Usuarios</span>

        </router-link>



        <router-link :to="{name: 'herramientas'}" class="nav-item" active-class="active">
          <i class="bi bi-tools"></i>
          <span>Herramientas</span>
        </router-link>




      <router-link :to="{name: 'seguimiento'}" class="nav-item" active-class="active">
          <i class="bi bi-clipboard-check"></i>
          <span>Seguimiento</span>
        </router-link>

        <div class="nav-divider"></div>

        <button @click="logout" class="nav-item logout-btn">
          <i class="bi bi-box-arrow-left"></i>

          <span>Cerrar Sesión</span>
        </button>


      </nav>
    </aside>



    <main class="main-content">
      <header class="content-header shadow-sm">
        <div class="header-info">
          <span class="text-muted small fw-bold text-uppercase">Sistema de Gestión Bodega</span>
        </div>
      </header>


      <section class="content-body">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-up" mode="out-in">
            <div :key="route.fullPath"><component :is="Component" />

            </div>
          </transition>


    
        </router-view>
      </section>
    </main>
  </div>

  
</template>


<style scoped

src="/src/styles/AdminLayout.css"
>
</style>
