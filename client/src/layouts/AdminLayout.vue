<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.clear()
  router.push('/')
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
          <i class="bi bi-speedometer2"></i>
          <span>Dashboard</span>

        </router-link>



        <router-link :to="{name: 'herramientas'}" class="nav-item" active-class="active">
          <i class="bi bi-people"></i>
          <span>Herramientas</span>
        </router-link>




      <router-link :to="{name: 'seguimiento'}" class="nav-item" active-class="active">
          <i class="bi bi-cone-striped"></i>
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
            <!-- <component :is="Component" :key="route.fullPath"/>   ESTE ERA EL PROBLEMA DEL BUG -->  
            <div :key="route.fullPath"><component :is="Component" />

            </div>
          </transition>


    
        </router-view>
      </section>
    </main>
  </div>

  
</template>





<style scoped>



/* Contenedor Principal */
.admin-wrapper {
  display: flex;
  height: 100vh;
  background-color: #f4f7f6;
}


.sidebar {
  width: 260px;
  background: #1a1c1e; 
  color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.sidebar-header {
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.logo-box {
  background: rgba(255, 255, 255, 0.05);
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.brand-name {
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 0.2rem;
}

.brand-name span {
  color: #ffc107; 
}

.role-badge {
  font-size: 0.65rem;
  letter-spacing: 2px;
  color: #6c757d;
  font-weight: 700;
}

.sidebar-nav {
  flex: 1;
  padding: 0 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #adb5bd;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  background: transparent;
  width: 100%;
}

.nav-item i {
  margin-right: 12px;
  font-size: 1.2rem;
}

.nav-item:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  background: #ffc107;
  color: #000;
  font-weight: 600;
}

.nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1.5rem 0;
}

.logout-btn {
  color: #ff6b6b;
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

/* Contenido Principal */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.content-header {
  height: 70px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 2.5rem;
}

.content-body {
  padding: 2.5rem;
}


.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

</style>
