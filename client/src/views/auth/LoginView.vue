<script setup lang="ts">

import { ref } from 'vue';



const NOMBRE = ref('')
const EMAIL = ref('')
const PASSWORD = ref('')



const loginform = () => {

}



</script>




<template>
    <h1>LOGINFORM</h1>


    <form @submit.prevent="loginform">



        <label for="text">Nombre de Trabajador:</label>
        <input v-model="NOMBRE" type="text">



        <label for="text">Correo electronico:</label>
        <input v-model="EMAIL" type="text">



        <label for="password">Contraseña:</label>
        <input v-model="PASSWORD" type="password">



        <button type="submit">Ingresar</button>

        <p>AQUI SE SUPONE QUE NO SE PUEDE REGISTRAR SOLO EL TRABAJADOR
            TIENE QUE ESPERAR QUE EL ADMIN LOGEE AL TRABAJADOR ESO HACE QUE 
            SEA MAS SEGURO 
        </p>
    </form>


</template>