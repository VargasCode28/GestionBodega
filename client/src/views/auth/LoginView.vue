
<script setup lang="ts">
import { useLogin } from '@/composables/useLogin'

const { email, password, errorMessage, isLoading, handleSubmit } = useLogin()
</script>

<template>
<div class="login-container d-flex align-items-center justify-content-center">
    <div class="overlay"></div>

    <div class="card shadow-sm border-0 p-4 animate-fade-up" style="max-width: 400px; width: 100%;">

        <div class="text-center mb-4">
            <div class="logo-box mx-auto mb-3">
                <i class="bi bi-building-gear"></i>
            </div>
            <h2 class="fw-bold text-uppercase tracking-wider mb-0">
                CONSTRU <span class="text-accent">SOFT</span>
            </h2>
            <p class="text-uppercase text-white small mb-1" style="letter-spacing: 2px;"></p>
            <p class="text-white small mb-0">Panel de Acceso Operativo</p>
        </div>

        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label small fw-semibold text-secondary">Correo electrónico</label>
                <input
                    v-model="email"
                    type="email"
                    class="form-control form-control-lg custom-input"
                    placeholder="ejemplo@constructora.com"
                >
            </div>

            <div class="mb-4">
                <label class="form-label small fw-semibold text-secondary">Contraseña</label>
                <input
                    v-model="password"
                    type="password"
                    class="form-control form-control-lg custom-input"
                    placeholder="••••••••"
                >
            </div>

            <button type="submit" :disabled="isLoading" class="btn btn-accent w-100 py-2 mb-3 fw-bold shadow-sm">
                {{ isLoading ? 'Ingresando...' : 'INGRESAR' }}
            </button>

            <div v-if="errorMessage" class="alert alert-danger py-2 small text-center border-0" role="alert">
                {{ errorMessage }}
            </div>

            <div class="mt-4 pt-3 border-top text-center">
                <p class="text-white small lh-sm mb-0">
                    El acceso es gestionado únicamente por el <strong>administrador</strong>.<br>
                    admin@bodega.cl
                </p>
            </div>
        </form>
    </div>
</div>
</template>

<style scoped src="/src/styles/LoginView.css"></style>