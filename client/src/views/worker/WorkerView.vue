<script setup lang="ts">
import { ref } from 'vue';


const user = JSON.parse(localStorage.getItem('user') || '{}')

</script>



<template>
    <h1>Panel Trabajador</h1>

    <p>Bienvendio, <strong>{{ user.name }}</strong></p>


    <p>
    Desde aqui podras realizar las acciones asignadas a tu rol.
    </p>

</template>