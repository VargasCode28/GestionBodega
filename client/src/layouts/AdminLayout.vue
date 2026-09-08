<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import api from '@/services/api'
import { createInitialAssistantMessage, createUserMessage } from '@/composables/useAdminAssistant'

const router = useRouter()

const isChatOpen = ref(false)
const chatInput = ref('')
const messages = ref([createInitialAssistantMessage()])
const isLoading = ref(false)
const isListening = ref(false)
const pendingLogoutConfirmation = ref(false)

const chatPlaceholder = computed(() => (isChatOpen.value ? 'Escribe una pregunta...' : 'Abrir asistente'))

let recognition: SpeechRecognitionLike | null = null

const ensureSpeechRecognition = () => {
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognitionCtor) {
    return null
  }

  if (!recognition) {
    recognition = new SpeechRecognitionCtor()
    recognition.lang = 'es-ES'
    recognition.continuous = false
    recognition.interimResults = false
  }

  return recognition
}

const speak = (text: string) => {
  if (!('speechSynthesis' in window)) {
    return
  }

  const voices = window.speechSynthesis.getVoices()
  const preferredVoice = voices.find((voice) => voice.lang.startsWith('es') && voice.name.toLowerCase().includes('natural'))
    || voices.find((voice) => voice.lang.startsWith('es'))
    || voices[0]

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'es-ES'
  utterance.rate = 0.95
  utterance.pitch = 1.06
  utterance.volume = 1

  if (preferredVoice) {
    utterance.voice = preferredVoice
  }

  const normalizedText = text.replace(/\s+/g, ' ').trim()
  const polishedText = normalizedText
    .replace(/\.\s+/g, '. ')
    .replace(/,\s+/g, ', ')
    .replace(/\s+/g, ' ')

  utterance.text = polishedText
  utterance.rate = polishedText.length > 80 ? 0.92 : 0.95

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value
}

const handleAssistantReply = (text: string) => {
  messages.value.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    text,
    from: 'assistant'
  })

  speak(text)
}

const clearConversation = () => {
  messages.value = [createInitialAssistantMessage()]
  handleAssistantReply('Historial limpiado. Puedes seguir hablando conmigo.')
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
      window.location.href = '/'
    }, 1500)
  }
}

const handleLogoutVoice = async () => {
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
      window.location.href = '/'
    }, 1500)
  }
}

const requestLogoutConfirmation = () => {
  pendingLogoutConfirmation.value = true
  handleAssistantReply('¿Quieres cerrar la sesión? Di sí o no.')
}

const handleVoiceCommand = (text: string) => {
  const normalized = text.toLowerCase()

  if (pendingLogoutConfirmation.value) {
    if (normalized.includes('si') || normalized.includes('sí')) {
      pendingLogoutConfirmation.value = false
      void handleLogoutVoice()
      handleAssistantReply('Confirmado. Cerrando sesión.')
      return true
    }

    if (normalized.includes('no')) {
      pendingLogoutConfirmation.value = false
      handleAssistantReply('Entendido. No cerraré la sesión.')
      return true
    }
  }

  if (normalized.includes('limpiar') && (normalized.includes('historial') || normalized.includes('chat'))) {
    clearConversation()
    return true
  }

  if (normalized.includes('cerrar') && (normalized.includes('sesion') || normalized.includes('sesión'))) {
    requestLogoutConfirmation()
    return true
  }

  if (normalized.includes('usuarios') || normalized.includes('usuario')) {
    void router.push({ name: 'admin' })
    handleAssistantReply('Abriendo la sección de usuarios.')
    return true
  }

  if (normalized.includes('herramienta') || normalized.includes('herramientas')) {
    void router.push({ name: 'herramientas' })
    handleAssistantReply('Abriendo la sección de herramientas.')
    return true
  }

  if (normalized.includes('seguimiento')) {
    void router.push({ name: 'seguimiento' })
    handleAssistantReply('Abriendo la sección de seguimiento.')
    return true
  }

  return false
}

const sendMessage = async () => {
  const text = chatInput.value.trim()
  if (!text || isLoading.value) return

  messages.value.push(createUserMessage(text))
  isLoading.value = true
  chatInput.value = ''

  if (handleVoiceCommand(text)) {
    isLoading.value = false
    return
  }

  try {
    const { data } = await api.post('/assistant/chat', { message: text })

    handleAssistantReply(data.reply)
  } catch (error) {
    handleAssistantReply('No pude contactar al asistente en este momento. Intenta nuevamente en unos segundos.')
  } finally {
    isLoading.value = false
  }
}

const startVoiceRecognition = () => {
  const recognizer = ensureSpeechRecognition()

  if (!recognizer) {
    handleAssistantReply('Tu navegador no soporta reconocimiento de voz. Prueba en Chrome o Edge.')
    return
  }

  recognizer.onresult = (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
    const firstResult = event.results[0]
    const firstItem = firstResult?.[0]
    const transcript = firstItem?.transcript?.trim()

    if (transcript) {
      chatInput.value = transcript
      void sendMessage()
    }
  }

  recognizer.onerror = () => {
    isListening.value = false
    handleAssistantReply('No pude escuchar tu voz. Intenta de nuevo.')
  }

  recognizer.onend = () => {
    isListening.value = false
  }

  isListening.value = true
  recognizer.start()
}

const stopVoiceRecognition = () => {
  recognition?.stop()
  isListening.value = false
}

onBeforeUnmount(() => {
  recognition?.stop()
  window.speechSynthesis?.cancel()
})

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
        <button @click="isListening ? stopVoiceRecognition() : startVoiceRecognition()" type="button" class="voice-btn" :class="{ active: isListening }">
          <i class="bi" :class="isListening ? 'bi-mic-fill' : 'bi-mic'" ></i>
        </button>
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
