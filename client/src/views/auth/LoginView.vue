<script setup lang="ts">

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'



const router = useRouter()



const EMAIL = ref('')
const PASSWORD = ref('')
const ERROR = ref('')



const loginform = async () => {
    ERROR.value = ''


    if(!EMAIL.value || !PASSWORD.value) {
        ERROR.value= 'Todos los campos son obligatorios'
        return
    }



    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: EMAIL.value,
            password: PASSWORD.value
        })


        const  { token, user } = response.data


        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))


        if (user.role === 'ADMIN') {
            router.push('/admin')
        }else {
            router.push('/worker')
        }

    }catch (err: any) {
        ERROR.value =
        err.response?.data?.message ||
        'Credenciales incorrectas o usuario no autorizado'
    
    }
}

</script>




<template>
<div class="login-container d-flex align-items-center justify-content-center">
    <div class="card shadow-sm border-0 p-4   animate-fade-up" style="max-width: 400px; width: 100%;">
    
    <div class="text-center mb-4">
        <h2 class="fw-bold text-uppercase tracking-wider">Constructora</h2>
        <p class="text-muted small">Panel de Acceso Operativo</p>
    </div>

    <form @submit.prevent="loginform">
        <div class="mb-3">
        <label class="form-label small fw-semibold text-secondary">Correo electrónico</label>
        <input 
            v-model="EMAIL" 
            type="email" 
            class="form-control form-control-lg custom-input" 
            placeholder="ejemplo@constructora.com"
        >
        </div>

        <div class="mb-4">
        <label class="form-label small fw-semibold text-secondary">Contraseña</label>
        <input 
            v-model="PASSWORD" 
            type="password" 
            class="form-control form-control-lg custom-input" 
            placeholder="••••••••"
        >
        </div>

        <button type="submit" class="btn btn-dark w-100 py-2 mb-3 fw-bold shadow-sm">
        INGRESAR
        </button>

        <div v-if="ERROR" class="alert alert-danger py-2 small text-center border-0" role="alert">
        {{ ERROR }}
        </div>

        <div class="mt-4 pt-3 border-top text-center">
        <p class="text-muted small lh-sm">
            El acceso es gestionado únicamente por el <strong>administrador</strong>.
        </p>
        </div>
    </form>
    </div>
</div>
</template>



<style scoped>

.login-container {
min-height: 100vh;
background-color: #f8f9fa; 
}

.card {
border-radius: 12px;
}

.custom-input {
border: 1px solid #dee2e6;
font-size: 0.95rem;
transition: all 0.2s ease;
}

.custom-input:focus {
border-color: #212529;
box-shadow: none;
background-color: #fff;
}

.tracking-wider {
letter-spacing: 2px;
}

.btn-dark {
background-color: #212529;
border: none;
transition: background-color 0.3s ease;
}

.btn-dark:hover {
background-color: #000;
}









.animate-fade-up {
    animation: fadeUp 0.8s ease-out forwards;
}



@keyframes fadeUp {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }



}
</style>