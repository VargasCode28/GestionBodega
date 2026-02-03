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


        // Guardar sesion (temporalmente en localstorage)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))


        // Redireccion segun rol
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
    <h1>LOGINFORM</h1>


    <form @submit.prevent="loginform">




        <label for="text">Correo electronico:</label>
        <input v-model="EMAIL" type="text">



        <label for="password">Contraseña:</label>
        <input v-model="PASSWORD" type="password">



        <button type="submit">Ingresar</button>


        <p v-if="ERROR">{{ ERROR }}</p>

        <p>
            El trabajador no puede registrarse.
            El acceso es habilitado unicamente por el administrador.
        </p>
    </form>


</template>