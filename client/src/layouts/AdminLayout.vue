<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>

<template>
  <div class="admin-layout">
    <aside>
      <h2>Bodega</h2>
      <router-link to="/admin">Dashboard</router-link>
      <button @click="logout">Salir</button>
    </aside>

    <main>
      <!-- AQUÍ SE RENDERIZAN LAS VISTAS HIJAS -->
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}
aside {
  width: 220px;
  background: #222;
  color: white;
  padding: 1rem;
}
main {
  flex: 1;
  padding: 2rem;
}
</style>
