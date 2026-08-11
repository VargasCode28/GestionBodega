<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '@/services/api'
import { createInitialAssistantMessage, createUserMessage } from '@/composables/useAdminAssistant'

const router = useRouter()

const isChatOpen = ref(false)
const chatInput = ref('')
const messages = ref([createInitialAssistantMessage()])
const isLoading = ref(false)

const chatPlaceholder = computed(() => (isChatOpen.value ? 'Escribe una pregunta...' : 'Abrir asistente'))

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}

const sendMessage = async () => {
  const text = chatInput.value.trim()
  if (!text || isLoading.value) return

  messages.value.push(createUserMessage(text))
  isLoading.value = true
  chatInput.value = ''

  try {
    const { data } = await api.post('/assistant/chat', { message: text })

    messages.value.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: data.reply,
      from: 'assistant'
    })
  } catch (error) {
    messages.value.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      text: 'No pude contactar al asistente en este momento. Intenta nuevamente en unos segundos.',
      from: 'assistant'
    })
  } finally {
    isLoading.value = false
  }
}

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

    <button class="assistant-fab" @click="toggleChat" type="button" aria-label="Abrir asistente IA">
      <i class="bi bi-robot"></i>
    </button>

    <div v-if="isChatOpen" class="assistant-panel shadow">
      <div class="assistant-header">
        <div>
          <h3>Asistente IA</h3>
          <p>Ayuda rápida para el panel</p>
        </div>
        <button @click="toggleChat" type="button" class="assistant-close" aria-label="Cerrar asistente">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="assistant-messages">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="['assistant-message', message.from === 'user' ? 'user' : 'assistant']"
        >
          {{ message.text }}
        </div>
        <div v-if="isLoading" class="assistant-message assistant loading">
          Escribiendo...
        </div>
      </div>

      <div class="assistant-input-row">
        <input v-model="chatInput" @keyup.enter="sendMessage" :placeholder="chatPlaceholder" type="text" />
        <button @click="sendMessage" type="button" :disabled="isLoading">
          <i class="bi bi-send"></i>
        </button>
      </div>
    </div>
  </div>

  
</template>


<style scoped

src="/src/styles/AdminLayout.css"
>
</style>
